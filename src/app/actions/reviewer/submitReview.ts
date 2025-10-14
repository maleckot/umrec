// app/actions/submitReview.ts
'use server';

import { createClient } from '@/utils/supabase/server';

export async function submitReview(submissionId: string, answers: any) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    console.log('📝 Submitting review for submission:', submissionId);
    console.log('👤 Reviewer:', user.id);

    // Get reviewer assignment
    const { data: assignment, error: assignmentError } = await supabase
      .from('reviewer_assignments')
      .select('id')
      .eq('submission_id', submissionId)
      .eq('reviewer_id', user.id)
      .single();

    if (assignmentError || !assignment) {
      console.error('❌ No assignment found:', assignmentError);
      return { success: false, error: 'No assignment found for this submission' };
    }

    console.log('✅ Assignment found:', assignment.id);

    // Separate protocol and consent answers
    const protocolAnswers: any = {};
    const consentAnswers: any = {};
    
    Object.keys(answers).forEach(key => {
      if (key.startsWith('icf_')) {
        consentAnswers[key] = answers[key];
      } else if (key.startsWith('q')) {
        protocolAnswers[key] = answers[key];
      }
    });

    console.log('📊 Protocol answers:', Object.keys(protocolAnswers).length);
    console.log('📋 Consent answers:', Object.keys(consentAnswers).length);

    // Insert review
    const { data: review, error: reviewError } = await supabase
      .from('reviews')
      .insert({
        submission_id: submissionId,
        reviewer_id: user.id,
        assignment_id: assignment.id,
        protocol_answers: protocolAnswers,
        consent_answers: consentAnswers,
        recommendation: answers.recommendation,
        disapproval_reasons: answers.disapproval_reasons || null,
        ethics_recommendation: answers.ethics_recommendation,
        technical_suggestions: answers.technical_suggestions || null,
        status: 'submitted',
        submitted_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (reviewError) {
      console.error('❌ Review insert error:', reviewError);
      return { success: false, error: reviewError.message };
    }

    console.log('✅ Review created:', review.id);

    // Update assignment status to completed
    const { error: updateError } = await supabase
      .from('reviewer_assignments')
      .update({ 
        status: 'review_complete',
        completed_at: new Date().toISOString()
      })
      .eq('id', assignment.id);

    if (updateError) {
      console.error('⚠️  Warning: Failed to update assignment status:', updateError);
    } else {
      console.log('✅ Assignment marked as completed');
    }

    // Check if all reviewers have completed their reviews
    const { data: allAssignments } = await supabase
      .from('reviewer_assignments')
      .select('status')
      .eq('submission_id', submissionId);

    console.log('📊 All assignments:', allAssignments);

    const allCompleted = allAssignments?.every(a => a.status === 'completed');
    console.log('🔍 All completed?', allCompleted);

    if (allCompleted) {
      console.log('✅ All reviewers completed - updating submission status');
      
      // ✅ ADD ERROR CHECKING HERE
      const { data: updatedSubmission, error: submissionUpdateError } = await supabase
        .from('research_submissions')
        .update({ status: 'reviewed' })
        .eq('id', submissionId)
        .select();  

      if (submissionUpdateError) {
        console.error('❌ Failed to update submission status:', submissionUpdateError);
        console.error('Error details:', JSON.stringify(submissionUpdateError, null, 2));
        
        // Return success for review but warn about status update failure
        return {
          success: true,
          reviewId: review.id,
          message: 'Review submitted successfully, but failed to update submission status',
          warning: submissionUpdateError.message
        };
      }

      console.log('✅ Submission status updated:', updatedSubmission);
    } else {
      console.log('⏳ Waiting for other reviewers to complete');
    }

    return { 
      success: true, 
      reviewId: review.id,
      message: 'Review submitted successfully'
    };

  } catch (error) {
    console.error('❌ Submit review error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit review'
    };
  }
}
