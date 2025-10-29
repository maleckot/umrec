// src/app/actions/generatePdfFromDatabase.ts
'use server';

import { createClient } from '@/utils/supabase/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

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
function stripHtmlAndSanitize(text: string): string {
  if (!text) return '';
  
  let cleaned = text
    // Convert common HTML tags to text equivalents
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<li>/gi, '\n• ')
    .replace(/<\/li>/gi, '')
    
    // Remove all HTML tags
    .replace(/<[^>]+>/g, '')
    
    // Decode HTML entities
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&apos;/gi, "'")
    
    // Replace special characters
    .replace(/[●○■□]/g, '•')
    .replace(/[—–]/g, '-')
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .replace(/…/g, '...')
    
    // Clean whitespace
    .replace(/  +/g, ' ')
    .replace(/^ +| +$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    
    // Remove non-WinAnsi characters
    .replace(/[^\x20-\x7E\xA0-\xFF\n\r\t]/g, '');

  return cleaned;
}

export async function generatePdfFromDatabase(submissionId: string): Promise<PdfGenerationResult> {
  try {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { success: false, error: 'User not authenticated' };
    }

    const { data: submission, error: submissionError } = await supabase
      .from('research_submissions')
      .select('*')
      .eq('id', submissionId)
      .single();

    if (submissionError || !submission) {
      return { success: false, error: 'Submission not found' };
    }

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

    const formattedData = {
      step1: {
        title: submission.title,
        studySiteType: submission.study_site,
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
        technicalAdvisers: applicationForm?.technical_advisers, // ✅ NEW
        college: applicationForm?.college,
        institution: applicationForm?.institution,
        institutionAddress: applicationForm?.institution_address,
        typeOfStudy: applicationForm?.type_of_study,
        sourceOfFunding: applicationForm?.source_of_funding,
        documentChecklist: applicationForm?.document_checklist,
        telNo: applicationForm?.contact_info?.telNo,
        mobileNo: applicationForm?.contact_info?.mobileNo,
        email: applicationForm?.contact_info?.email,
        faxNo: applicationForm?.contact_info?.faxNo,
        startDate: applicationForm?.study_duration?.startDate,
        endDate: applicationForm?.study_duration?.endDate,
        title: applicationForm?.title,
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
          ethicalConsideration: protocol?.ethical_consideration, // ✅ NEW
          statisticalTreatment: protocol?.statistical_treatment, // ✅ NEW
          references: protocol?.research_references,
        },
        researchers: protocol?.researchers || [],
      },
      step4: {
        consentType: consentForm?.consent_type,
        informedConsentFor: consentForm?.informed_consent_for, // ✅ NEW
        formData: {
          participantGroupIdentity: consentForm?.informed_consent_for, // ✅ NEW
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
          contactPerson: consentForm?.contact_person,
          contactNumber: consentForm?.contact_number,
        },
      },
    };

    const appFormPdf = await generateApplicationFormPdf(formattedData);
    const protocolPdf = await generateResearchProtocolPdf(formattedData);
    const consentPdf = await generateConsentFormPdf(formattedData);

    const consolidatedDoc = await PDFDocument.create();

    if (appFormPdf.success && appFormPdf.pdfData) {
      const appPdfBytes = Buffer.from(appFormPdf.pdfData.split(',')[1], 'base64');
      const appPdf = await PDFDocument.load(appPdfBytes);
      const appPages = await consolidatedDoc.copyPages(appPdf, appPdf.getPageIndices());
      appPages.forEach(page => consolidatedDoc.addPage(page));
    }

    if (protocolPdf.success && protocolPdf.pdfData) {
      const protoPdfBytes = Buffer.from(protocolPdf.pdfData.split(',')[1], 'base64');
      const protoPdf = await PDFDocument.load(protoPdfBytes);
      const protoPages = await consolidatedDoc.copyPages(protoPdf, protoPdf.getPageIndices());
      protoPages.forEach(page => consolidatedDoc.addPage(page));
    }

    if (consentPdf.success && consentPdf.pdfData) {
      const consentPdfBytes = Buffer.from(consentPdf.pdfData.split(',')[1], 'base64');
      const consPdf = await PDFDocument.load(consentPdfBytes);
      const consPages = await consolidatedDoc.copyPages(consPdf, consPdf.getPageIndices());
      consPages.forEach(page => consolidatedDoc.addPage(page));
    }

    const mergePdf = async (base64Data: string, title: string) => {
      try {
        if (!base64Data) return;
        const pdfData = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;
        const pdfBytes = Buffer.from(pdfData, 'base64');
        const uploadedPdf = await PDFDocument.load(pdfBytes);

        const helveticaBold = await consolidatedDoc.embedFont(StandardFonts.HelveticaBold);

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

    if (uploadedFiles.research_instrument) {
      await mergePdf(uploadedFiles.research_instrument, 'ATTACHMENT A: RESEARCH INSTRUMENT');
    }
    if (uploadedFiles.proposal_defense) {
      await mergePdf(uploadedFiles.proposal_defense, 'ATTACHMENT B: PROPOSAL DEFENSE CERTIFICATION');
    }
    if (uploadedFiles.endorsement_letter) {
      await mergePdf(uploadedFiles.endorsement_letter, 'ATTACHMENT C: ENDORSEMENT LETTER');
    }

    const pdfBytes = await consolidatedDoc.save();
    const pdfBase64 = `data:application/pdf;base64,${Buffer.from(pdfBytes).toString('base64')}`;

    return {
      success: true,
      pdfData: pdfBase64,
      fileName: `UMREC_Consolidated_${submission.title?.substring(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.pdf`,
      pageCount: consolidatedDoc.getPages().length,
    };
  } catch (error) {
    console.error('PDF generation from database error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate PDF from database',
    };
  }
}

