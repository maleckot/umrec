// app/actions/submitReview.ts
'use server';

import { createClient } from '@/utils/supabase/server';
import { generateApprovalDocuments } from '@/utils/pdf/generateApprovalDocs'; // ✅ Add import

export async function submitReview(submissionId: string, answers: any, formVersionId: string) {
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
        form_version_id: formVersionId,
        protocol_answers: protocolAnswers,
        consent_answers: consentAnswers,

        // Protocol Review fields
        protocol_recommendation: answers.protocol_recommendation,
        protocol_disapproval_reasons: answers.protocol_disapproval_reasons || null,
        protocol_ethics_recommendation: answers.protocol_ethics_recommendation,
        protocol_technical_suggestions: answers.protocol_technical_suggestions || null,

        // ICF Review fields
        icf_recommendation: answers.icf_recommendation,
        icf_disapproval_reasons: answers.icf_disapproval_reasons || null,
        icf_ethics_recommendation: answers.icf_ethics_recommendation,
        icf_technical_suggestions: answers.icf_technical_suggestions || null,

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

    const allCompleted = allAssignments?.every(a => a.status === 'review_complete');
    console.log('🔍 All completed?', allCompleted);

    if (allCompleted) {
      console.log('✅ All reviewers completed - checking recommendations');

      // ✅ Fetch all reviews to check recommendations
      const { data: allReviews, error: reviewsError } = await supabase
        .from('reviews')
        .select('protocol_recommendation, icf_recommendation')
        .eq('submission_id', submissionId);

      if (reviewsError) {
        console.error('❌ Failed to fetch reviews:', reviewsError);
        return {
          success: true,
          reviewId: review.id,
          message: 'Review submitted successfully, but failed to determine final status',
          warning: reviewsError.message
        };
      }

      // ✅ Check if any review has "Major Revision" or "Disapproved"
      const hasRevisionNeeded = allReviews?.some(r =>
        r.protocol_recommendation === 'Major Revision' ||
        r.protocol_recommendation === 'Disapproved' ||
        r.icf_recommendation === 'Major Revision' ||
        r.icf_recommendation === 'Disapproved'
      );

      // ✅ Determine final status
      const finalStatus = hasRevisionNeeded ? 'needs_revision' : 'approved';

      console.log('📊 All protocol recommendations:', allReviews?.map(r => r.protocol_recommendation));
      console.log('📊 All ICF recommendations:', allReviews?.map(r => r.icf_recommendation));
      console.log('🎯 Final status:', finalStatus);

      // Update submission status
      const { data: updatedSubmission, error: submissionUpdateError } = await supabase
        .from('research_submissions')
        .update({ status: finalStatus })
        .eq('id', submissionId)
        .select();

      if (submissionUpdateError) {
        console.error('❌ Failed to update submission status:', submissionUpdateError);
        console.error('Error details:', JSON.stringify(submissionUpdateError, null, 2));

        return {
          success: true,
          reviewId: review.id,
          message: 'Review submitted successfully, but failed to update submission status',
          warning: submissionUpdateError.message
        };
      }

      console.log(`✅ Submission status updated to: ${finalStatus}`, updatedSubmission);

      // ✅✅✅ GENERATE APPROVAL DOCUMENTS IF APPROVED ✅✅✅
      if (finalStatus === 'approved') {
        console.log('📄 Generating approval documents...');
        try {
          await generateApprovalDocuments(submissionId);
          console.log('✅ Approval documents generated successfully!');
        } catch (genError) {
          console.error('⚠️  Warning: Failed to generate approval documents:', genError);
          // Don't fail the whole operation, just log the error
        }
      }
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
