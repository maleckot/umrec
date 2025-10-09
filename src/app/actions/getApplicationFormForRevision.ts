// src/app/actions/getApplicationFormForRevision.ts
'use server';

import { createClient } from '@/utils/supabase/server';

export async function getApplicationFormForRevision(submissionId: string) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { success: false, error: 'Not authenticated', data: null };
    }

    // Get application form data from database
    const { data: appForm, error } = await supabase
      .from('application_forms')
      .select('*')
      .eq('submission_id', submissionId)
      .single();
        
    if (error || !appForm) {
      return { success: false, error: 'Application form not found', data: null };
    }

    // Extract contact_info JSON
    const contactInfo = appForm.contact_info || {};
    const studyDuration = appForm.study_duration || {};
    const docChecklist = appForm.document_checklist || {};

    return {
      success: true,
      data: {
        // Basic fields
        title: appForm.title || '',
        studySite: appForm.study_site || '',
        studySiteType: appForm.study_site_type || '',
        
        // Researcher name
        researcherFirstName: appForm.researcher_first_name || '',
        researcherMiddleName: appForm.researcher_middle_name || '',
        researcherLastName: appForm.researcher_last_name || '',
        
        // Contact info (from JSON column)
        telNo: contactInfo.telNo || '',
        mobileNo: contactInfo.mobileNo || '',
        email: contactInfo.email || '',
        faxNo: contactInfo.faxNo || 'N/A',
        
        // Institution details
        coResearcher: appForm.co_researcher || '',
        college: appForm.college || '',
        institution: appForm.institution || 'University of Makati',
        institutionAddress: appForm.institution_address || '',
        
        // Study details
        typeOfStudy: appForm.type_of_study || [],
        typeOfStudyOthers: appForm.type_of_study_others || '',
        sourceOfFunding: appForm.source_of_funding || [],
        pharmaceuticalSponsor: appForm.pharmaceutical_sponsor || '',
        fundingOthers: appForm.funding_others || '',
        
        // Duration (from JSON column)
        startDate: studyDuration.startDate || '',
        endDate: studyDuration.endDate || '',
        
        // Participants and reviews
        numParticipants: appForm.num_participants?.toString() || '',
        technicalReview: appForm.technical_review || '',
        submittedToOther: appForm.submitted_to_other || '',
        
        // Document checklist (from JSON column)
        hasApplicationForm: docChecklist.hasApplicationForm || true,
        hasResearchProtocol: docChecklist.hasResearchProtocol || false,
        hasInformedConsentEnglish: docChecklist.hasInformedConsentEnglish || false,
        hasInformedConsentFilipino: docChecklist.hasInformedConsentFilipino || false,
        hasInformedConsentOthers: docChecklist.hasInformedConsentOthers || false,
        informedConsentOthers: docChecklist.informedConsentOthers || '',
        hasAssentFormEnglish: docChecklist.hasAssentFormEnglish || false,
        hasAssentFormFilipino: docChecklist.hasAssentFormFilipino || false,
        hasAssentFormOthers: docChecklist.hasAssentFormOthers || false,
        assentFormOthers: docChecklist.assentFormOthers || '',
        hasEndorsementLetter: docChecklist.hasEndorsementLetter || false,
        hasQuestionnaire: docChecklist.hasQuestionnaire || false,
        hasDataCollectionForms: docChecklist.hasDataCollectionForms || false,
        hasProductBrochure: docChecklist.hasProductBrochure || false,
        hasFDAAuthorization: docChecklist.hasFDAAuthorization || false,
        hasSpecialPopulationPermit: docChecklist.hasSpecialPopulationPermit || false,
        specialPopulationPermitDetails: docChecklist.specialPopulationPermitDetails || '',
        hasOtherDocs: docChecklist.hasOtherDocs || false,
        otherDocsDetails: docChecklist.otherDocsDetails || '',
        
        // File will be null (can't retrieve files from database)
        technicalReviewFile: null,
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to load application form',
      data: null
    };
  }
}
