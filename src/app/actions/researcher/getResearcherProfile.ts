'use server';

import { createClient } from '@/utils/supabase/server';

// ✅ Helper function to parse full name
function parseFullName(fullName: string) {
  if (!fullName) return { firstName: '', middleName: '', lastName: '' };
  
  const parts = fullName.trim().split(/\s+/);
  
  if (parts.length === 1) {
    return { firstName: parts[0], middleName: '', lastName: '' };
  } else if (parts.length === 2) {
    return { firstName: parts[0], middleName: '', lastName: parts[1] };
  } else {
    // Last element is last name, first is first name, rest is middle name
    return {
      firstName: parts[0],
      middleName: parts.slice(1, -1).join(' '),
      lastName: parts[parts.length - 1],
    };
  }
}

export async function getResearcherProfile() {
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

    // ✅ Parse full_name into parts
    const { firstName, middleName, lastName } = parseFullName(profile.full_name || '');

    // Get user's submissions
    const { data: submissions, error: submissionsError } = await supabase
      .from('research_submissions')
      .select(`
        id,
        submission_id,
        title,
        status,
        created_at,
        submitted_at
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // Get documents for each submission
    const submissionsWithDocs = await Promise.all(
      (submissions || []).map(async (submission) => {
        const { data: documents } = await supabase
          .from('uploaded_documents')
          .select('id, file_name, file_url, uploaded_at')
          .eq('submission_id', submission.id)
          .order('uploaded_at', { ascending: false });

        // Get signed URLs for documents
        const docsWithUrls = await Promise.all(
          (documents || []).map(async (doc) => {
            const { data: urlData } = await supabase.storage
              .from('research-documents')
              .createSignedUrl(doc.file_url, 3600);

            return {
              ...doc,
              signedUrl: urlData?.signedUrl || null,
            };
          })
        );

        return {
          ...submission,
          documents: docsWithUrls,
        };
      })
    );

    return {
      success: true,
      profile: {
        id: profile.id,
        email: user.email,
        fullName: profile.full_name,
        firstName: firstName,        // ✅ Parsed
        middleName: middleName,      // ✅ Parsed
        lastName: lastName,          // ✅ Parsed
        dateOfBirth: profile.date_of_birth,
        contactNumber: profile.phone,
        gender: profile.gender,
        school: profile.school,
        college: profile.college,
        program: profile.program,
        yearLevel: profile.year_level,
        section: profile.section,
        studentNo: profile.student_no,
        organization: profile.organization,
        username: profile.username,
      },
      submissions: submissionsWithDocs.map((sub) => ({
        id: sub.id,
        submissionId: sub.submission_id,
        title: sub.title,
        status: sub.status,
        date: new Date(sub.submitted_at || sub.created_at).toLocaleDateString('en-US', {
          month: 'numeric',
          day: 'numeric',
          year: '2-digit',
        }),
        documents: sub.documents,
      })),
    };
  } catch (error) {
    console.error('Error fetching profile:', error);
    return {
      success: false,
      error: 'Failed to fetch profile data',
    };
  }
}
