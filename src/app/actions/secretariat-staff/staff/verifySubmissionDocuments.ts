  // src/app/actions/verifySubmissionDocuments.ts
  'use server';

  import { createClient } from '@/utils/supabase/server';
  import { revalidatePath } from 'next/cache';

  export async function verifySubmissionDocuments(
    submissionId: string,
    documentVerifications: Array<{
      documentId: string;
      isApproved: boolean;
      comment?: string;
    }>,
    overallFeedback?: string
  ) {
    try {
      const supabase = await createClient();

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profile || !['staff', 'admin'].includes(profile.role)) {
        return { success: false, error: 'Unauthorized' };
      }

      // ✅ Get submission classification FIRST
      const { data: submission } = await supabase
        .from('research_submissions')
        .select('classification_type, status')
        .eq('id', submissionId)
        .single();

      if (!submission) {
        return { success: false, error: 'Submission not found' };
      }

      for (const doc of documentVerifications) {
        const { error: upsertError } = await supabase.from('document_verifications').upsert({
          document_id: doc.documentId,
          submission_id: submissionId,
          verified_by: user.id,
          is_approved: doc.isApproved,
          feedback_comment: doc.comment || null,
          verified_at: new Date().toISOString(),
        }, {
          onConflict: 'document_id,submission_id',
        });

        if (upsertError) {
          console.error('Upsert error:', upsertError);
        }
      }

      // 2. Determine overall status
      const allApproved = documentVerifications.every(d => d.isApproved);
      const hasRejected = documentVerifications.some(d => !d.isApproved);

      let newStatus = 'pending_review';
      let verificationStatus = 'pending_verification';
      let feedback = overallFeedback || null;

      if (hasRejected) {
        newStatus = 'needs_revision';
        verificationStatus = 'needs_revision';
        if (!feedback) {
          const rejectedDoc = documentVerifications.find(d => !d.isApproved);
          feedback = rejectedDoc?.comment || 'Some documents need revision.';
        }
      } else if (allApproved) {
        // ✅ CHECK IF HAS CLASSIFICATION
        if (submission.classification_type) {
          // Already classified → go to "resubmit" (for reassignment)
          newStatus = 'resubmit';
        } else {
          // No classification yet → go to awaiting_classification
          newStatus = 'awaiting_classification';
        }
        verificationStatus = 'verified';
      }

      console.log('🔍 Debug before update:', {
        hasClassification: !!submission.classification_type,
        allApproved,
        hasRejected,
        newStatus,
        verificationStatus,
        overallFeedback,
        submissionId,
        willUpdate: hasRejected || overallFeedback !== undefined || allApproved
      });

      if (hasRejected || overallFeedback !== undefined || allApproved) {
        console.log('📝 Attempting to update research_submissions...');
        
        const { error: updateError } = await supabase
          .from('research_submissions')
          .update({
            status: newStatus,
            verification_status: verificationStatus,
            verification_feedback: feedback,
            verified_by: user.id,
            verified_at: new Date().toISOString(),
          })
          .eq('id', submissionId);

        if (updateError) {
          console.error('Error updating submission:', updateError);
          return { success: false, error: 'Failed to update submission status' };
        } else {
          console.log('✅ Submission updated successfully!');
        }
      } else {
        console.log('⏭️ Skipping submission update (not needed)');
      }

      revalidatePath('/staffmodule/submissions');
      
      return { 
        success: true, 
        status: newStatus,
        hasClassification: !!submission.classification_type,
        allApproved,
        hasRejected,
        message: allApproved 
          ? submission.classification_type 
            ? '✅ Verified. Moving to reassign reviewer.'
            : '✅ Verified. Moving to classification.'
          : undefined
      };

    } catch (error) {
      console.error('Verification error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to verify documents'
      };
    }
  }
