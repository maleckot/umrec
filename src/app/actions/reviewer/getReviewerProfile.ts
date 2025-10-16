// app/actions/reviewer/getReviewerProfile.ts
'use server';

import { createClient } from '@/utils/supabase/server';

export async function getReviewerProfile() {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Get profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      return { success: false, error: 'Failed to fetch profile' };
    }

    // Get reviewer assignments to calculate statistics
    const { data: assignments, error: assignmentsError } = await supabase
      .from('reviewer_assignments')
      .select(`
        *,
        research_submissions(
          classification_type,
          status
        )
      `)
      .eq('reviewer_id', user.id);

    // Calculate statistics
    const now = new Date();
    const currentMonthYear = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    let totalReviewed = 0;
    let expedited = 0;
    let fullReview = 0;
    let overdue = 0;

    if (assignments) {
      assignments.forEach((assignment: any) => {
        // Count completed reviews
        if (assignment.status === 'completed') {
          totalReviewed++;
          
          // Check classification type
          if (assignment.research_submissions?.classification_type === 'expedited') {
            expedited++;
          } else if (assignment.research_submissions?.classification_type === 'full_review') {
            fullReview++;
          }
        }
        
        // Count overdue (not completed and past due date)
        if (assignment.status !== 'completed' && assignment.due_date) {
          const dueDate = new Date(assignment.due_date);
          if (dueDate < now) {
            overdue++;
          }
        }
      });
    }

    // Get last password change (from auth metadata)
    const lastPasswordChange = profile.updated_at 
      ? getTimeAgo(new Date(profile.updated_at))
      : 'Never';

    return {
      success: true,
      profile: {
        id: profile.id,
        fullName: profile.full_name || `${profile.first_name} ${profile.last_name}`,
        email: user.email,
        department: profile.department || 'N/A',
        title: profile.title || 'N/A',
        expertiseAreas: profile.expertise_areas || [],
        lastPasswordChange,
      },
      statistics: {
        totalReviewed,
        expedited,
        fullReview,
        overdue,
      },
    };
  } catch (error) {
    console.error('Error fetching reviewer profile:', error);
    return {
      success: false,
      error: 'Failed to fetch profile data',
    };
  }
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffYears > 0) {
    return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
  } else if (diffMonths > 0) {
    return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
  } else if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else {
    return 'Today';
  }
}
