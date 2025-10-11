// src/app/actions/completeVerification.ts
'use server';

import { verifySubmissionDocuments } from './verifySubmissionDocuments';

type VerificationResult = 
  | { success: true }
  | { success: false; error: string };

export async function completeVerification(
  submissionId: string,
  verifications: Array<{ documentId: string; isApproved: boolean; comment: string }>
): Promise<VerificationResult> {
  try {
    // Just verify documents - PDF generation happens on next page
    const result = await verifySubmissionDocuments(
      submissionId,
      verifications,
      'All documents have been verified and approved.'
    );

    if (!result.success) {
      return { success: false, error: result.error || 'Verification failed' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in completeVerification:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
