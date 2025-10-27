// utils/revisionHelpers.ts
import { createClient } from '@/utils/supabase/client';

export interface QuickRevisionResult {
  success: boolean;
  error?: string;
}

export async function handleQuickRevision(
  submissionId: string,
  docId: string,
  file: File
): Promise<QuickRevisionResult> {
  const supabase = createClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Upload to storage
    const timestamp = Date.now();
    const filePath = `${user.id}/${submissionId}/doc_${timestamp}.pdf`;
    const { error: uploadError } = await supabase.storage
      .from('research-documents')
      .upload(filePath, file);

    if (uploadError) {
      return { success: false, error: uploadError.message };
    }

    // Update document record
    const { error: updateError } = await supabase
      .from('uploaded_documents')
      .update({
        file_url: filePath,
        file_name: file.name,
        file_size: file.size,
        uploaded_at: new Date().toISOString(),
      })
      .eq('id', docId);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    // Reset verification (optional - won't fail if error)
    try {
      await supabase
        .from('document_verifications')
        .update({
          is_approved: null,
          feedback_comment: null,
          verified_at: null,
        })
        .eq('document_id', docId);
    } catch (verifyError) {
      console.warn('Could not reset verification:', verifyError);
    }

    // Update submission status
    const { error: statusError } = await supabase
      .from('research_submissions')
      .update({
        status: 'Resubmit',
        updated_at: new Date().toISOString(),
      })
      .eq('id', submissionId);

    if (statusError) {
      return { success: false, error: statusError.message };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Unknown error' };
  }
}
