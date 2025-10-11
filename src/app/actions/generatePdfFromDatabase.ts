// src/app/actions/generatePdfFromDatabase.ts
'use server';

import { createClient } from '@/utils/supabase/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// Type definition for the return value
export type PdfGenerationResult = 
  | {
      success: true;
      pdfData: string;
      fileName: string;
      pageCount: number;
    }
  | {
      success: false;
      error: string;
    };

// ✅ EXPORT THIS FUNCTION - Used by both database fetching AND form submission
export async function generateConsolidatedPdf(
  submissionData: any,
  uploadedFiles: { step5?: string; step6?: string; step7?: string }
): Promise<{ success: boolean; pdfData?: string; fileName?: string; pageCount?: number; error?: string }> {
  try {
    return await generateConsolidatedPdfContent(submissionData, uploadedFiles);
  } catch (error) {
    console.error('PDF generation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate PDF',
    };
  }
}

export async function generatePdfFromDatabase(submissionId: string): Promise<PdfGenerationResult> {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return {
        success: false,
        error: 'User not authenticated'
      };
    }

    // 1. Fetch submission data from database
    const { data: submission, error: submissionError } = await supabase
      .from('research_submissions')
      .select('*')
      .eq('id', submissionId)
      .single();

    if (submissionError || !submission) {
      return {
        success: false,
        error: 'Submission not found'
      };
    }

    // 2. Fetch related data
    const { data: applicationForm } = await supabase
      .from('application_forms')
      .select('*')
      .eq('submission_id', submissionId)
      .single();

    const { data: protocol } = await supabase
      .from('research_protocols')
      .select('*')
      .eq('submission_id', submissionId)
      .single();

    const { data: consentForm } = await supabase
      .from('consent_forms')
      .select('*')
      .eq('submission_id', submissionId)
      .single();

    const { data: documents } = await supabase
      .from('uploaded_documents')
      .select('*')
      .eq('submission_id', submissionId);

    // 3. Download uploaded files from Supabase Storage
    const uploadedFiles: { [key: string]: string } = {};

    if (documents && documents.length > 0) {
      for (const doc of documents) {
        try {
          const { data: fileData } = await supabase.storage
            .from('research-documents')
            .download(doc.file_url);

          if (fileData) {
            const arrayBuffer = await fileData.arrayBuffer();
            const base64 = Buffer.from(arrayBuffer).toString('base64');
            uploadedFiles[doc.document_type] = `data:application/pdf;base64,${base64}`;
          }
        } catch (err) {
          console.error(`Error downloading ${doc.document_type}:`, err);
        }
      }
    }

    // 4. Format data for PDF generation - MAP ALL DATABASE FIELDS
    const formattedData = {
      step1: {
        title: submission.title,
        studySiteType: submission.study_site_type,
        projectLeaderFirstName: submission.project_leader_first_name,
        projectLeaderMiddleName: submission.project_leader_middle_name,
        projectLeaderLastName: submission.project_leader_last_name,
        projectLeaderEmail: submission.project_leader_email,
        projectLeaderContact: submission.project_leader_contact,
        coAuthors: submission.co_authors,
        organization: submission.organization,
        college: submission.college,
        typeOfStudy: submission.type_of_study,
        sourceOfFunding: submission.source_of_funding,
        fundingOthers: submission.funding_others,
        startDate: submission.start_date,
        endDate: submission.end_date,
        numParticipants: submission.num_participants,
        technicalReview: submission.technical_review,
        submittedToOtherUMREC: submission.submitted_to_other_umrec,
      },
      step2: {
        researchType: applicationForm?.research_type,
        studySite: applicationForm?.study_site,
        studySiteType: applicationForm?.study_site_type,
        researcherFirstName: applicationForm?.researcher_first_name,
        researcherMiddleName: applicationForm?.researcher_middle_name,
        researcherLastName: applicationForm?.researcher_last_name,
        contactInfo: applicationForm?.contact_info,
        coResearcher: applicationForm?.co_researcher,
        college: applicationForm?.college,
        institution: applicationForm?.institution,
        institutionAddress: applicationForm?.institution_address,
        typeOfStudy: applicationForm?.type_of_study,
        typeOfStudyOthers: applicationForm?.type_of_study_others,
        sourceOfFunding: applicationForm?.source_of_funding,
        pharmaceuticalSponsor: applicationForm?.pharmaceutical_sponsor,
        fundingOthers: applicationForm?.funding_others,
        studyDuration: applicationForm?.study_duration,
        numParticipants: applicationForm?.num_participants,
        technicalReview: applicationForm?.technical_review,
        submittedToOther: applicationForm?.submitted_to_other,
        documentChecklist: applicationForm?.document_checklist,
        // ✅ ADD THESE FOR FORM DATA
        telNo: applicationForm?.contact_info?.telNo,
        mobileNo: applicationForm?.contact_info?.mobileNo,
        email: applicationForm?.contact_info?.email,
        faxNo: applicationForm?.contact_info?.faxNo,
        startDate: applicationForm?.study_duration?.startDate,
        endDate: applicationForm?.study_duration?.endDate,
      },
      step3: {
        formData: {
          title: protocol?.title,
          introduction: protocol?.introduction,
          background: protocol?.background,
          problemStatement: protocol?.problem_statement,
          scopeDelimitation: protocol?.scope_delimitation,
          literatureReview: protocol?.literature_review,
          methodology: protocol?.methodology,
          population: protocol?.population,
          samplingTechnique: protocol?.sampling_technique,
          researchInstrument: protocol?.research_instrument,
          statisticalTreatment: protocol?.statistical_treatment,
          references: protocol?.research_references,
        },
        researchers: protocol?.researchers || [],
      },
      step4: {
        consentType: consentForm?.consent_type,
        formData: {
          // Adult consent fields
          purposeEnglish: consentForm?.adult_consent?.purposeEnglish,
          purposeTagalog: consentForm?.adult_consent?.purposeTagalog,
          risksEnglish: consentForm?.adult_consent?.risksEnglish,
          risksTagalog: consentForm?.adult_consent?.risksTagalog,
          benefitsEnglish: consentForm?.adult_consent?.benefitsEnglish,
          benefitsTagalog: consentForm?.adult_consent?.benefitsTagalog,
          proceduresEnglish: consentForm?.adult_consent?.proceduresEnglish,
          proceduresTagalog: consentForm?.adult_consent?.proceduresTagalog,
          voluntarinessEnglish: consentForm?.adult_consent?.voluntarinessEnglish,
          voluntarinessTagalog: consentForm?.adult_consent?.voluntarinessTagalog,
          confidentialityEnglish: consentForm?.adult_consent?.confidentialityEnglish,
          confidentialityTagalog: consentForm?.adult_consent?.confidentialityTagalog,
          // Minor assent fields
          introduction: consentForm?.minor_assent?.introduction,
          purpose: consentForm?.minor_assent?.purpose,
          choiceOfParticipants: consentForm?.minor_assent?.choiceOfParticipants,
          voluntariness: consentForm?.minor_assent?.voluntariness,
          procedures: consentForm?.minor_assent?.procedures,
          risks: consentForm?.minor_assent?.risks,
          benefits: consentForm?.minor_assent?.benefits,
          confidentiality: consentForm?.minor_assent?.confidentiality,
          sharingFindings: consentForm?.minor_assent?.sharingFindings,
          certificateAssent: consentForm?.minor_assent?.certificateAssent,
          // Contact info
          contactPerson: consentForm?.contact_person,
          contactNumber: consentForm?.contact_number,
        },
      },
    };

    // 5. Generate PDF using shared function
    const pdfResult = await generateConsolidatedPdf(formattedData, {
      step5: uploadedFiles['research_instrument'],
      step6: uploadedFiles['proposal_defense'],
      step7: uploadedFiles['endorsement_letter'],
    });

    if (!pdfResult.success) {
      return {
        success: false,
        error: pdfResult.error || 'Failed to generate PDF'
      };
    }

    return {
      success: true,
      pdfData: pdfResult.pdfData!,
      fileName: pdfResult.fileName!,
      pageCount: pdfResult.pageCount!,
    };

  } catch (error) {
    console.error('PDF generation from database error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate PDF from database',
    };
  }
}

