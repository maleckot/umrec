  'use server';

  import { createClient } from '@/utils/supabase/server';
  import { generateApprovalDocuments } from '@/utils/pdf/generateApprovalDocs';

  export async function submitReview(submissionId: string, answers: any, formVersionId: string) {
    try {
      const supabase = await createClient();
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        return { success: false, error: 'Not authenticated' };
      }

      console.log('📝 Submitting review for submission:', submissionId);
      console.log('👤 Reviewer ID:', user.id);

      // Get reviewer assignment
      const { data: assignment, error: assignmentError } = await supabase
        .from('reviewer_assignments')
        .select('id')
        .eq('submission_id', submissionId)
        .eq('reviewer_id', user.id)
        .single();

      if (assignmentError || !assignment) {
        return { success: false, error: 'No assignment found for this submission' };
      }

      console.log('✅ Assignment found:', assignment.id);

      // Separate answers
      const protocolAnswers: any = {};
      const consentAnswers: any = {};

      Object.keys(answers).forEach(key => {
        if (key.startsWith('icf_')) {
          consentAnswers[key] = answers[key];
        } else if (key.startsWith('q')) {
          protocolAnswers[key] = answers[key];
        }
      });

      // ✅ UPSERT: Insert new review OR update existing one
      const { data: review, error: reviewError } = await supabase
        .from('reviews')
        .upsert({
          assignment_id: assignment.id,  // ← Unique key to identify the review
          submission_id: submissionId,
          reviewer_id: user.id,
          form_version_id: formVersionId,
          protocol_answers: protocolAnswers,
          consent_answers: consentAnswers,
          protocol_recommendation: answers.protocol_recommendation,
          protocol_disapproval_reasons: answers.protocol_disapproval_reasons || null,
          protocol_ethics_recommendation: answers.protocol_ethics_recommendation,
          protocol_technical_suggestions: answers.protocol_technical_suggestions || null,
          icf_recommendation: answers.icf_recommendation,
          icf_disapproval_reasons: answers.icf_disapproval_reasons || null,
          icf_ethics_recommendation: answers.icf_ethics_recommendation,
          icf_technical_suggestions: answers.icf_technical_suggestions || null,
          status: 'submitted',
          submitted_at: new Date().toISOString(),
        }, {
          onConflict: 'assignment_id' // ← Tell Supabase to use assignment_id as unique key
        })
        .select()
        .single();

      if (reviewError) {
        console.error('❌ Review upsert error:', reviewError);
        return { success: false, error: reviewError.message };
      }

      console.log('✅ Review created/updated:', review.id);

      // Update assignment status to review_complete
      const { error: updateError } = await supabase
        .from('reviewer_assignments')
        .update({
          status: 'review_complete',
          completed_at: new Date().toISOString()
        })
        .eq('id', assignment.id);

      if (updateError) {
        console.error('⚠️ Failed to update assignment:', updateError);
      } else {
        console.log('✅ Assignment marked as review_complete');
      }

      // Update submission to under_review if pending
      const { data: submission } = await supabase
        .from('research_submissions')
        .select('status')
        .eq('id', submissionId)
        .single();

      if (submission?.status === 'pending') {
        console.log('🔄 Updating submission to under_review');
        await supabase
          .from('research_submissions')
          .update({
            status: 'under_review',
            updated_at: new Date().toISOString()
          })
          .eq('id', submissionId);
      }

      // Check all reviewer assignments
      const { data: allAssignments, error: assignmentsError } = await supabase
        .from('reviewer_assignments')
        .select('status')
        .eq('submission_id', submissionId);

      if (assignmentsError) {
        console.error('❌ Error fetching assignments:', assignmentsError);
        return {
          success: true,
          reviewId: review.id,
          message: 'Review submitted successfully'
        };
      }

      console.log(`📊 Total assignments: ${allAssignments?.length || 0}`);

      const allCompleted = 
        allAssignments && 
        allAssignments.length > 0 && 
        allAssignments.every(a => a.status === 'review_complete');

      console.log(`✅ All reviewers complete? ${allCompleted}`);

      // Only if ALL reviewers complete
      if (allCompleted) {
        console.log('✅ All reviewers completed - checking recommendations');

        const { data: allReviews, error: reviewsError } = await supabase
          .from('reviews')
          .select('protocol_recommendation, icf_recommendation, reviewer_id')
          .eq('submission_id', submissionId);

        if (reviewsError) {
          console.error('❌ Failed to fetch reviews:', reviewsError);
          return {
            success: true,
            reviewId: review.id,
            message: 'Review submitted, waiting for final status'
          };
        }

        const hasRevisionNeeded = allReviews?.some(r =>
          r.protocol_recommendation === 'Major Revision' ||
          r.protocol_recommendation === 'Disapproved' ||
          r.icf_recommendation === 'Major Revision' ||
          r.icf_recommendation === 'Disapproved'
        );

        const finalStatus = hasRevisionNeeded ? 'under_revision' : 'approved';

        console.log(`🎯 Final status: ${finalStatus}`);

        const { error: statusError } = await supabase
          .from('research_submissions')
          .update({
            status: finalStatus,
            updated_at: new Date().toISOString()
          })
          .eq('id', submissionId);

        if (statusError) {
          console.error('❌ Failed to update status:', statusError);
          return {
            success: true,
            reviewId: review.id,
            message: 'Review submitted, but failed to finalize status'
          };
        }

        console.log(`✅ Submission status updated to: ${finalStatus}`);

        // Generate documents only if approved
        if (finalStatus === 'approved') {
          console.log('📄 Generating approval documents...');
          try {
            await generateApprovalDocuments(submissionId);
            console.log('✅ Approval documents generated');
          } catch (genError) {
            console.error('⚠️ Failed to generate documents:', genError);
          }
        }
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
