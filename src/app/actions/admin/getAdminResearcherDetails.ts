// app/actions/admin/getResearcherDetails.ts
'use server';

import { createClient } from '@/utils/supabase/server';

export async function getResearcherDetails(researcherId: string) {
  try {
    const supabase = await createClient();

    // Verify admin permission
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data: adminProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (adminProfile?.role !== 'admin') {
      return { success: false, error: 'Unauthorized' };
    }

    // Get researcher profile
    const { data: researcher, error: researcherError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', researcherId)
      .eq('role', 'researcher')
      .single();

    if (researcherError || !researcher) {
      return { success: false, error: 'Researcher not found' };
    }

    // Get researcher's submissions with documents
    const { data: submissions, error: submissionsError } = await supabase
      .from('research_submissions')
      .select(`
        id,
        submission_id,
        title,
        status,
        created_at,
        submitted_at,
        co_authors
      `)
      .eq('user_id', researcherId)
      .order('created_at', { ascending: false });

    // Format submissions with time ago
    const formattedSubmissions = (submissions || []).map((sub: any) => {
      const submittedDate = sub.submitted_at || sub.created_at;
      const timeAgo = getTimeAgo(new Date(submittedDate));
      
      return {
        id: sub.id,
        submissionId: sub.submission_id,
        title: sub.title || 'Untitled Research',
        submittedDate: timeAgo,
        status: sub.status,
      };
    });

    // Determine organization type
    const organizationType = researcher.organization?.toLowerCase().includes('external') 
      ? 'External' 
      : 'Internal';

    return {
      success: true,
      researcher: {
        id: researcher.id,
        name: researcher.full_name || `${researcher.first_name} ${researcher.last_name}`.trim(),
        phone: researcher.phone || 'N/A',
        email: researcher.email || 'N/A',
        gender: researcher.gender || 'N/A',
        studentNumber: researcher.student_number || null,
        yearLevel: researcher.year_level || null,
        section: researcher.section || null,
        university: researcher.school || 'N/A',
        degree: researcher.program || 'N/A',
        organization: organizationType,
        college: researcher.college || 'N/A',
      },
      submissions: formattedSubmissions,
    };
  } catch (error) {
    console.error('Error fetching researcher details:', error);
    return {
      success: false,
      error: 'Failed to fetch researcher details',
    };
  }
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffYears > 0) {
    return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
  } else if (diffMonths > 0) {
    return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
  } else if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else if (diffMins > 0) {
    return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
}
