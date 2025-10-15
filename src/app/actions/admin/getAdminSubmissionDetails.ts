// app/actions/admin/getAdminSubmissiondetails.ts
'use server';

import { createClient } from '@/utils/supabase/server';
interface Reviewer {
  id: string;
  full_name: string;
}
export async function getSubmissionDetails(submissionId: string) {
  try {
    const supabase = await createClient();

    // Verify user is admin
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return { success: false, error: 'Unauthorized' };
    }

    // Fetch submission details
    const { data: submission, error: submissionError } = await supabase
      .from('research_submissions')
      .select('*')
      .eq('id', submissionId)
      .single();

    if (submissionError) {
      console.error('Error fetching submission:', submissionError);
      return { success: false, error: submissionError.message };
    }

    // Fetch researcher profile
    const { data: researcher } = await supabase
      .from('profiles')
      .select('id, full_name, email, organization, school, college')
      .eq('id', submission.user_id)
      .single();

    // Fetch uploaded documents
    const { data: documents } = await supabase
      .from('uploaded_documents')
      .select('id, document_type, file_name, file_url, uploaded_at')
      .eq('submission_id', submissionId)
      .order('uploaded_at', { ascending: true });

    // Fetch reviewer assignments
    const { data: assignments } = await supabase
      .from('reviewer_assignments')
      .select('id, reviewer_id, status, due_date, assigned_at')
      .eq('submission_id', submissionId);

    // Fetch reviewer profiles
    let reviewers: any[] = []; // Or create a proper type interface
    if (assignments && assignments.length > 0) {
    const reviewerIds = assignments.map(a => a.reviewer_id);
    const { data: reviewerProfiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', reviewerIds);

    reviewers = reviewerProfiles || [];
    }

    // Fetch reviews
    const { data: reviews } = await supabase
      .from('reviews')
      .select('*')
      .eq('submission_id', submissionId);

    // Fetch submission history
    const { data: history } = await supabase
      .from('submission_history')
      .select('*')
      .eq('submission_id', submissionId)
      .order('created_at', { ascending: true });

    console.log('✅ Fetched submission details for:', submissionId);

    return {
      success: true,
      submission,
      researcher,
      documents: documents || [],
      assignments: assignments || [],
      reviewers: reviewers || [],
      reviews: reviews || [],
      history: history || [],
    };

  } catch (error) {
    console.error('Error in getSubmissionDetails:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch submission details',
    };
  }
}