// ========== 1. APPLICATION FORM ==========
export async function generateApplicationFormPdf(
  submissionData: any
): Promise<{ success: boolean; pdfData?: string; fileName?: string; pageCount?: number; error?: string }> {
  try {
    const pdfDoc = await PDFDocument.create();
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const pageWidth = 612;
    const pageHeight = 792;
    const margin = 50;

    const checkbox = (checked: boolean) => checked ? '[X]' : '[ ]';

    const wrapText = (text: string, maxWidth: number, fontSize: number) => {
      if (!text || text.trim() === '') return [];

      // ✅ FIX: Handle newlines first
        const sanitizedText = stripHtmlAndSanitize(text);
      const paragraphs = sanitizedText.split('\n');
      const allLines: string[] = [];

      for (const paragraph of paragraphs) {
        if (!paragraph.trim()) {
          allLines.push(''); // Preserve empty lines
          continue;
        }

        const words = paragraph.split(' ');
        let currentLine = '';

        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;

          // ✅ Safe to measure - no newlines
          const width = helvetica.widthOfTextAtSize(testLine, fontSize);

          if (width > maxWidth) {
            if (currentLine) {
              allLines.push(currentLine);
              currentLine = word;
            } else {
              currentLine = testLine;
            }
          } else {
            currentLine = testLine;
          }
        }

        if (currentLine) {
          allLines.push(currentLine);
        }
      }

      return allLines;
    };


    let page = pdfDoc.addPage([pageWidth, pageHeight]);
    let yPos = pageHeight - margin;

    // ===== UMREC HEADER =====
    page.drawRectangle({
      x: margin,
      y: yPos - 80,
      width: pageWidth - 2 * margin,
      height: 80,
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
    });

    page.drawText('UNIVERSITY OF MAKATI RESEARCH ETHICS COMMITTEE', {
      x: pageWidth / 2 - helveticaBold.widthOfTextAtSize('UNIVERSITY OF MAKATI RESEARCH ETHICS COMMITTEE', 11) / 2,
      y: yPos - 25,
      size: 11,
      font: helveticaBold,
    });

    page.drawText('APPLICATION FORM FOR ETHICS REVIEW', {
      x: pageWidth / 2 - helveticaBold.widthOfTextAtSize('APPLICATION FORM FOR ETHICS REVIEW', 11) / 2,
      y: yPos - 45,
      size: 11,
      font: helveticaBold,
    });

    page.drawText('UMREC Form No.', { x: pageWidth - 180, y: yPos - 60, size: 9, font: helvetica });
    page.drawText('0013-1', { x: pageWidth - 80, y: yPos - 60, size: 9, font: helveticaBold });

    page.drawText('Version No.', { x: pageWidth - 180, y: yPos - 72, size: 9, font: helvetica });
    page.drawText('4', { x: pageWidth - 80, y: yPos - 72, size: 9, font: helvetica });

    yPos -= 95;

    page.drawText('Instructions to the Researcher:', { x: margin, y: yPos, size: 10, font: helveticaBold });
    yPos -= 15;
    const instructions = wrapText(
      'Please complete this form and ensure that you have included in your submission the documents that you checked in Section 3-Checklist of Documents.',
      pageWidth - 2 * margin,
      9
    );
    instructions.forEach(line => {
      page.drawText(line, { x: margin, y: yPos, size: 9, font: helvetica });
      yPos -= 12;
    });

    yPos -= 15;

    page.drawRectangle({
      x: margin,
      y: yPos - 12,
      width: pageWidth - 2 * margin,
      height: 12,
      color: rgb(0.85, 0.85, 0.85),
    });
    page.drawText('General Information', { x: margin + 5, y: yPos - 10, size: 10, font: helveticaBold });
    yPos -= 20;

    const step1 = submissionData.step1;
    const step2 = submissionData.step2;

    page.drawText('Title of Study', { x: margin + 5, y: yPos, size: 9, font: helveticaBold });
    yPos -= 12;
    const titleLines = wrapText(step1?.title || 'N/A', pageWidth - 2 * margin - 10, 9);
    titleLines.forEach(line => {
      if (yPos < 100) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        yPos = pageHeight - margin;
      }
      page.drawText(line, { x: margin + 5, y: yPos, size: 9, font: helvetica });
      yPos -= 12;
    });

    yPos -= 10;

    page.drawText('UMREC Code', { x: margin + 5, y: yPos, size: 9, font: helveticaBold });
    page.drawText('Study Site', { x: pageWidth / 2, y: yPos, size: 9, font: helveticaBold });
    yPos -= 12;
    page.drawText('(To be provided by UMREC)', { x: margin + 5, y: yPos, size: 9, font: helvetica, color: rgb(0.5, 0.5, 0.5) });
    page.drawText(step1?.studySiteType || step2?.studySite || 'N/A', { x: pageWidth / 2, y: yPos, size: 9, font: helvetica });
    yPos -= 20;

    page.drawText('Type of Review', { x: margin + 5, y: yPos, size: 9, font: helveticaBold });
    yPos -= 12;
    // page.drawText('Full Board Review', { x: margin + 5, y: yPos, size: 9, font: helvetica });
    // yPos -= 20;

    page.drawText('Name of Researchers', { x: margin + 5, y: yPos, size: 9, font: helveticaBold });
    page.drawText('Contact Number', { x: margin + 200, y: yPos, size: 9, font: helveticaBold });
    page.drawText('Email Address', { x: margin + 330, y: yPos, size: 9, font: helveticaBold });
    yPos -= 12;

    const leadName = `${step1?.projectLeaderFirstName || ''} ${step1?.projectLeaderMiddleName || ''} ${step1?.projectLeaderLastName || ''}`.trim();
    page.drawText(leadName, { x: margin + 5, y: yPos, size: 9, font: helvetica });
    page.drawText(step1?.projectLeaderContact || '', { x: margin + 200, y: yPos, size: 9, font: helvetica });
    page.drawText(step1?.projectLeaderEmail || '', { x: margin + 330, y: yPos, size: 9, font: helvetica });
    yPos -= 15;

    if (step1?.coAuthors) {
      page.drawText('Members:', { x: margin + 5, y: yPos, size: 9, font: helvetica, color: rgb(0.5, 0.5, 0.5) });
      yPos -= 12;
      const coAuthorsLines = wrapText(step1.coAuthors, 150, 9);
      coAuthorsLines.forEach(line => {
        if (yPos < 100) {
          page = pdfDoc.addPage([pageWidth, pageHeight]);
          yPos = pageHeight - margin;
        }
        page.drawText(line, { x: margin + 5, y: yPos, size: 9, font: helvetica });
        yPos -= 12;
      });
    }

    yPos -= 15;

    page.drawText('College/Department', { x: margin + 5, y: yPos, size: 9, font: helveticaBold });
    yPos -= 12;
    page.drawText(step1?.college || step2?.college || 'N/A', { x: margin + 5, y: yPos, size: 9, font: helvetica });
    yPos -= 20;

    page.drawText('Institution', { x: margin + 5, y: yPos, size: 9, font: helveticaBold });
    yPos -= 12;
    page.drawText(step1?.organization || step2?.institution || 'University of Makati', { x: margin + 5, y: yPos, size: 9, font: helvetica });
    yPos -= 20;

    page.drawText('Address of Institution', { x: margin + 5, y: yPos, size: 9, font: helveticaBold });
    yPos -= 12;
    page.drawText(step2?.institutionAddress || 'J.P. Rizal Ext., West Rembo, Makati City', { x: margin + 5, y: yPos, size: 9, font: helvetica });
    yPos -= 20;

    if (yPos < 300) {
      page = pdfDoc.addPage([pageWidth, pageHeight]);
      yPos = pageHeight - margin;
    }

    page.drawText('Type of Study', { x: margin + 5, y: yPos, size: 9, font: helveticaBold });
    yPos -= 12;
    const typeOfStudy = step1?.typeOfStudy || step2?.typeOfStudy || [];
    const studyTypes = Array.isArray(typeOfStudy) ? typeOfStudy : [typeOfStudy];
    studyTypes.forEach((type: string) => {
      page.drawText(`${checkbox(true)} ${type}`, { x: margin + 5, y: yPos, size: 9, font: helvetica });
      yPos -= 12;
    });
    yPos -= 10;

    const siteType = step1?.studySiteType || step2?.studySiteType || 'Single Site';
    page.drawText(`${checkbox(true)} ${siteType}`, { x: margin + 5, y: yPos, size: 9, font: helvetica });
    yPos -= 20;

    page.drawText('Source of Funding', { x: margin + 5, y: yPos, size: 9, font: helveticaBold });
    yPos -= 12;
    const funding = step1?.sourceOfFunding || step2?.sourceOfFunding || [];
    const fundingSources = Array.isArray(funding) ? funding : [funding];
    fundingSources.forEach((source: string) => {
      page.drawText(`${checkbox(true)} ${source}`, { x: margin + 5, y: yPos, size: 9, font: helvetica });
      yPos -= 12;
    });
    if (step1?.fundingOthers || step2?.fundingOthers) {
      page.drawText(step1?.fundingOthers || step2?.fundingOthers, { x: margin + 15, y: yPos, size: 9, font: helvetica });
      yPos -= 12;
    }
    yPos -= 15;

    page.drawText('Duration of the study', { x: margin + 5, y: yPos, size: 9, font: helveticaBold });
    page.drawText('No. of study participants', { x: pageWidth / 2, y: yPos, size: 9, font: helveticaBold });
    yPos -= 12;
    const startDate = step1?.startDate || step2?.startDate || 'N/A';
    const endDate = step1?.endDate || step2?.endDate || 'N/A';
    page.drawText(`Start date: ${startDate}`, { x: margin + 5, y: yPos, size: 9, font: helvetica });
    page.drawText(step1?.numParticipants?.toString() || step2?.numParticipants?.toString() || 'N/A', { x: pageWidth / 2, y: yPos, size: 9, font: helvetica });
    yPos -= 12;
    page.drawText(`End date: ${endDate}`, { x: margin + 5, y: yPos, size: 9, font: helvetica });
    yPos -= 20;

    page.drawText('*Has the Research undergone a Technical Review/pre-oral defense?', { x: margin + 5, y: yPos, size: 9, font: helvetica });
    yPos -= 12;
    const hasTechReview = step1?.technicalReview === 'Yes' || step1?.technicalReview === true;
    page.drawText(`${checkbox(hasTechReview)} Yes    ${checkbox(!hasTechReview)} No`, { x: margin + 5, y: yPos, size: 9, font: helvetica });
    yPos -= 20;

    page.drawText('*Has the Research been submitted to another UMREC?', { x: margin + 5, y: yPos, size: 9, font: helvetica });
    yPos -= 12;
    const submittedOther = step1?.submittedToOtherUMREC === 'Yes' || step1?.submittedToOtherUMREC === true;
    page.drawText(`${checkbox(submittedOther)} Yes    ${checkbox(!submittedOther)} No`, { x: margin + 5, y: yPos, size: 9, font: helvetica });
    yPos -= 25;

    if (yPos < 200) {
      page = pdfDoc.addPage([pageWidth, pageHeight]);
      yPos = pageHeight - margin;
    }

    page.drawRectangle({
      x: margin,
      y: yPos - 12,
      width: pageWidth - 2 * margin,
      height: 12,
      color: rgb(0.85, 0.85, 0.85),
    });
    page.drawText('Checklist of Documents', { x: margin + 5, y: yPos - 10, size: 10, font: helveticaBold });
    yPos -= 25;

    const docChecklist = step2?.documentChecklist || {};

    const leftX = margin + 5;
    const rightX = pageWidth / 2;
    let leftY = yPos;
    let rightY = yPos;

    page.drawText('Basic requirements:', { x: leftX, y: leftY, size: 9, font: helveticaBold });
    leftY -= 12;
    page.drawText(`${checkbox(docChecklist.hasApplicationForm || true)} Application for Ethics Review`, { x: leftX, y: leftY, size: 8, font: helvetica });
    leftY -= 11;
    page.drawText(`${checkbox(docChecklist.hasResearchProtocol || true)} Research Protocol`, { x: leftX, y: leftY, size: 8, font: helvetica });
    leftY -= 11;
    page.drawText(`${checkbox(docChecklist.hasInformedConsentEnglish || false)} Informed Consent Form`, { x: leftX, y: leftY, size: 8, font: helvetica });
    leftY -= 11;
    if (docChecklist.hasInformedConsentEnglish) {
      page.drawText('     [X] English version', { x: leftX, y: leftY, size: 8, font: helvetica });
      leftY -= 11;
    }
    if (docChecklist.hasInformedConsentFilipino) {
      page.drawText('     [X] Filipino version', { x: leftX, y: leftY, size: 8, font: helvetica });
      leftY -= 11;
    }
    page.drawText(`${checkbox(docChecklist.hasEndorsementLetter || false)} Endorsement Letter`, { x: leftX, y: leftY, size: 8, font: helvetica });
    leftY -= 11;
    page.drawText(`${checkbox(false)} Questionnaire`, { x: leftX, y: leftY, size: 8, font: helvetica });

    page.drawText('Supplementary Documents:', { x: rightX, y: rightY, size: 9, font: helveticaBold });
    rightY -= 12;
    page.drawText(`${checkbox(false)} Technical review/pre-oral defense proof`, { x: rightX, y: rightY, size: 8, font: helvetica });
    rightY -= 11;
    page.drawText(`${checkbox(false)} Data Collection Forms`, { x: rightX, y: rightY, size: 8, font: helvetica });
    rightY -= 11;
    page.drawText(`${checkbox(false)} Product Brochure`, { x: rightX, y: rightY, size: 8, font: helvetica });
    rightY -= 11;
    page.drawText(`${checkbox(false)} FDA Authorization`, { x: rightX, y: rightY, size: 8, font: helvetica });
    rightY -= 11;
    page.drawText(`${checkbox(false)} Company Permit`, { x: rightX, y: rightY, size: 8, font: helvetica });
    rightY -= 11;
    page.drawText(`${checkbox(false)} Special Population Permit`, { x: rightX, y: rightY, size: 8, font: helvetica });

    yPos = Math.min(leftY, rightY) - 20;

    page.drawText('Accomplished by:', { x: margin + 5, y: yPos, size: 9, font: helvetica });
    yPos -= 30;
    page.drawLine({
      start: { x: margin + 5, y: yPos },
      end: { x: margin + 250, y: yPos },
      thickness: 1,
    });
    yPos -= 12;
    page.drawText('Signature over printed name', { x: margin + 5, y: yPos, size: 8, font: helvetica });
    yPos -= 20;
    page.drawText(`Date submitted: ${new Date().toISOString().split('T')[0]}`, { x: margin + 5, y: yPos, size: 9, font: helvetica });

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

