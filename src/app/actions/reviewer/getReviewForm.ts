// app/actions/reviewer/getReviewForm.ts
'use server';

import { createClient } from '@/utils/supabase/server';

export async function getReviewForm() {
  try {
    const supabase = await createClient();

    // Get current user to verify access
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Get active form version
    const { data: formVersion, error: versionError } = await supabase
      .from('review_form_versions')
      .select('*')
      .eq('is_active', true)
      .single();

    if (versionError) {
      console.error('Error fetching form version:', versionError);
      return { success: false, error: 'No active review form found' };
    }

    // Get sections with questions
    const { data: sections, error: sectionsError } = await supabase
      .from('review_sections')
      .select(`
        id,
        title,
        subtitle,
        order_index,
        review_questions (
          id,
          question_id,
          question_text,
          question_type,
          options,
          depends_on,
          is_required,
          order_index
        )
      `)
      .eq('form_version_id', formVersion.id)
      .order('order_index', { ascending: true });

    if (sectionsError) {
      console.error('Error fetching sections:', sectionsError);
      return { success: false, error: sectionsError.message };
    }

    const formattedSections = sections.map((section: any, index: number) => {
      const title = section.title.toLowerCase();

      // ✅ UPDATED: More specific matching
      const isLastProtocol = title.includes('protocol') &&
        title.includes('final') &&
        title.includes('recommendation');

      const isLastICF = title.includes('consent') &&
        title.includes('final') &&
        title.includes('recommendation');  // ✅ This prevents matching "Final Questions"

      console.log(`📋 Section ${index + 1}/${sections.length}: "${section.title}"`, {
        isProtocol: isLastProtocol,
        isICF: isLastICF
      });

      return {
        id: section.id,
        title: section.title,
        subtitle: section.subtitle,
        isLastProtocolSection: isLastProtocol,
        isLastICFSection: isLastICF,
        questions: section.review_questions
          .sort((a: any, b: any) => a.order_index - b.order_index)
          .map((q: any) => ({
            id: q.question_id,
            question: q.question_text,
            type: q.question_type,
            options: q.options,
            dependsOn: q.depends_on,
            required: q.is_required,
          })),
      };
    });


    console.log('✅ Total sections:', formattedSections.length);
    console.log('✅ Sections with flags:', formattedSections.map(s => ({
      title: s.title,
      isLastProtocol: s.isLastProtocolSection,
      isLastICF: s.isLastICFSection
    })));

    return {
      success: true,
      formVersion: {
        id: formVersion.id,
        name: formVersion.version_name,
        type: formVersion.form_type,
      },
      sections: formattedSections,
    };
  } catch (error) {
    console.error('Error in getReviewForm:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to load review form',
    };
  }
}
