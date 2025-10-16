// app/actions/admin/getResearchers.ts
'use server';

import { createClient } from '@/utils/supabase/server';

export async function getResearchers() {
  try {
    const supabase = await createClient();

    // Verify admin permission
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Not authenticated', researchers: [] };
    }

    const { data: adminProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (adminProfile?.role !== 'admin') {
      return { success: false, error: 'Unauthorized', researchers: [] };
    }

    // Get all researchers
    const { data: researchers, error: researchersError } = await supabase
      .from('profiles')
      .select(`
        id,
        full_name,
        email,
        organization,
        school,
        college,
        program,
        student_number
      `)
      .eq('role', 'researcher')
      .order('full_name', { ascending: true });

    if (researchersError) {
      console.error('Researchers fetch error:', researchersError);
      return { success: false, error: 'Failed to fetch researchers', researchers: [] };
    }

    // Get submission count for each researcher
    const researchersWithStats = await Promise.all(
      (researchers || []).map(async (researcher) => {
        // Get all submissions for this researcher
        const { data: submissions, count } = await supabase
          .from('research_submissions')
          .select('id, status', { count: 'exact' })
          .eq('user_id', researcher.id);

        const totalSubmissions = count || 0;

        // Determine organization type
        const organizationType = researcher.organization?.toLowerCase().includes('external') 
          ? 'External' 
          : 'Internal (UMAK)';

        return {
          id: researcher.id,
          name: researcher.full_name,
          email: researcher.email,
          organization: organizationType,
          college: researcher.college || 'N/A',
          school: researcher.school,
          program: researcher.program,
          studentNo: researcher.student_number,
          totalSubmissions,
        };
      })
    );

    return {
      success: true,
      researchers: researchersWithStats,
    };
  } catch (error) {
    console.error('Error fetching researchers:', error);
    return {
      success: false,
      error: 'Failed to fetch researchers',
      researchers: [],
    };
  }
}