// ========== 2. RESEARCH PROTOCOL ==========
export async function generateResearchProtocolPdf(
  submissionData: any
): Promise<{ success: boolean; pdfData?: string; fileName?: string; pageCount?: number; error?: string }> {
  try {
    const pdfDoc = await PDFDocument.create();
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const pageWidth = 612;
    const pageHeight = 792;
    const margin = 50;

    const wrapText = (text: string, maxWidth: number, fontSize: number) => {
      if (!text || text.trim() === '') return [];

      // ✅ FIX: Handle newlines first
      const sanitizedText = stripHtmlAndSanitize(text);
      const paragraphs = sanitizedText.split('\n');
      const allLines: string[] = [];

      for (const paragraph of paragraphs) {
        if (!paragraph.trim()) {
          allLines.push(''); // Preserve empty lines
          continue;
        }

        const words = paragraph.split(' ');
        let currentLine = '';

        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;

          // ✅ Now safe to measure - no newlines in testLine
          const width = helvetica.widthOfTextAtSize(testLine, fontSize);

          if (width > maxWidth) {
            if (currentLine) {
              allLines.push(currentLine);
              currentLine = word;
            } else {
              currentLine = testLine;
            }
          } else {
            currentLine = testLine;
          }
        }

        if (currentLine) {
          allLines.push(currentLine);
        }
      }

      return allLines;
    };


    let page = pdfDoc.addPage([pageWidth, pageHeight]);
    let yPos = pageHeight - margin;

    // ===== UMREC HEADER =====
    page.drawRectangle({
      x: margin,
      y: yPos - 60,
      width: pageWidth - 2 * margin,
      height: 60,
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
    });

    page.drawText('UNIVERSITY OF MAKATI RESEARCH ETHICS COMMITTEE', {
      x: pageWidth / 2 - helveticaBold.widthOfTextAtSize('UNIVERSITY OF MAKATI RESEARCH ETHICS COMMITTEE', 11) / 2,
      y: yPos - 20,
      size: 11,
      font: helveticaBold,
    });

    page.drawText('RESEARCH PROTOCOL', {
      x: pageWidth / 2 - helveticaBold.widthOfTextAtSize('RESEARCH PROTOCOL', 11) / 2,
      y: yPos - 40,
      size: 11,
      font: helveticaBold,
    });

    page.drawText('UMREC Form No. 0033', { x: pageWidth - 180, y: yPos - 53, size: 9, font: helvetica });

    yPos -= 80;

    const step1 = submissionData.step1;
    const step3 = submissionData.step3?.formData;

    const addSection = (title: string, content: string) => {
      if (!content) return;

      if (yPos < 120) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        yPos = pageHeight - margin;
      }

      page.drawRectangle({
        x: margin,
        y: yPos - 12,
        width: pageWidth - 2 * margin,
        height: 12,
        color: rgb(0.95, 0.95, 0.95),
      });
      page.drawText(title, { x: margin + 5, y: yPos - 10, size: 9, font: helveticaBold });
      yPos -= 20;

      const lines = wrapText(content, pageWidth - 2 * margin - 10, 9);
      lines.forEach(line => {
        if (yPos < 80) {
          page = pdfDoc.addPage([pageWidth, pageHeight]);
          yPos = pageHeight - margin;
        }
        page.drawText(line, { x: margin + 5, y: yPos, size: 9, font: helvetica });
        yPos -= 12;
      });

      yPos -= 10;
    };

    addSection('I. Title of the Study', step3?.title || step1?.title || 'N/A');
    addSection('II. Introduction', step3?.introduction || 'N/A');
    addSection('III. Background of the Study', step3?.background || 'N/A');
    addSection('IV. Statement of the Problem/Objectives of the Study', step3?.problemStatement || 'N/A');
    addSection('V. Scope and Delimitation', step3?.scopeDelimitation || 'N/A');
    addSection('VI. Related Literature & Studies', step3?.literatureReview || 'N/A');
    addSection('VII. Research Methodology', step3?.methodology || 'N/A');
    addSection('VIII. Population, Respondents, and Sample Size', step3?.population || 'N/A');
    addSection('IX. Sampling Technique', step3?.samplingTechnique || 'N/A');
    addSection('X. Research Instrument and Validation', step3?.researchInstrument || 'N/A');
    addSection('XI. Ethical Consideration', step3?.ethicalConsideration || 'The research will ensure participant confidentiality, informed consent, and data protection.');
    addSection('XII. Statistical Treatment of Data', step3?.statisticalTreatment || 'N/A');
    addSection('XIII. References (Main Themes Only)', step3?.references || 'N/A');

    if (yPos < 100) {
      page = pdfDoc.addPage([pageWidth, pageHeight]);
      yPos = pageHeight - margin;
    }

    page.drawText('Accomplished by:', { x: margin + 5, y: yPos, size: 9, font: helvetica });
    yPos -= 30;
    page.drawLine({
      start: { x: margin + 5, y: yPos },
      end: { x: margin + 200, y: yPos },
      thickness: 1,
    });
    page.drawText('Signature over printed name', { x: margin + 5, y: yPos - 12, size: 8, font: helvetica });
    page.drawLine({
      start: { x: margin + 250, y: yPos },
      end: { x: margin + 350, y: yPos },
      thickness: 1,
    });
    page.drawText('Date', { x: margin + 280, y: yPos - 12, size: 8, font: helvetica });

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