// Helper function to generate PDF content
async function generateConsolidatedPdfContent(
  submissionData: any,
  uploadedFiles: { step5?: string; step6?: string; step7?: string }
) {
  const consolidatedDoc = await PDFDocument.create();
  const helvetica = await consolidatedDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await consolidatedDoc.embedFont(StandardFonts.HelveticaBold);

  const wrapText = (text: string, maxWidth: number, font: any, fontSize: number) => {
    if (!text) return [];
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const width = font.widthOfTextAtSize(testLine, fontSize);
      
      if (width > maxWidth) {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  };

  // ============= PAGE 1: APPLICATION FORM =============
  
  let page = consolidatedDoc.addPage([612, 792]);
  let yPos = 740;

  // Header
  page.drawRectangle({
    x: 30,
    y: yPos - 10,
    width: 552,
    height: 90,
    color: rgb(0.027, 0.067, 0.224),
  });

  page.drawText('UNIVERSITY OF MAKATI', {
    x: 170,
    y: yPos + 40,
    size: 16,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  });

  page.drawText('RESEARCH ETHICS COMMITTEE', {
    x: 150,
    y: yPos + 22,
    size: 14,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  });

  page.drawText('APPLICATION FOR REQUEST TO CONDUCT RESEARCH', {
    x: 110,
    y: yPos + 4,
    size: 11,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  });

  yPos -= 110;

  // Form number centered
  page.drawText('UMREC Form No. 0013-1', {
    x: 245,
    y: yPos,
    size: 10,
    font: helvetica,
  });

  yPos -= 25;

  // Section: General Information
  page.drawRectangle({
    x: 30,
    y: yPos,
    width: 552,
    height: 28,
    color: rgb(0.027, 0.067, 0.224),
  });

  page.drawText('1. GENERAL INFORMATION', {
    x: 40,
    y: yPos + 8,
    size: 13,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  });

  yPos -= 40;

  const step1 = submissionData.step1 || {};
  const step2 = submissionData.step2 || {};

  const addField = (label: string, value: string) => {
    if (yPos < 60) {
      page = consolidatedDoc.addPage([612, 792]);
      yPos = 740;
    }

    page.drawText(label + ':', { x: 40, y: yPos, size: 10, font: helveticaBold });
    const lines = wrapText(value || 'N/A', 400, helvetica, 10);
    
    lines.forEach((line, i) => {
      if (yPos - (i * 12) < 50) {
        page = consolidatedDoc.addPage([612, 792]);
        yPos = 740;
      }
      page.drawText(line, { x: 200, y: yPos - (i * 12), size: 10, font: helvetica });
    });
    
    yPos -= Math.max(18, lines.length * 12 + 8);
  };

  // ALL FIELDS FROM DATABASE
  addField('Title of Study', step1.title);
  addField('Study Site Type', step1.studySiteType || step2.studySiteType);
  addField('Study Site', step2.studySite);
  addField('Principal Investigator', 
    `${step1.projectLeaderFirstName || ''} ${step1.projectLeaderMiddleName || ''.charAt(0)} ${step1.projectLeaderLastName || ''}`.trim()
  );
  addField('Email', step1.projectLeaderEmail);
  addField('Contact', step1.projectLeaderContact);
  
  if (step1.coAuthors) addField('Co-Investigators', step1.coAuthors);
  if (step2.coResearcher) addField('Co-Researcher', step2.coResearcher);
  
  addField('Organization', step1.organization);
  addField('College', step1.college || step2.college);
  addField('Institution', step2.institution);
  
  if (step2.institutionAddress) {
    addField('Institution Address', step2.institutionAddress);
  }
  
  // Researcher details from application form
  if (step2.researcherFirstName || step2.researcherLastName) {
    addField('Researcher Name', 
      `${step2.researcherFirstName || ''} ${step2.researcherMiddleName || ''} ${step2.researcherLastName || ''}`.trim()
    );
  }
  
  // Type of Study
  const formatTypeOfStudy = () => {
    const types = step1.typeOfStudy || step2.typeOfStudy || [];
    if (Array.isArray(types) && types.length > 0) {
      return types.join(', ');
    }
    return 'N/A';
  };
  
  addField('Type of Study', formatTypeOfStudy());
  
  if (step2.typeOfStudyOthers) {
    addField('Type of Study (Others)', step2.typeOfStudyOthers);
  }
  
  if (step2.researchType) {
    addField('Research Type', step2.researchType);
  }
  
  // Source of Funding
  const formatFunding = () => {
    const funding = step1.sourceOfFunding || step2.sourceOfFunding || [];
    if (Array.isArray(funding) && funding.length > 0) {
      return funding.join(', ');
    }
    return 'N/A';
  };
  
  addField('Source of Funding', formatFunding());
  
  if (step1.fundingOthers || step2.fundingOthers) {
    addField('Funding Source (Others)', step1.fundingOthers || step2.fundingOthers);
  }
  
  if (step2.pharmaceuticalSponsor) {
    addField('Pharmaceutical Sponsor', step2.pharmaceuticalSponsor);
  }
  
  // Study Duration
  const startDate = step1.startDate || step2.studyDuration?.startDate || step2.startDate || 'N/A';
  const endDate = step1.endDate || step2.studyDuration?.endDate || step2.endDate || 'N/A';
  addField('Duration', `${startDate} to ${endDate}`);
  
  // Number of Participants
  addField('Number of Participants', 
    (step1.numParticipants || step2.numParticipants)?.toString() || 'N/A'
  );
  
  // Technical Review
  if (step1.technicalReview || step2.technicalReview) {
    addField('Technical Review', step1.technicalReview || step2.technicalReview);
  }
  
  // Submitted to Other UMREC
  if (step1.submittedToOtherUMREC || step2.submittedToOther) {
    addField('Submitted to Other UMREC', step1.submittedToOtherUMREC || step2.submittedToOther);
  }

  // Researcher Contact Information
  if (step2.contactInfo || step2.telNo || step2.mobileNo || step2.email) {
    yPos -= 10;
    
    if (yPos < 120) {
      page = consolidatedDoc.addPage([612, 792]);
      yPos = 740;
    }
    
    page.drawRectangle({
      x: 30,
      y: yPos,
      width: 552,
      height: 24,
      color: rgb(0.027, 0.067, 0.224),
    });

    page.drawText('RESEARCHER CONTACT INFORMATION', {
      x: 40,
      y: yPos + 6,
      size: 11,
      font: helveticaBold,
      color: rgb(1, 1, 1),
    });
    
    yPos -= 30;
    
    const telNo = step2.contactInfo?.telNo || step2.telNo;
    const mobileNo = step2.contactInfo?.mobileNo || step2.mobileNo;
    const email = step2.contactInfo?.email || step2.email;
    const faxNo = step2.contactInfo?.faxNo || step2.faxNo;
    
    if (telNo) addField('Telephone', telNo);
    if (mobileNo) addField('Mobile', mobileNo);
    if (email) addField('Email', email);
    if (faxNo && faxNo !== 'N/A') {
      addField('Fax', faxNo);
    }
  }

  // Document Checklist
  if (step2.documentChecklist) {
    yPos -= 10;
    
    if (yPos < 150) {
      page = consolidatedDoc.addPage([612, 792]);
      yPos = 740;
    }
    
    page.drawRectangle({
      x: 30,
      y: yPos,
      width: 552,
      height: 28,
      color: rgb(0.027, 0.067, 0.224),
    });

    page.drawText('2. DOCUMENT CHECKLIST', {
      x: 40,
      y: yPos + 8,
      size: 13,
      font: helveticaBold,
      color: rgb(1, 1, 1),
    });

    yPos -= 35;

    const checklist = step2.documentChecklist;
    const checklistItems = [
      { key: 'hasApplicationForm', label: 'Application Form' },
      { key: 'hasResearchProtocol', label: 'Research Protocol' },
      { key: 'hasInformedConsentEnglish', label: 'Informed Consent Form (English)' },
      { key: 'hasInformedConsentFilipino', label: 'Informed Consent Form (Filipino)' },
      { key: 'hasEndorsementLetter', label: 'Endorsement Letter' },
    ];

    checklistItems.forEach(item => {
      if (yPos < 50) {
        page = consolidatedDoc.addPage([612, 792]);
        yPos = 740;
      }

      const isChecked = checklist[item.key];
      
      // Draw outer box
      page.drawRectangle({
        x: 50,
        y: yPos - 2,
        width: 10,
        height: 10,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      });

      // Draw checkmark if checked
      if (isChecked) {
        page.drawRectangle({
          x: 52,
          y: yPos,
          width: 6,
          height: 6,
          color: rgb(0, 0.5, 0),
        });
      }

      // Draw label
      page.drawText(item.label, {
        x: 70,
        y: yPos,
        size: 10,
        font: helvetica,
      });
      
      yPos -= 18;
    });
  }

  // ============= PAGE 2+: RESEARCH PROTOCOL =============
  
  const step3 = submissionData.step3?.formData || {};
  
  if (step3.title || step3.introduction || step3.background) {
    page = consolidatedDoc.addPage([612, 792]);
    yPos = 740;

    // Protocol Header
    page.drawRectangle({
      x: 30,
      y: yPos - 10,
      width: 552,
      height: 70,
      color: rgb(0.027, 0.067, 0.224),
    });

    page.drawText('RESEARCH PROTOCOL', {
      x: 210,
      y: yPos + 25,
      size: 18,
      font: helveticaBold,
      color: rgb(1, 1, 1),
    });

    page.drawText('UMREC Form No. 0013-2', {
      x: 230,
      y: yPos + 5,
      size: 11,
      font: helveticaBold,
      color: rgb(1, 1, 1),
    });

    yPos -= 90;

    // Helper to add multi-line sections
    const addSection = (title: string, content: string) => {
      if (!content) return;

      if (yPos < 80) {
        page = consolidatedDoc.addPage([612, 792]);
        yPos = 740;
      }

      page.drawRectangle({
        x: 30,
        y: yPos,
        width: 552,
        height: 24,
        color: rgb(0.027, 0.067, 0.224),
      });

      page.drawText(title, {
        x: 40,
        y: yPos + 6,
        size: 11,
        font: helveticaBold,
        color: rgb(1, 1, 1),
      });

      yPos -= 35;

      const lines = wrapText(content, 530, helvetica, 10);
      for (const line of lines) {
        if (yPos < 50) {
          page = consolidatedDoc.addPage([612, 792]);
          yPos = 740;
        }
        page.drawText(line, { x: 40, y: yPos, size: 10, font: helvetica });
        yPos -= 14;
      }
      yPos -= 10;
    };

    addSection('I. TITLE OF THE STUDY', step3.title || step1.title);
    addSection('II. INTRODUCTION', step3.introduction);
    addSection('III. BACKGROUND OF THE STUDY', step3.background);
    addSection('IV. STATEMENT OF THE PROBLEM', step3.problemStatement);
    addSection('V. SCOPE AND DELIMITATION', step3.scopeDelimitation);
    addSection('VI. REVIEW OF RELATED LITERATURE', step3.literatureReview);
    addSection('VII. RESEARCH METHODOLOGY', step3.methodology);
    
    if (step3.population) addSection('Population', step3.population);
    if (step3.samplingTechnique) addSection('Sampling Technique', step3.samplingTechnique);
    if (step3.researchInstrument) addSection('Research Instrument', step3.researchInstrument);
    if (step3.statisticalTreatment) addSection('Statistical Treatment', step3.statisticalTreatment);
    
    addSection('VIII. REFERENCES', step3.references);

    // List of researchers
    const researchers = submissionData.step3?.researchers || [];
    if (researchers.length > 0) {
      if (yPos < 100) {
        page = consolidatedDoc.addPage([612, 792]);
        yPos = 740;
      }

      page.drawRectangle({
        x: 30,
        y: yPos,
        width: 552,
        height: 24,
        color: rgb(0.027, 0.067, 0.224),
      });

      page.drawText('RESEARCH TEAM', {
        x: 40,
        y: yPos + 6,
        size: 11,
        font: helveticaBold,
        color: rgb(1, 1, 1),
      });
      
      yPos -= 30;

      researchers.forEach((researcher: any, index: number) => {
        if (yPos < 50) {
          page = consolidatedDoc.addPage([612, 792]);
          yPos = 740;
        }
        page.drawText(`${index + 1}. ${researcher.name} - ${researcher.role}`, {
          x: 50,
          y: yPos,
          size: 10,
          font: helvetica,
        });
        yPos -= 15;
      });
    }
  }

  // ============= PAGE: INFORMED CONSENT =============
  
  const step4 = submissionData.step4?.formData || {};
  const consentType = submissionData.step4?.consentType;
  
  if (step4.purposeEnglish || step4.purposeTagalog || step4.introduction) {
    page = consolidatedDoc.addPage([612, 792]);
    yPos = 740;

    page.drawRectangle({
      x: 30,
      y: yPos - 10,
      width: 552,
      height: 50,
      color: rgb(0.027, 0.067, 0.224),
    });

    const consentTitle = consentType === 'minor' ? 'INFORMED ASSENT FORM (MINOR)' :
                        consentType === 'both' ? 'INFORMED CONSENT/ASSENT FORM' :
                        'INFORMED CONSENT FORM';

    page.drawText(consentTitle, {
      x: 180,
      y: yPos + 10,
      size: 16,
      font: helveticaBold,
      color: rgb(1, 1, 1),
    });

    yPos -= 70;

    const addConsentSection = (title: string, content: string) => {
      if (!content) return;

      if (yPos < 80) {
        page = consolidatedDoc.addPage([612, 792]);
        yPos = 740;
      }

      page.drawText(title, {
        x: 40,
        y: yPos,
        size: 11,
        font: helveticaBold,
      });

      yPos -= 18;

      const lines = wrapText(content, 530, helvetica, 10);
      for (const line of lines) {
        if (yPos < 50) {
          page = consolidatedDoc.addPage([612, 792]);
          yPos = 740;
        }
        page.drawText(line, { x: 40, y: yPos, size: 10, font: helvetica });
        yPos -= 13;
      }
      yPos -= 15;
    };

    // Adult consent sections (English)
    if (step4.purposeEnglish) {
      addConsentSection('PURPOSE OF THE STUDY', step4.purposeEnglish);
      addConsentSection('RISKS AND INCONVENIENCES', step4.risksEnglish);
      addConsentSection('BENEFITS', step4.benefitsEnglish);
      addConsentSection('PROCEDURES', step4.proceduresEnglish);
      addConsentSection('VOLUNTARINESS', step4.voluntarinessEnglish);
      addConsentSection('CONFIDENTIALITY', step4.confidentialityEnglish);
    }

    // Adult consent sections (Tagalog)
    if (step4.purposeTagalog) {
      page = consolidatedDoc.addPage([612, 792]);
      yPos = 740;

      page.drawText('PAHINTULOT NA MAY KAALAMAN (TAGALOG)', {
        x: 40,
        y: yPos,
        size: 13,
        font: helveticaBold,
      });

      yPos -= 25;

      addConsentSection('LAYUNIN NG PAG-AARAL', step4.purposeTagalog);
      addConsentSection('MGA PANGANIB AT ABALA', step4.risksTagalog);
      addConsentSection('MGA BENEPISYO', step4.benefitsTagalog);
      addConsentSection('MGA PAMAMARAAN', step4.proceduresTagalog);
      addConsentSection('KUSANG-LOOB', step4.voluntarinessTagalog);
      addConsentSection('PAGIGING KUMPIDENSYAL', step4.confidentialityTagalog);
    }

    // Minor assent sections
    if (step4.introduction) {
      if (yPos < 700) {
        page = consolidatedDoc.addPage([612, 792]);
        yPos = 740;
      }

      page.drawText('MINOR ASSENT FORM', {
        x: 40,
        y: yPos,
        size: 13,
        font: helveticaBold,
      });

      yPos -= 25;

      addConsentSection('INTRODUCTION', step4.introduction);
      addConsentSection('PURPOSE OF RESEARCH', step4.purpose);
      addConsentSection('CHOICE OF PARTICIPANTS', step4.choiceOfParticipants);
      addConsentSection('VOLUNTARINESS OF PARTICIPATION', step4.voluntariness);
      addConsentSection('PROCEDURES', step4.procedures);
      addConsentSection('RISKS AND INCONVENIENCES', step4.risks);
      addConsentSection('POSSIBLE BENEFITS', step4.benefits);
      addConsentSection('CONFIDENTIALITY', step4.confidentiality);
      addConsentSection('SHARING THE FINDINGS', step4.sharingFindings);
      
      if (step4.certificateAssent) {
        addConsentSection('CERTIFICATE OF ASSENT', step4.certificateAssent);
      }
    }

    // Contact info
    if (step4.contactPerson || step4.contactNumber) {
      if (yPos < 100) {
        page = consolidatedDoc.addPage([612, 792]);
        yPos = 740;
      }

      page.drawText('CONTACT INFORMATION', {
        x: 40,
        y: yPos,
        size: 11,
        font: helveticaBold,
      });

      yPos -= 20;

      if (step4.contactPerson) {
        page.drawText(`Contact Person: ${step4.contactPerson}`, {
          x: 40,
          y: yPos,
          size: 10,
          font: helvetica,
        });
        yPos -= 15;
      }

      if (step4.contactNumber) {
        page.drawText(`Contact Number: ${step4.contactNumber}`, {
          x: 40,
          y: yPos,
          size: 10,
          font: helvetica,
        });
      }
    }
  }

  // ============= MERGE UPLOADED PDFs =============
  
  const mergePdf = async (base64Data: string, title: string) => {
    try {
      if (!base64Data) return;
      
      const pdfData = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;
      const pdfBytes = Buffer.from(pdfData, 'base64');
      const uploadedPdf = await PDFDocument.load(pdfBytes);
      
      // Add separator page
      const separatorPage = consolidatedDoc.addPage([612, 792]);
      separatorPage.drawRectangle({
        x: 30,
        y: 356,
        width: 552,
        height: 80,
        color: rgb(1, 0.843, 0),
      });
      
      separatorPage.drawText(title, {
        x: 80,
        y: 390,
        size: 16,
        font: helveticaBold,
        color: rgb(0.027, 0.067, 0.224),
      });
      
      const copiedPages = await consolidatedDoc.copyPages(uploadedPdf, uploadedPdf.getPageIndices());
      copiedPages.forEach(copiedPage => consolidatedDoc.addPage(copiedPage));
    } catch (error) {
      console.error(`Error merging ${title}:`, error);
    }
  };

  if (uploadedFiles.step5) await mergePdf(uploadedFiles.step5, 'ATTACHMENT A: RESEARCH INSTRUMENT');
  if (uploadedFiles.step6) await mergePdf(uploadedFiles.step6, 'ATTACHMENT B: PROPOSAL DEFENSE CERTIFICATION');
  if (uploadedFiles.step7) await mergePdf(uploadedFiles.step7, 'ATTACHMENT C: ENDORSEMENT LETTER');

  // Add page numbers
  const pages = consolidatedDoc.getPages();
  pages.forEach((page, index) => {
    page.drawText(`Page ${index + 1} of ${pages.length}`, {
      x: 265,
      y: 20,
      size: 9,
      font: helvetica,
      color: rgb(0.5, 0.5, 0.5),
    });
  });

  const pdfBytes = await consolidatedDoc.save();
  const pdfBase64 = `data:application/pdf;base64,${Buffer.from(pdfBytes).toString('base64')}`;

  return {
    success: true,
    pdfData: pdfBase64,
    fileName: `UMREC_Consolidated_${step1.title?.substring(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.pdf`,
    pageCount: pages.length,
  };
}

// Add these functions at the end of the file, after generateConsolidatedPdfContent

// ============= GENERATE APPLICATION FOR ETHICS REVIEW (Step 2) =============
export async function generateApplicationFormPdf(
  submissionData: any
): Promise<{ success: boolean; pdfData?: string; fileName?: string; pageCount?: number; error?: string }> {
  try {
    const pdfDoc = await PDFDocument.create();
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const wrapText = (text: string, maxWidth: number, font: any, fontSize: number) => {
      if (!text) return [];
      const words = text.split(' ');
      const lines = [];
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const width = font.widthOfTextAtSize(testLine, fontSize);
        
        if (width > maxWidth) {
          if (currentLine) lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) lines.push(currentLine);
      return lines;
    };

    let page = pdfDoc.addPage([612, 792]);
    let yPos = 740;

    // Header
    page.drawRectangle({
      x: 30,
      y: yPos - 10,
      width: 552,
      height: 90,
      color: rgb(0.027, 0.067, 0.224),
    });

    page.drawText('UNIVERSITY OF MAKATI', {
      x: 170,
      y: yPos + 40,
      size: 16,
      font: helveticaBold,
      color: rgb(1, 1, 1),
    });

    page.drawText('RESEARCH ETHICS COMMITTEE', {
      x: 150,
      y: yPos + 22,
      size: 14,
      font: helveticaBold,
      color: rgb(1, 1, 1),
    });

    page.drawText('APPLICATION FOR ETHICS REVIEW', {
      x: 160,
      y: yPos + 4,
      size: 11,
      font: helveticaBold,
      color: rgb(1, 1, 1),
    });

    yPos -= 110;

    page.drawText('UMREC Form No. 0013-1', {
      x: 245,
      y: yPos,
      size: 10,
      font: helvetica,
    });

    yPos -= 25;

    const step1 = submissionData.step1 || {};
    const step2 = submissionData.step2 || {};

    const addField = (label: string, value: string) => {
      if (yPos < 60) {
        page = pdfDoc.addPage([612, 792]);
        yPos = 740;
      }

      page.drawText(label + ':', { x: 40, y: yPos, size: 10, font: helveticaBold });
      const lines = wrapText(value || 'N/A', 400, helvetica, 10);
      
      lines.forEach((line, i) => {
        if (yPos - (i * 12) < 50) {
          page = pdfDoc.addPage([612, 792]);
          yPos = 740;
        }
        page.drawText(line, { x: 200, y: yPos - (i * 12), size: 10, font: helvetica });
      });
      
      yPos -= Math.max(18, lines.length * 12 + 8);
    };

    addField('Title of Study', step1.title);
    addField('Study Site Type', step1.studySiteType || step2.studySiteType);
    addField('Study Site', step2.studySite);
    addField('Principal Investigator', 
      `${step1.projectLeaderFirstName || ''} ${step1.projectLeaderMiddleName || ''} ${step1.projectLeaderLastName || ''}`.trim()
    );
    addField('Email', step1.projectLeaderEmail);
    addField('Contact', step1.projectLeaderContact);
    
    if (step1.coAuthors) addField('Co-Investigators', step1.coAuthors);
    addField('Organization', step1.organization);
    addField('College', step1.college || step2.college);
    
    const formatTypeOfStudy = () => {
      const types = step1.typeOfStudy || step2.typeOfStudy || [];
      if (Array.isArray(types) && types.length > 0) {
        return types.join(', ');
      }
      return 'N/A';
    };
    
    addField('Type of Study', formatTypeOfStudy());
    
    const formatFunding = () => {
      const funding = step1.sourceOfFunding || step2.sourceOfFunding || [];
      if (Array.isArray(funding) && funding.length > 0) {
        return funding.join(', ');
      }
      return 'N/A';
    };
    
    addField('Source of Funding', formatFunding());
    
    const startDate = step1.startDate || step2.studyDuration?.startDate || step2.startDate || 'N/A';
    const endDate = step1.endDate || step2.studyDuration?.endDate || step2.endDate || 'N/A';
    addField('Duration', `${startDate} to ${endDate}`);
    
    addField('Number of Participants', 
      (step1.numParticipants || step2.numParticipants)?.toString() || 'N/A'
    );

    const pages = pdfDoc.getPages();
    pages.forEach((page, index) => {
      page.drawText(`Page ${index + 1} of ${pages.length}`, {
        x: 265,
        y: 20,
        size: 9,
        font: helvetica,
        color: rgb(0.5, 0.5, 0.5),
      });
    });

    const pdfBytes = await pdfDoc.save();
    const pdfBase64 = `data:application/pdf;base64,${Buffer.from(pdfBytes).toString('base64')}`;

    return {
      success: true,
      pdfData: pdfBase64,
      fileName: `UMREC_Application_Form_${Date.now()}.pdf`,
      pageCount: pages.length,
    };
  } catch (error) {
    console.error('Application Form PDF generation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate Application Form PDF',
    };
  }
}

// ============= GENERATE RESEARCH PROTOCOL (Step 3) =============
export async function generateResearchProtocolPdf(
  submissionData: any
): Promise<{ success: boolean; pdfData?: string; fileName?: string; pageCount?: number; error?: string }> {
  try {
    const pdfDoc = await PDFDocument.create();
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const wrapText = (text: string, maxWidth: number, font: any, fontSize: number) => {
      if (!text) return [];
      const words = text.split(' ');
      const lines = [];
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const width = font.widthOfTextAtSize(testLine, fontSize);
        
        if (width > maxWidth) {
          if (currentLine) lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) lines.push(currentLine);
      return lines;
    };

    let page = pdfDoc.addPage([612, 792]);
    let yPos = 740;

    page.drawRectangle({
      x: 30,
      y: yPos - 10,
      width: 552,
      height: 70,
      color: rgb(0.027, 0.067, 0.224),
    });

    page.drawText('RESEARCH PROTOCOL', {
      x: 210,
      y: yPos + 25,
      size: 18,
      font: helveticaBold,
      color: rgb(1, 1, 1),
    });

    page.drawText('UMREC Form No. 0013-2', {
      x: 230,
      y: yPos + 5,
      size: 11,
      font: helveticaBold,
      color: rgb(1, 1, 1),
    });

    yPos -= 90;

    const step1 = submissionData.step1 || {};
    const step3 = submissionData.step3?.formData || {};

    const addSection = (title: string, content: string) => {
      if (!content) return;

      if (yPos < 80) {
        page = pdfDoc.addPage([612, 792]);
        yPos = 740;
      }

      page.drawRectangle({
        x: 30,
        y: yPos,
        width: 552,
        height: 24,
        color: rgb(0.027, 0.067, 0.224),
      });

      page.drawText(title, {
        x: 40,
        y: yPos + 6,
        size: 11,
        font: helveticaBold,
        color: rgb(1, 1, 1),
      });

      yPos -= 35;

      const lines = wrapText(content, 530, helvetica, 10);
      for (const line of lines) {
        if (yPos < 50) {
          page = pdfDoc.addPage([612, 792]);
          yPos = 740;
        }
        page.drawText(line, { x: 40, y: yPos, size: 10, font: helvetica });
        yPos -= 14;
      }
      yPos -= 10;
    };

    addSection('I. TITLE OF THE STUDY', step3.title || step1.title);
    addSection('II. INTRODUCTION', step3.introduction);
    addSection('III. BACKGROUND OF THE STUDY', step3.background);
    addSection('IV. STATEMENT OF THE PROBLEM', step3.problemStatement);
    addSection('V. SCOPE AND DELIMITATION', step3.scopeDelimitation);
    addSection('VI. REVIEW OF RELATED LITERATURE', step3.literatureReview);
    addSection('VII. RESEARCH METHODOLOGY', step3.methodology);
    
    if (step3.population) addSection('Population', step3.population);
    if (step3.samplingTechnique) addSection('Sampling Technique', step3.samplingTechnique);
    if (step3.researchInstrument) addSection('Research Instrument', step3.researchInstrument);
    if (step3.statisticalTreatment) addSection('Statistical Treatment', step3.statisticalTreatment);
    
    addSection('VIII. REFERENCES', step3.references);

    const researchers = submissionData.step3?.researchers || [];
    if (researchers.length > 0) {
      if (yPos < 100) {
        page = pdfDoc.addPage([612, 792]);
        yPos = 740;
      }

      page.drawRectangle({
        x: 30,
        y: yPos,
        width: 552,
        height: 24,
        color: rgb(0.027, 0.067, 0.224),
      });

      page.drawText('RESEARCH TEAM', {
        x: 40,
        y: yPos + 6,
        size: 11,
        font: helveticaBold,
        color: rgb(1, 1, 1),
      });
      
      yPos -= 30;

      researchers.forEach((researcher: any, index: number) => {
        if (yPos < 50) {
          page = pdfDoc.addPage([612, 792]);
          yPos = 740;
        }
        page.drawText(`${index + 1}. ${researcher.name} - ${researcher.role}`, {
          x: 50,
          y: yPos,
          size: 10,
          font: helvetica,
        });
        yPos -= 15;
      });
    }

    const pages = pdfDoc.getPages();
    pages.forEach((page, index) => {
      page.drawText(`Page ${index + 1} of ${pages.length}`, {
        x: 265,
        y: 20,
        size: 9,
        font: helvetica,
        color: rgb(0.5, 0.5, 0.5),
      });
    });

    const pdfBytes = await pdfDoc.save();
    const pdfBase64 = `data:application/pdf;base64,${Buffer.from(pdfBytes).toString('base64')}`;

    return {
      success: true,
      pdfData: pdfBase64,
      fileName: `UMREC_Research_Protocol_${Date.now()}.pdf`,
      pageCount: pages.length,
    };
  } catch (error) {
    console.error('Research Protocol PDF generation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate Research Protocol PDF',
    };
  }
}

// ============= GENERATE INFORMED CONSENT/ASSENT FORM (Step 4) =============
export async function generateConsentFormPdf(
  submissionData: any
): Promise<{ success: boolean; pdfData?: string; fileName?: string; pageCount?: number; error?: string }> {
  try {
    const pdfDoc = await PDFDocument.create();
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const wrapText = (text: string, maxWidth: number, font: any, fontSize: number) => {
      if (!text) return [];
      const words = text.split(' ');
      const lines = [];
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const width = font.widthOfTextAtSize(testLine, fontSize);
        
        if (width > maxWidth) {
          if (currentLine) lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) lines.push(currentLine);
      return lines;
    };

    let page = pdfDoc.addPage([612, 792]);
    let yPos = 740;

    const step4 = submissionData.step4?.formData || {};
    const consentType = submissionData.step4?.consentType;

    page.drawRectangle({
      x: 30,
      y: yPos - 10,
      width: 552,
      height: 50,
      color: rgb(0.027, 0.067, 0.224),
    });

    const consentTitle = consentType === 'minor' ? 'INFORMED ASSENT FORM (MINOR)' :
                        consentType === 'both' ? 'INFORMED CONSENT/ASSENT FORM' :
                        'INFORMED CONSENT FORM';

    page.drawText(consentTitle, {
      x: 180,
      y: yPos + 10,
      size: 16,
      font: helveticaBold,
      color: rgb(1, 1, 1),
    });

    yPos -= 70;

    const addConsentSection = (title: string, content: string) => {
      if (!content) return;

      if (yPos < 80) {
        page = pdfDoc.addPage([612, 792]);
        yPos = 740;
      }

      page.drawText(title, {
        x: 40,
        y: yPos,
        size: 11,
        font: helveticaBold,
      });

      yPos -= 18;

      const lines = wrapText(content, 530, helvetica, 10);
      for (const line of lines) {
        if (yPos < 50) {
          page = pdfDoc.addPage([612, 792]);
          yPos = 740;
        }
        page.drawText(line, { x: 40, y: yPos, size: 10, font: helvetica });
        yPos -= 13;
      }
      yPos -= 15;
    };

    if (step4.purposeEnglish) {
      addConsentSection('PURPOSE OF THE STUDY', step4.purposeEnglish);
      addConsentSection('RISKS AND INCONVENIENCES', step4.risksEnglish);
      addConsentSection('BENEFITS', step4.benefitsEnglish);
      addConsentSection('PROCEDURES', step4.proceduresEnglish);
      addConsentSection('VOLUNTARINESS', step4.voluntarinessEnglish);
      addConsentSection('CONFIDENTIALITY', step4.confidentialityEnglish);
    }

    if (step4.purposeTagalog) {
      page = pdfDoc.addPage([612, 792]);
      yPos = 740;

      page.drawText('PAHINTULOT NA MAY KAALAMAN (TAGALOG)', {
        x: 40,
        y: yPos,
        size: 13,
        font: helveticaBold,
      });

      yPos -= 25;

      addConsentSection('LAYUNIN NG PAG-AARAL', step4.purposeTagalog);
      addConsentSection('MGA PANGANIB AT ABALA', step4.risksTagalog);
      addConsentSection('MGA BENEPISYO', step4.benefitsTagalog);
      addConsentSection('MGA PAMAMARAAN', step4.proceduresTagalog);
      addConsentSection('KUSANG-LOOB', step4.voluntarinessTagalog);
      addConsentSection('PAGIGING KUMPIDENSYAL', step4.confidentialityTagalog);
    }

    if (step4.introduction) {
      if (yPos < 700) {
        page = pdfDoc.addPage([612, 792]);
        yPos = 740;
      }

      page.drawText('MINOR ASSENT FORM', {
        x: 40,
        y: yPos,
        size: 13,
        font: helveticaBold,
      });

      yPos -= 25;

      addConsentSection('INTRODUCTION', step4.introduction);
      addConsentSection('PURPOSE OF RESEARCH', step4.purpose);
      addConsentSection('CHOICE OF PARTICIPANTS', step4.choiceOfParticipants);
      addConsentSection('VOLUNTARINESS OF PARTICIPATION', step4.voluntariness);
      addConsentSection('PROCEDURES', step4.procedures);
      addConsentSection('RISKS AND INCONVENIENCES', step4.risks);
      addConsentSection('POSSIBLE BENEFITS', step4.benefits);
      addConsentSection('CONFIDENTIALITY', step4.confidentiality);
      addConsentSection('SHARING THE FINDINGS', step4.sharingFindings);
      
      if (step4.certificateAssent) {
        addConsentSection('CERTIFICATE OF ASSENT', step4.certificateAssent);
      }
    }

    if (step4.contactPerson || step4.contactNumber) {
      if (yPos < 100) {
        page = pdfDoc.addPage([612, 792]);
        yPos = 740;
      }

      page.drawText('CONTACT INFORMATION', {
        x: 40,
        y: yPos,
        size: 11,
        font: helveticaBold,
      });

      yPos -= 20;

      if (step4.contactPerson) {
        page.drawText(`Contact Person: ${step4.contactPerson}`, {
          x: 40,
          y: yPos,
          size: 10,
          font: helvetica,
        });
        yPos -= 15;
      }

      if (step4.contactNumber) {
        page.drawText(`Contact Number: ${step4.contactNumber}`, {
          x: 40,
          y: yPos,
          size: 10,
          font: helvetica,
        });
      }
    }

    const pages = pdfDoc.getPages();
    pages.forEach((page, index) => {
      page.drawText(`Page ${index + 1} of ${pages.length}`, {
        x: 265,
        y: 20,
        size: 9,
        font: helvetica,
        color: rgb(0.5, 0.5, 0.5),
      });
    });

    const pdfBytes = await pdfDoc.save();
    const pdfBase64 = `data:application/pdf;base64,${Buffer.from(pdfBytes).toString('base64')}`;

    return {
      success: true,
      pdfData: pdfBase64,
      fileName: `UMREC_Consent_Form_${Date.now()}.pdf`,
      pageCount: pages.length,
    };
  } catch (error) {
    console.error('Consent Form PDF generation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate Consent Form PDF',
    };
  }
}