// ========== 3. INFORMED CONSENT FORM ==========
export async function generateConsentFormPdf(
  submissionData: any
): Promise<{ success: boolean; pdfData?: string; fileName?: string; pageCount?: number; error?: string }> {
  try {
    const pdfDoc = await PDFDocument.create();
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const pageWidth = 612;
    const pageHeight = 792;
    const margin = 50;

    const wrapText = (text: string, maxWidth: number, fontSize: number) => {
      if (!text || text.trim() === '') return [];
      // ✅ FIX: Handle newlines first
      const sanitizedText = stripHtmlAndSanitize(text);
      const paragraphs = sanitizedText.split('\n');
      const allLines: string[] = [];

      for (const paragraph of paragraphs) {
        if (!paragraph.trim()) {
          allLines.push(''); // Preserve empty lines
          continue;
        }

        const words = paragraph.split(' ');
        let currentLine = '';

        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;

          // ✅ Now safe to measure - no newlines in testLine
          const width = helvetica.widthOfTextAtSize(testLine, fontSize);

          if (width > maxWidth) {
            if (currentLine) {
              allLines.push(currentLine);
              currentLine = word;
            } else {
              currentLine = testLine;
            }
          } else {
            currentLine = testLine;
          }
        }

        if (currentLine) {
          allLines.push(currentLine);
        }
      }

      return allLines;
    };


    let page = pdfDoc.addPage([pageWidth, pageHeight]);
    let yPos = pageHeight - margin;

    const step4 = submissionData.step4?.formData;
    const consentType = submissionData.step4?.consentType;

    // ===== UMREC HEADER =====
    page.drawRectangle({
      x: margin,
      y: yPos - 50,
      width: pageWidth - 2 * margin,
      height: 50,
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
    });

    const consentTitle =
      consentType === 'minor'
        ? 'INFORMED ASSENT FORM (MINOR)'
        : consentType === 'both'
          ? 'INFORMED CONSENT/ASSENT FORM'
          : 'INFORMED CONSENT FORM';

    page.drawText(consentTitle, {
      x: pageWidth / 2 - helveticaBold.widthOfTextAtSize(consentTitle, 12) / 2,
      y: yPos - 30,
      size: 12,
      font: helveticaBold,
    });

    yPos -= 70;

    // PARTICIPANT GROUP
    const informedConsentFor = submissionData.step4?.informedConsentFor || step4?.participantGroupIdentity;
    if (informedConsentFor) {
      page.drawText('Informed Consent Form for:', {
        x: margin,
        y: yPos,
        size: 10,
        font: helveticaBold,
      });
      yPos -= 15;
      page.drawText(informedConsentFor, {
        x: margin,
        y: yPos,
        size: 10,
        font: helvetica,
      });
      yPos -= 25;
    }

    // PROJECT AND RESEARCHER INFO
    const step1 = submissionData.step1;
    const step2 = submissionData.step2;
    if (step1 || step2) {
      page.drawText('PROJECT AND RESEARCHER INFORMATION', {
        x: margin,
        y: yPos,
        size: 10,
        font: helveticaBold,
      });
      yPos -= 15;

      const leadName = `${step1?.projectLeaderFirstName || step2?.researcherFirstName || ''} ${step1?.projectLeaderMiddleName || step2?.researcherMiddleName || ''} ${step1?.projectLeaderLastName || step2?.researcherLastName || ''}`.trim();
      if (leadName) {
        page.drawText(`Principal Investigator: ${leadName}`, {
          x: margin,
          y: yPos,
          size: 9,
          font: helvetica,
        });
        yPos -= 12;

        const institution = step2?.institution || step1?.organization || 'University of Makati';
        page.drawText(`Organization: ${institution}`, {
          x: margin,
          y: yPos,
          size: 9,
          font: helvetica,
        });
        yPos -= 12;

        const contact = step1?.projectLeaderContact || step2?.mobileNo || '';
        const email = step1?.projectLeaderEmail || step2?.email || '';
        if (contact || email) {
          page.drawText(`Contact: ${contact} | ${email}`, {
            x: margin,
            y: yPos,
            size: 9,
            font: helvetica,
          });
          yPos -= 12;
        }
      }

      const projectTitle = step1?.title || step2?.title || '';
      if (projectTitle) {
        yPos -= 5;
        page.drawText('Project Title:', {
          x: margin,
          y: yPos,
          size: 9,
          font: helveticaBold,
        });
        yPos -= 12;

        const titleLines = wrapText(projectTitle, pageWidth - 2 * margin, 9);
        titleLines.forEach(line => {
          page.drawText(line, {
            x: margin,
            y: yPos,
            size: 9,
            font: helvetica,
          });
          yPos -= 12;
        });
      }

      yPos -= 15;
    }

    const addConsentSection = (title: string, content: string) => {
      if (!content) return;

      if (yPos < 100) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        yPos = pageHeight - margin;
      }

      page.drawText(title, { x: margin, y: yPos, size: 10, font: helveticaBold });
      yPos -= 15;

      const lines = wrapText(content, pageWidth - 2 * margin, 9);
      lines.forEach(line => {
        if (yPos < 60) {
          page = pdfDoc.addPage([pageWidth, pageHeight]);
          yPos = pageHeight - margin;
        }
        page.drawText(line, { x: margin, y: yPos, size: 9, font: helvetica });
        yPos -= 12;
      });

      yPos -= 15;
    };

    // ADULT CONSENT ENGLISH
    if (step4?.purposeEnglish) {
      addConsentSection('PURPOSE OF THE STUDY', step4.purposeEnglish);
      addConsentSection('RISKS AND INCONVENIENCES', step4.risksEnglish);
      addConsentSection('BENEFITS', step4.benefitsEnglish);
      addConsentSection('PROCEDURES', step4.proceduresEnglish);
      addConsentSection('VOLUNTARINESS', step4.voluntarinessEnglish);
      addConsentSection('CONFIDENTIALITY', step4.confidentialityEnglish);
    }

    // ADULT CONSENT TAGALOG
    if (step4?.purposeTagalog) {
      if (yPos < 600) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        yPos = pageHeight - margin;
      }

      page.drawText('PAHINTULOT NA MAY KAALAMAN (TAGALOG)', {
        x: margin,
        y: yPos,
        size: 11,
        font: helveticaBold,
      });
      yPos -= 20;

      addConsentSection('LAYUNIN NG PAG-AARAL', step4.purposeTagalog);
      addConsentSection('MGA PANGANIB AT ABALA', step4.risksTagalog);
      addConsentSection('MGA BENEPISYO', step4.benefitsTagalog);
      addConsentSection('MGA PAMAMARAAN', step4.proceduresTagalog);
      addConsentSection('KUSANG-LOOB', step4.voluntarinessTagalog);
      addConsentSection('PAGIGING KUMPIDENSYAL', step4.confidentialityTagalog);
    }

    // MINOR ASSENT
    if (step4?.introduction) {
      if (yPos < 600) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        yPos = pageHeight - margin;
      }

      page.drawText('MINOR ASSENT FORM', {
        x: margin,
        y: yPos,
        size: 11,
        font: helveticaBold,
      });
      yPos -= 20;

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

    if (step4?.contactPerson || step4?.contactNumber) {
      if (yPos < 80) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        yPos = pageHeight - margin;
      }

      page.drawText('CONTACT INFORMATION', { x: margin, y: yPos, size: 10, font: helveticaBold });
      yPos -= 15;

      if (step4.contactPerson) {
        page.drawText(`Contact Person: ${step4.contactPerson}`, { x: margin, y: yPos, size: 9, font: helvetica });
        yPos -= 12;
      }

      if (step4.contactNumber) {
        page.drawText(`Contact Number: ${step4.contactNumber}`, { x: margin, y: yPos, size: 9, font: helvetica });
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
