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

    // ✅ Get all uploaded documents
    const { data: documents } = await supabase
      .from('uploaded_documents')
      .select('*')
      .eq('submission_id', submissionId);

    if (!documents || documents.length === 0) {
      return { success: false, error: 'No PDF documents found' };
    }

    // ✅ Helper function to download PDF from storage
    const downloadPdf = async (fileUrl: string) => {
      const { data: fileData } = await supabase.storage
        .from('research-documents')
        .download(fileUrl);

      if (fileData) {
        const arrayBuffer = await fileData.arrayBuffer();
        return Buffer.from(arrayBuffer);
      }
      return null;
    };

    // ✅ Create consolidated document
    const consolidatedDoc = await PDFDocument.create();

    // ✅ Add the 3 main PDFs in order
    const mainDocTypes = ['application_form', 'research_protocol', 'consent_form'];

    for (const docType of mainDocTypes) {
      const doc = documents.find(d => d.document_type === docType);
      if (doc) {
        try {
          const pdfBytes = await downloadPdf(doc.file_url);
          if (pdfBytes) {
            const pdf = await PDFDocument.load(pdfBytes);
            const pages = await consolidatedDoc.copyPages(pdf, pdf.getPageIndices());
            pages.forEach(page => consolidatedDoc.addPage(page));
          }
        } catch (err) {
          console.error(`Error adding ${docType}:`, err);
        }
      }
    }

    // ✅ Helper function to merge attachments with separator page
    const mergeAttachment = async (docType: string, title: string) => {
      const doc = documents.find(d => d.document_type === docType);
      if (!doc) return;

      try {
        const pdfBytes = await downloadPdf(doc.file_url);
        if (!pdfBytes) return;

        const attachmentPdf = await PDFDocument.load(pdfBytes);
        const helveticaBold = await consolidatedDoc.embedFont(StandardFonts.HelveticaBold);

        // ✅ Add separator page
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

        // ✅ Add attachment pages
        const pages = await consolidatedDoc.copyPages(
          attachmentPdf,
          attachmentPdf.getPageIndices()
        );
        pages.forEach(page => consolidatedDoc.addPage(page));
      } catch (error) {
        console.error(`Error merging ${docType}:`, error);
      }
    };

    // ✅ Add attachments with separator pages
    await mergeAttachment('research_instrument', 'ATTACHMENT A: RESEARCH INSTRUMENT');
    await mergeAttachment('proposal_defense', 'ATTACHMENT B: PROPOSAL DEFENSE CERTIFICATION');
    await mergeAttachment('endorsement_letter', 'ATTACHMENT C: ENDORSEMENT LETTER');

    // ✅ Save and return
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
// ========== 1. APPLICATION FORM (UPDATED) ==========
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

      const sanitizedText = stripHtmlAndSanitize(text);
      const paragraphs = sanitizedText.split('\n');
      const allLines: string[] = [];

      for (const paragraph of paragraphs) {
        if (!paragraph.trim()) {
          allLines.push('');
          continue;
        }

        const words = paragraph.split(' ');
        let currentLine = '';

        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
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
    const titleLines = wrapText(step1?.title || step2?.title || 'N/A', pageWidth - 2 * margin - 10, 9);
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
    page.drawText(step2?.studySite || 'N/A', { x: pageWidth / 2, y: yPos, size: 9, font: helvetica });
    yPos -= 20;

    page.drawText('Name of Researchers', { x: margin + 5, y: yPos, size: 9, font: helveticaBold });
    page.drawText('Contact Number', { x: margin + 200, y: yPos, size: 9, font: helveticaBold });
    page.drawText('Email Address', { x: margin + 330, y: yPos, size: 9, font: helveticaBold });
    yPos -= 12;

    const leadName = `${step1?.projectLeaderFirstName || step2?.researcherFirstName || ''} ${step1?.projectLeaderMiddleName || step2?.researcherMiddleName || ''} ${step1?.projectLeaderLastName || step2?.researcherLastName || ''}`.trim();
    page.drawText(leadName, { x: margin + 5, y: yPos, size: 9, font: helvetica });
    page.drawText(step1?.projectLeaderContact || step2?.mobileNo || '', { x: margin + 200, y: yPos, size: 9, font: helvetica });
    page.drawText(step1?.projectLeaderEmail || step2?.email || '', { x: margin + 330, y: yPos, size: 9, font: helvetica });
    yPos -= 15;

    // ✅ NEW: CO-RESEARCHERS SECTION
    if (step2?.coResearchers && Array.isArray(step2.coResearchers) && step2.coResearchers.length > 0) {
      page.drawText('Co-Researchers:', { x: margin + 5, y: yPos, size: 9, font: helveticaBold, color: rgb(0.2, 0.2, 0.2) });
      yPos -= 12;
      step2.coResearchers.forEach((coAuth: any, index: number) => {
        if (yPos < 100) {
          page = pdfDoc.addPage([pageWidth, pageHeight]);
          yPos = pageHeight - margin;
        }
        const coAuthLine = `${index + 1}. ${coAuth.name || 'N/A'} | ${coAuth.contact || 'N/A'} | ${coAuth.email || 'N/A'}`;
        page.drawText(coAuthLine, { x: margin + 10, y: yPos, size: 8, font: helvetica });
        yPos -= 11;
      });
      yPos -= 5;
    }

    // ✅ NEW: TECHNICAL ADVISERS SECTION
    if (step2?.technicalAdvisers && Array.isArray(step2.technicalAdvisers) && step2.technicalAdvisers.length > 0) {
      page.drawText('Technical Advisers:', { x: margin + 5, y: yPos, size: 9, font: helveticaBold, color: rgb(0.2, 0.2, 0.2) });
      yPos -= 12;
      step2.technicalAdvisers.forEach((adviser: any, index: number) => {
        if (yPos < 100) {
          page = pdfDoc.addPage([pageWidth, pageHeight]);
          yPos = pageHeight - margin;
        }
        const adviserLine = `${index + 1}. ${adviser.name || 'N/A'} | ${adviser.contact || 'N/A'} | ${adviser.email || 'N/A'}`;
        page.drawText(adviserLine, { x: margin + 10, y: yPos, size: 8, font: helvetica });
        yPos -= 11;
      });
      yPos -= 10;
    }

    yPos -= 5;

    page.drawText('College/Department', { x: margin + 5, y: yPos, size: 9, font: helveticaBold });
    yPos -= 12;
    page.drawText(step2?.college || 'N/A', { x: margin + 5, y: yPos, size: 9, font: helvetica });
    yPos -= 20;

    page.drawText('Institution', { x: margin + 5, y: yPos, size: 9, font: helveticaBold });
    yPos -= 12;
    page.drawText(step2?.institution || 'University of Makati', { x: margin + 5, y: yPos, size: 9, font: helvetica });
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
    const typeOfStudy = step2?.typeOfStudy || [];
    const studyTypes = Array.isArray(typeOfStudy) ? typeOfStudy : [typeOfStudy];
    studyTypes.forEach((type: string) => {
      page.drawText(`${checkbox(true)} ${type}`, { x: margin + 5, y: yPos, size: 9, font: helvetica });
      yPos -= 12;
    });
    if (step2?.typeOfStudyOthers) {
      page.drawText(`${checkbox(true)} Others: ${step2.typeOfStudyOthers}`, { x: margin + 5, y: yPos, size: 9, font: helvetica });
      yPos -= 12;
    }
    yPos -= 10;

    const siteType = step2?.studySiteType || 'Single Site';
    page.drawText(`${checkbox(true)} ${siteType}`, { x: margin + 5, y: yPos, size: 9, font: helvetica });
    yPos -= 20;

    page.drawText('Source of Funding', { x: margin + 5, y: yPos, size: 9, font: helveticaBold });
    yPos -= 12;
    const funding = step2?.sourceOfFunding || [];
    const fundingSources = Array.isArray(funding) ? funding : [funding];
    fundingSources.forEach((source: string) => {
      page.drawText(`${checkbox(true)} ${source}`, { x: margin + 5, y: yPos, size: 9, font: helvetica });
      yPos -= 12;
    });
    if (step2?.pharmaceuticalSponsor) {
      page.drawText(`Pharmaceutical Sponsor: ${step2.pharmaceuticalSponsor}`, { x: margin + 15, y: yPos, size: 9, font: helvetica });
      yPos -= 12;
    }
    if (step2?.fundingOthers) {
      page.drawText(`Other Funding: ${step2.fundingOthers}`, { x: margin + 15, y: yPos, size: 9, font: helvetica });
      yPos -= 12;
    }
    yPos -= 15;

    page.drawText('Duration of the study', { x: margin + 5, y: yPos, size: 9, font: helveticaBold });
    page.drawText('No. of study participants', { x: pageWidth / 2, y: yPos, size: 9, font: helveticaBold });
    yPos -= 12;
    const startDate = step2?.startDate || 'N/A';
    const endDate = step2?.endDate || 'N/A';
    page.drawText(`Start date: ${startDate}`, { x: margin + 5, y: yPos, size: 9, font: helvetica });
    page.drawText(step2?.numParticipants?.toString() || 'N/A', { x: pageWidth / 2, y: yPos, size: 9, font: helvetica });
    yPos -= 12;
    page.drawText(`End date: ${endDate}`, { x: margin + 5, y: yPos, size: 9, font: helvetica });
    yPos -= 20;

    page.drawText('*Has the Research undergone a Technical Review/pre-oral defense?', { x: margin + 5, y: yPos, size: 9, font: helvetica });
    yPos -= 12;
    const hasTechReview = step2?.technicalReview === 'yes' || step2?.technicalReview === 'Yes' || step2?.technicalReview === true;
    page.drawText(`${checkbox(hasTechReview)} Yes    ${checkbox(!hasTechReview)} No`, { x: margin + 5, y: yPos, size: 9, font: helvetica });
    yPos -= 20;

    page.drawText('*Has the Research been submitted to another UMREC?', { x: margin + 5, y: yPos, size: 9, font: helvetica });
    yPos -= 12;
    const submittedOther = step2?.submittedToOther === 'yes' || step2?.submittedToOther === 'Yes' || step2?.submittedToOther === true;
    page.drawText(`${checkbox(submittedOther)} Yes    ${checkbox(!submittedOther)} No`, { x: margin + 5, y: yPos, size: 9, font: helvetica });
    yPos -= 25;

    if (yPos < 400) {
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

    const docChecklist = step2 || {};

    const leftX = margin + 5;
    const rightX = pageWidth / 2;
    let leftY = yPos;
    let rightY = yPos;

    page.drawText('Basic requirements:', { x: leftX, y: leftY, size: 9, font: helveticaBold });
    leftY -= 12;
    page.drawText(`${checkbox(docChecklist.hasApplicationForm || false)} Application for Ethics Review`, { x: leftX, y: leftY, size: 8, font: helvetica });
    leftY -= 11;
    page.drawText(`${checkbox(docChecklist.hasResearchProtocol || false)} Research Protocol`, { x: leftX, y: leftY, size: 8, font: helvetica });
    leftY -= 11;

    // ✅ UPDATED: Check actual values for informed consent
    const hasInformedConsent = docChecklist.hasInformedConsent || docChecklist.hasInformedConsentEnglish || false;
    page.drawText(`${checkbox(hasInformedConsent)} Informed Consent Form`, { x: leftX, y: leftY, size: 8, font: helvetica });
    leftY -= 11;
    if (hasInformedConsent) {
      page.drawText('     [X] English version', { x: leftX, y: leftY, size: 8, font: helvetica });
      leftY -= 11;
      if (docChecklist.hasInformedConsentOthers) {
        page.drawText('     [X] Filipino version', { x: leftX, y: leftY, size: 8, font: helvetica });
        leftY -= 11;
      }
    }

    // ✅ NEW: Assent Form
    page.drawText(`${checkbox(docChecklist.hasAssentForm || false)} Assent Form`, { x: leftX, y: leftY, size: 8, font: helvetica });
    leftY -= 11;
    if (docChecklist.hasAssentForm) {
      page.drawText('     [X] English version', { x: leftX, y: leftY, size: 8, font: helvetica });
      leftY -= 11;
      if (docChecklist.hasAssentFormOthers) {
        page.drawText('     [X] Filipino version', { x: leftX, y: leftY, size: 8, font: helvetica });
        leftY -= 11;
      }
    }

    page.drawText(`${checkbox(docChecklist.hasEndorsementLetter || false)} Endorsement Letter`, { x: leftX, y: leftY, size: 8, font: helvetica });
    leftY -= 11;
    page.drawText(`${checkbox(docChecklist.hasQuestionnaire || false)} Questionnaire`, { x: leftX, y: leftY, size: 8, font: helvetica });

    // ✅ UPDATED: Supplementary Documents with all fields
    page.drawText('Supplementary Documents:', { x: rightX, y: rightY, size: 9, font: helveticaBold });
    rightY -= 12;
    page.drawText(`${checkbox(docChecklist.hasTechnicalReview || false)} Technical review/pre-oral defense proof`, { x: rightX, y: rightY, size: 8, font: helvetica });
    rightY -= 11;
    page.drawText(`${checkbox(docChecklist.hasDataCollectionForms || false)} Data Collection Forms`, { x: rightX, y: rightY, size: 8, font: helvetica });
    rightY -= 11;
    page.drawText(`${checkbox(docChecklist.hasProductBrochure || false)} Product Brochure`, { x: rightX, y: rightY, size: 8, font: helvetica });
    rightY -= 11;
    page.drawText(`${checkbox(docChecklist.hasFDAAuthorization || false)} FDA Authorization`, { x: rightX, y: rightY, size: 8, font: helvetica });
    rightY -= 11;
    page.drawText(`${checkbox(docChecklist.hasCompanyPermit || false)} Company Permit`, { x: rightX, y: rightY, size: 8, font: helvetica });
    rightY -= 11;
    page.drawText(`${checkbox(docChecklist.hasSpecialPopulationPermit || false)} Special Population Permit`, { x: rightX, y: rightY, size: 8, font: helvetica });
    rightY -= 11;

    // ✅ NEW: Special Population Details
    if (docChecklist.hasSpecialPopulationPermit && docChecklist.specialPopulationPermitDetails) {
      page.drawText(`Details: ${docChecklist.specialPopulationPermitDetails}`, { x: rightX + 10, y: rightY, size: 8, font: helvetica });
      rightY -= 11;
    }

    // ✅ NEW: Other Documents
    page.drawText(`${checkbox(docChecklist.hasOtherDocs || false)} Other Documents`, { x: rightX, y: rightY, size: 8, font: helvetica });
    rightY -= 11;

    if (docChecklist.hasOtherDocs && docChecklist.otherDocsDetails) {
      page.drawText(`Details: ${docChecklist.otherDocsDetails}`, { x: rightX + 10, y: rightY, size: 8, font: helvetica });
      rightY -= 11;
    }

    yPos = Math.min(leftY, rightY) - 20;

    if (yPos < 150) {
      page = pdfDoc.addPage([pageWidth, pageHeight]);
      yPos = pageHeight - margin;
    }

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
// ========== 2. RESEARCH PROTOCOL WITH IMAGES & SIGNATURES (UPDATED) ==========
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

    const embedImageFromUrl = async (imageUrl: string) => {
      try {
        const response = await fetch(imageUrl);
        const imageBytes = await response.arrayBuffer();

        const uint8Array = new Uint8Array(imageBytes);

        // ✅ Better detection logic
        const isPNG = uint8Array[0] === 0x89 && uint8Array[1] === 0x50 && uint8Array[2] === 0x4e;
        const isJPEG = uint8Array[0] === 0xFF && uint8Array[1] === 0xD8;

        console.log(`🖼️ Image bytes: [${uint8Array[0]}, ${uint8Array[1]}, ${uint8Array[2]}], isPNG: ${isPNG}, isJPEG: ${isJPEG}`);

        try {
          if (isPNG) {
            console.log('📌 Embedding as PNG');
            return await pdfDoc.embedPng(imageBytes);
          } else if (isJPEG) {
            console.log('📌 Embedding as JPEG');
            return await pdfDoc.embedJpg(imageBytes);
          } else {
            // Try PNG first, then JPEG as fallback
            console.log('❓ Unknown format, trying PNG first...');
            try {
              return await pdfDoc.embedPng(imageBytes);
            } catch {
              console.log('⚠️ PNG failed, trying JPEG...');
              return await pdfDoc.embedJpg(imageBytes);
            }
          }
        } catch (embedError) {
          console.error(`❌ Failed to embed image (${imageUrl}):`, embedError);
          return null;
        }
      } catch (error) {
        console.error('❌ Error fetching image:', error);
        return null;
      }
    };

    // ✅ Helper: Extract image URLs from HTML
    const extractImageUrls = (html: string): string[] => {
      if (!html) return [];
      const imgRegex = /<img[^>]+src="([^">]+)"/g;
      const urls: string[] = [];
      let match;
      while ((match = imgRegex.exec(html)) !== null) {
        urls.push(match[1]);
      }
      return urls;
    };

    const wrapText = (text: string, maxWidth: number, fontSize: number) => {
      if (!text || text.trim() === '') return [];

      const sanitizedText = stripHtmlAndSanitize(text);
      const paragraphs = sanitizedText.split('\n');
      const allLines: string[] = [];

      for (const paragraph of paragraphs) {
        if (!paragraph.trim()) {
          allLines.push('');
          continue;
        }

        const words = paragraph.split(' ');
        let currentLine = '';

        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
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

    // ✅ Add debugging
    console.log('🔍 Content check for introduction:');
    console.log('Has <img tags?', step3?.introduction?.includes('<img'));
    console.log('Image URLs found:', extractImageUrls(step3?.introduction || ''));
    console.log('First 300 chars:', step3?.introduction?.substring(0, 300));

    const addSection = async (title: string, content: string) => {
      if (!content) return;

      if (yPos < 120) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        yPos = pageHeight - margin;
      }

      // ✅ EXTRACT IMAGES FIRST (before any HTML stripping!)
      const imageUrls = extractImageUrls(content);
      console.log('📸 Found images:', imageUrls);

      // Draw section header
      page.drawRectangle({
        x: margin,
        y: yPos - 12,
        width: pageWidth - 2 * margin,
        height: 12,
        color: rgb(0.95, 0.95, 0.95),
      });
      page.drawText(title, { x: margin + 5, y: yPos - 10, size: 9, font: helveticaBold });
      yPos -= 20;

      // Draw text (strips HTML)
      const lines = wrapText(content, pageWidth - 2 * margin - 10, 9);
      for (const line of lines) {
        if (yPos < 80) {
          page = pdfDoc.addPage([pageWidth, pageHeight]);
          yPos = pageHeight - margin;
        }
        page.drawText(line, { x: margin + 5, y: yPos, size: 9, font: helvetica });
        yPos -= 12;
      }

      // ✅ EMBED IMAGES
      for (const imageUrl of imageUrls) {
        if (!imageUrl) continue;

        console.log('🖼️ Embedding image:', imageUrl);

        try {
          const embeddedImage = await embedImageFromUrl(imageUrl);

          if (embeddedImage) {
            const imgWidth = 300;
            const imgHeight = (embeddedImage.height / embeddedImage.width) * imgWidth;

            if (yPos - imgHeight < 80) {
              page = pdfDoc.addPage([pageWidth, pageHeight]);
              yPos = pageHeight - margin;
            }

            yPos -= imgHeight + 10;

            page.drawImage(embeddedImage, {
              x: margin + 5,
              y: yPos,
              width: imgWidth,
              height: imgHeight,
            });

            console.log('✅ Image embedded');
            yPos -= 10;
          } else {
            console.warn('⚠️ Failed to embed image');
          }
        } catch (error) {
          console.error('❌ Error embedding image:', error);
        }
      }

      yPos -= 10;
    };

    // Add all sections with images
    await addSection('I. Title of the Study', step3?.title || step1?.title || 'N/A');
    await addSection('II. Introduction', step3?.introduction || 'N/A');
    await addSection('III. Background of the Study', step3?.background || 'N/A');
    await addSection('IV. Statement of the Problem/Objectives of the Study', step3?.problemStatement || 'N/A');
    await addSection('V. Scope and Delimitation', step3?.scopeDelimitation || 'N/A');
    await addSection('VI. Related Literature & Studies', step3?.literatureReview || 'N/A');
    await addSection('VII. Research Methodology', step3?.methodology || 'N/A');
    await addSection('VIII. Population, Respondents, and Sample Size', step3?.population || 'N/A');
    await addSection('IX. Sampling Technique', step3?.samplingTechnique || 'N/A');
    await addSection('X. Research Instrument and Validation', step3?.researchInstrument || 'N/A');
    await addSection('XI. Ethical Consideration', step3?.ethicalConsideration || 'The research will ensure participant confidentiality, informed consent, and data protection.');
    await addSection('XII. Statistical Treatment of Data', step3?.statisticalTreatment || 'N/A');
    await addSection('XIII. References (Main Themes Only)', step3?.references || 'N/A');

    // ✅ Add researcher signatures
    if (yPos < 250) {
      page = pdfDoc.addPage([pageWidth, pageHeight]);
      yPos = pageHeight - margin;
    }

    page.drawText('Accomplished by:', { x: margin + 5, y: yPos, size: 9, font: helvetica });
    yPos -= 30;

    const researchers = submissionData.step3?.researchers || [];

    if (researchers.length > 0) {
      for (const researcher of researchers) {
        if (yPos < 150) {
          page = pdfDoc.addPage([pageWidth, pageHeight]);
          yPos = pageHeight - margin;
        }

        // ✅ SIGNATURE ON TOP (NEW)
        let signatureEmbedded = false;

        // ✅ TRY signed URL FIRST, then fallback to base64
        if (researcher.signature || researcher.signatureBase64) {
          try {
            let signatureImage = null;

            // ✅ TRY SIGNED URL first
            if (researcher.signature?.startsWith('http')) {
              console.log('🔗 Trying signed URL for:', researcher.name);
              signatureImage = await embedImageFromUrl(researcher.signature);
            }

            // ✅ FALLBACK to base64 if signed URL fails or doesn't exist
            if (!signatureImage && researcher.signatureBase64) {
              console.log('📸 Fallback to base64 for:', researcher.name);
              const base64Data = researcher.signatureBase64.split(',')[1];
              const signatureBytes = Buffer.from(base64Data, 'base64');
              const isPNG = researcher.signatureBase64.startsWith('data:image/png');

              if (isPNG) {
                signatureImage = await pdfDoc.embedPng(signatureBytes);
              } else {
                signatureImage = await pdfDoc.embedJpg(signatureBytes);
              }
            }

            if (signatureImage) {
              const sigWidth = 100;
              const sigHeight = (signatureImage.height / signatureImage.width) * sigWidth;

              // ✅ Draw signature image at current yPos
              page.drawImage(signatureImage, {
                x: margin + 5,
                y: yPos - sigHeight,
                width: sigWidth,
                height: sigHeight,
              });

              yPos -= sigHeight + 5;
              signatureEmbedded = true;
              console.log('✅ Signature embedded for:', researcher.name);
            } else {
              throw new Error('Could not embed signature');
            }
          } catch (error) {
            console.error('❌ Error embedding signature:', error);
            // Draw placeholder line if signature fails
            page.drawLine({
              start: { x: margin + 5, y: yPos },
              end: { x: margin + 150, y: yPos },
              thickness: 1,
            });
            yPos -= 20;
            signatureEmbedded = false;
          }
        } else {
          // No signature - draw line
          page.drawLine({
            start: { x: margin + 5, y: yPos },
            end: { x: margin + 150, y: yPos },
            thickness: 1,
          });
          yPos -= 20;
          signatureEmbedded = false;
        }

        // ✅ RESEARCHER NAME BELOW SIGNATURE (MOVED DOWN)
        page.drawText(researcher.name || 'Unknown', {
          x: margin + 5,
          y: yPos,
          size: 9,
          font: helveticaBold,
        });
        yPos -= 12;

        page.drawText('Signature over printed name', {
          x: margin + 5,
          y: yPos,
          size: 7,
          font: helvetica,
          color: rgb(0.5, 0.5, 0.5),
        });

        yPos -= 25;
      }
    } else {
      // Fallback if no researchers
      yPos -= 15;
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
    }

    // Add page numbers
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



// ========== 3. INFORMED CONSENT FORM (FINAL VERSION) ==========
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

    // ✅ HELPER: Print field with fallback (skip if both empty)
    const printField = (primary: any, fallback: any = '') => {
      if (primary && String(primary).trim()) return String(primary);
      if (fallback && String(fallback).trim()) return String(fallback);
      return ''; // ✅ Empty string = section won't print
    };

    const wrapText = (text: string, maxWidth: number, fontSize: number) => {
      if (!text || text.trim() === '') return [];
      const sanitizedText = stripHtmlAndSanitize(text);
      const paragraphs = sanitizedText.split('\n');
      const allLines: string[] = [];

      for (const paragraph of paragraphs) {
        if (!paragraph.trim()) {
          allLines.push('');
          continue;
        }

        const words = paragraph.split(' ');
        let currentLine = '';

        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
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

    const step4 = submissionData.step4?.formData || submissionData.step4;
    const step2 = submissionData.step2;
    const consentType = submissionData.step4?.consentType || 'adult';

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

    // ✅ PARTICIPANT GROUP (INTELLIGENT FALLBACK - ONLY PRINTS IF EXISTS)
    const informedConsentFor = printField(
      step4?.informedConsentFor,
      step4?.participantGroupIdentity
    );
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

    // ✅ PROJECT AND RESEARCHER INFO
    if (step2) {
      page.drawText('PROJECT AND RESEARCHER INFORMATION', {
        x: margin,
        y: yPos,
        size: 10,
        font: helveticaBold,
      });
      yPos -= 15;

      const institution = step2.organization || 'University of Makati';
      page.drawText(`Organization: ${institution}`, {
        x: margin,
        y: yPos,
        size: 9,
        font: helvetica,
      });
      yPos -= 12;

      const email = step2.project_leader_email || '';
      if (email) {
        page.drawText(`Email: ${email}`, {
          x: margin,
          y: yPos,
          size: 9,
          font: helvetica,
        });
        yPos -= 12;
      }

      const projectTitle = step2.title || '';
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

    // ✅ DYNAMIC SECTION RENDERER (ONLY PRINTS IF CONTENT EXISTS)
    const addConsentSection = (title: string, content: string) => {
        console.log(`📋 ${title}: "${content?.substring(0, 50)}" (length: ${content?.length})`);

      // ✅ SKIP ENTIRELY if content is empty
      if (!content || content.trim() === '') return;

      if (yPos < 100) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        yPos = pageHeight - margin;
      }

      page.drawText(title, { x: margin, y: yPos, size: 10, font: helveticaBold });
      yPos -= 15;

      const lines = wrapText(content, pageWidth - 2 * margin - 10, 9);
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

    // ========== ADULT CONSENT - ENGLISH ==========
    if (
      consentType === 'adult' || consentType === 'both' &&
      (step4?.adultLanguage === 'english' || step4?.adultLanguage === 'both')
    ) {
      addConsentSection('1. INTRODUCTION', printField(step4?.introductionEnglish));
      addConsentSection('2. PURPOSE OF THE STUDY', printField(step4?.purposeEnglish));
      addConsentSection('3. TYPE OF RESEARCH INTERVENTION', printField(step4?.researchInterventionEnglish));
      addConsentSection('4. PARTICIPANT SELECTION', printField(step4?.participantSelectionEnglish));
      addConsentSection('5. VOLUNTARY PARTICIPATION', printField(step4?.voluntaryParticipationEnglish));
      addConsentSection('6. PROCEDURES', printField(step4?.proceduresEnglish));
      addConsentSection('7. DURATION', printField(step4?.durationEnglish));
      addConsentSection('8. RISKS AND INCONVENIENCES', printField(step4?.risksEnglish));
      addConsentSection('9. BENEFITS', printField(step4?.benefitsEnglish));
      addConsentSection('10. REIMBURSEMENTS', printField(step4?.reimbursementsEnglish));
      addConsentSection('11. CONFIDENTIALITY', printField(step4?.confidentialityEnglish));
      addConsentSection('12. SHARING THE RESULTS', printField(step4?.sharingResultsEnglish));
      addConsentSection('13. RIGHT TO REFUSE OR WITHDRAW', printField(step4?.rightToRefuseEnglish));
      addConsentSection('14. WHO TO CONTACT', printField(step4?.whoToContactEnglish));
    }

    // ========== ADULT CONSENT - TAGALOG ==========
    if (
      consentType === 'adult' || consentType === 'both' &&
      (step4?.adultLanguage === 'tagalog' || step4?.adultLanguage === 'both')
    ) {
      // ✅ CHECK if any Tagalog content exists before printing header
      const hasTagalogContent = [
        step4?.introductionTagalog,
        step4?.purposeTagalog,
        step4?.researchInterventionTagalog,
        step4?.participantSelectionTagalog,
        step4?.voluntaryParticipationTagalog,
        step4?.proceduresTagalog,
        step4?.durationTagalog,
        step4?.risksTagalog,
        step4?.benefitsTagalog,
        step4?.reimbursementsTagalog,
        step4?.confidentialityTagalog,
        step4?.sharingResultsTagalog,
        step4?.rightToRefuseTagalog,
        step4?.whoToContactTagalog,
      ].some(field => field && String(field).trim());

      if (hasTagalogContent) {
        if (yPos < 600) {
          page = pdfDoc.addPage([pageWidth, pageHeight]);
          yPos = pageHeight - margin;
        }

        page.drawText('PAHINTULOT NA MAY KAALAMAN', {
          x: margin,
          y: yPos,
          size: 11,
          font: helveticaBold,
        });
        yPos -= 20;

        addConsentSection('1. PAMBUNGAD', printField(step4?.introductionTagalog));
        addConsentSection('2. LAYUNIN NG PANANALIKSIK', printField(step4?.purposeTagalog));
        addConsentSection('3. URI NG PANANALIKSIK NA PAKIKIBAHAGI', printField(step4?.researchInterventionTagalog));
        addConsentSection('4. PAGPILI NG KALAHOK', printField(step4?.participantSelectionTagalog));
        addConsentSection('5. KUSANG PAKIKIBAHAGI', printField(step4?.voluntaryParticipationTagalog));
        addConsentSection('6. MGA PAMAMARAAN', printField(step4?.proceduresTagalog));
        addConsentSection('7. TAGAL', printField(step4?.durationTagalog));
        addConsentSection('8. MGA PANGANIB AT ABALA', printField(step4?.risksTagalog));
        addConsentSection('9. MGA BENEPISYO', printField(step4?.benefitsTagalog));
        addConsentSection('10. PAGBABAYAD-BAYAD', printField(step4?.reimbursementsTagalog));
        addConsentSection('11. PAGIGING KUMPIDENSYAL', printField(step4?.confidentialityTagalog));
        addConsentSection('12. PAGBABAHAGI NG MGA RESULTA', printField(step4?.sharingResultsTagalog));
        addConsentSection('13. KARAPATAN NA TUMANGGI O LUMABAS', printField(step4?.rightToRefuseTagalog));
        addConsentSection('14. SINO ANG MAKAKAUSAP', printField(step4?.whoToContactTagalog));
      }
    }

    // ========== MINOR ASSENT - ENGLISH ==========
    if (
      consentType === 'minor' || consentType === 'both' &&
      (step4?.minorLanguage === 'english' || step4?.minorLanguage === 'both')
    ) {
      if (yPos < 600) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        yPos = pageHeight - margin;
      }

      page.drawText('INFORMED ASSENT FORM FOR MINORS (ENGLISH)', {
        x: margin,
        y: yPos,
        size: 11,
        font: helveticaBold,
      });
      yPos -= 20;

      addConsentSection('1. INTRODUCTION', printField(step4?.introductionMinorEnglish));
      addConsentSection('2. PURPOSE OF RESEARCH', printField(step4?.purposeMinorEnglish));
      addConsentSection('3. CHOICE OF PARTICIPANTS', printField(step4?.choiceOfParticipantsEnglish));
      addConsentSection('4. VOLUNTARINESS OF PARTICIPATION', printField(step4?.voluntarinessMinorEnglish));
      addConsentSection('5. PROCEDURES', printField(step4?.proceduresMinorEnglish));
      addConsentSection('6. RISKS AND INCONVENIENCES', printField(step4?.risksMinorEnglish));
      addConsentSection('7. POSSIBLE BENEFITS', printField(step4?.benefitsMinorEnglish));
      addConsentSection('8. CONFIDENTIALITY', printField(step4?.confidentialityMinorEnglish));
      addConsentSection('9. SHARING THE FINDINGS', printField(step4?.sharingFindingsEnglish));
    }

    // ========== MINOR ASSENT - TAGALOG ==========
    if (
      consentType === 'minor' || consentType === 'both' &&
      (step4?.minorLanguage === 'tagalog' || step4?.minorLanguage === 'both')
    ) {
      if (yPos < 600) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        yPos = pageHeight - margin;
      }

      page.drawText('PAHINTULOT NA MAY KAALAMAN PARA SA BATA', {
        x: margin,
        y: yPos,
        size: 11,
        font: helveticaBold,
      });
      yPos -= 20;

      addConsentSection('1. PAMBUNGAD', printField(step4?.introductionMinorTagalog));
      addConsentSection('2. LAYUNIN NG PANANALIKSIK', printField(step4?.purposeMinorTagalog));
      addConsentSection('3. PAGPILI NG KALAHOK', printField(step4?.choiceOfParticipantsTagalog));
      addConsentSection('4. KUSANG PAKIKIBAHAGI', printField(step4?.voluntarinessMinorTagalog));
      addConsentSection('5. MGA PAMAMARAAN', printField(step4?.proceduresMinorTagalog));
      addConsentSection('6. MGA PANGANIB AT ABALA', printField(step4?.risksMinorTagalog));
      addConsentSection('7. POSIBLENG MGA BENEPISYO', printField(step4?.benefitsMinorTagalog));
      addConsentSection('8. PAGIGING KUMPIDENSYAL', printField(step4?.confidentialityMinorTagalog));
      addConsentSection('9. PAGBABAHAGI NG MGA NATUKLASAN', printField(step4?.sharingFindingsTagalog));
    }

    // ✅ CONTACT INFORMATION (ONLY PRINTS IF EXISTS)
    if (step4?.contact_person || step4?.contact_number) {
      if (yPos < 100) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        yPos = pageHeight - margin;
      }

      page.drawText('CONTACT INFORMATION', { x: margin, y: yPos, size: 10, font: helveticaBold });
      yPos -= 15;

      if (step4?.contact_person) {
        page.drawText(`Contact Person: ${step4.contact_person}`, { x: margin, y: yPos, size: 9, font: helvetica });
        yPos -= 12;
      }

      if (step4?.contact_number) {
        page.drawText(`Contact Number: ${step4.contact_number}`, { x: margin, y: yPos, size: 9, font: helvetica });
        yPos -= 12;
      }
    }

    // ✅ PAGE NUMBERS
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


export async function generateConsolidatedReviewerPdf(
  submissionData: any
): Promise<{ success: boolean; pdfData?: string; fileName?: string; pageCount?: number; error?: string }> {
  try {
    const pdfDoc = await PDFDocument.create();
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const helveticaItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

    const pageWidth = 612;
    const pageHeight = 792;
    const margin = 50;

    let page = pdfDoc.addPage([pageWidth, pageHeight]);
    let yPos = pageHeight - margin;

    // HELPER: Print field with fallback
    const printField = (primary: any, fallback: any = '') => {
      if (primary && String(primary).trim()) return String(primary);
      if (fallback && String(fallback).trim()) return String(fallback);
      return '';
    };

    const wrapText = (text: string, maxWidth: number, fontSize: number) => {
      if (!text || text.trim() === '') return [];
      const sanitizedText = stripHtmlAndSanitize(text);
      const paragraphs = sanitizedText.split('\n');
      const allLines: string[] = [];

      for (const paragraph of paragraphs) {
        if (!paragraph.trim()) {
          allLines.push('');
          continue;
        }

        const words = paragraph.split(' ');
        let currentLine = '';

        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
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

    const addSection = (title: string, content: string) => {
      if (!content || content.trim() === '') return;

      if (yPos < 100) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        yPos = pageHeight - margin;
      }

      page.drawText(title, { x: margin, y: yPos, size: 10, font: helveticaBold });
      yPos -= 15;

      const lines = wrapText(content, pageWidth - 2 * margin - 10, 9);
      lines.forEach(line => {
        if (yPos < 60) {
          page = pdfDoc.addPage([pageWidth, pageHeight]);
          yPos = pageHeight - margin;
        }
        page.drawText(line, { x: margin, y: yPos, size: 9, font: helvetica });
        yPos -= 12;
      });

      yPos -= 10;
    };

    const addPageBreak = () => {
      page = pdfDoc.addPage([pageWidth, pageHeight]);
      yPos = pageHeight - margin;
    };

    // DYNAMIC SECTION RENDERER (ONLY PRINTS IF CONTENT EXISTS)
    const addConsentSection = (title: string, content: string) => {
      if (!content || content.trim() === '') return;

      if (yPos < 100) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        yPos = pageHeight - margin;
      }

      page.drawText(title, { x: margin, y: yPos, size: 10, font: helveticaBold });
      yPos -= 15;

      const lines = wrapText(content, pageWidth - 2 * margin - 10, 9);
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

    // ========== COVER PAGE ==========
    page.drawText('RESEARCH SUBMISSION CONSOLIDATED DOCUMENT', {
      x: pageWidth / 2 - helveticaBold.widthOfTextAtSize('RESEARCH SUBMISSION CONSOLIDATED DOCUMENT', 16) / 2,
      y: yPos,
      size: 16,
      font: helveticaBold,
    });
    yPos -= 40;

    page.drawText('For Reviewer Use Only', {
      x: pageWidth / 2 - helveticaItalic.widthOfTextAtSize('For Reviewer Use Only', 11) / 2,
      y: yPos,
      size: 11,
      font: helveticaItalic,
      color: rgb(0.5, 0.5, 0.5),
    });
    yPos -= 50;

    const step1 = submissionData.step1;
    const step2 = submissionData.step2;
    const step3 = submissionData.step3?.formData;
    const step4 = submissionData.step4?.formData || submissionData.step4;
    const consentType = submissionData.step4?.consentType || 'adult';

    page.drawText('Research Title:', {
      x: margin,
      y: yPos,
      size: 10,
      font: helveticaBold,
    });
    yPos -= 15;

    const titleLines = wrapText(step1?.title || step2?.title || 'N/A', pageWidth - 2 * margin - 10, 9);
    titleLines.forEach(line => {
      page.drawText(line, { x: margin, y: yPos, size: 9, font: helvetica });
      yPos -= 12;
    });

    yPos -= 20;

    page.drawText(`Submission Date: ${new Date().toISOString().split('T')[0]}`, {
      x: margin,
      y: yPos,
      size: 9,
      font: helvetica,
    });
    yPos -= 50;

    page.drawText('Table of Contents:', {
      x: margin,
      y: yPos,
      size: 10,
      font: helveticaBold,
    });
    yPos -= 15;

    page.drawText('1. Research Protocol & Study Information', {
      x: margin + 10,
      y: yPos,
      size: 9,
      font: helvetica,
    });
    yPos -= 12;

    page.drawText('2. Informed Consent Form', {
      x: margin + 10,
      y: yPos,
      size: 9,
      font: helvetica,
    });
    yPos -= 25;

    // ========== SECTION 1: RESEARCH PROTOCOL & STUDY INFO ==========
    addPageBreak();

    page.drawText('SECTION 1: RESEARCH PROTOCOL & STUDY INFORMATION', {
      x: margin,
      y: yPos,
      size: 12,
      font: helveticaBold,
    });
    yPos -= 30;

    page.drawText('Study Title:', {
      x: margin,
      y: yPos,
      size: 10,
      font: helveticaBold,
    });
    yPos -= 12;

    const titleLines2 = wrapText(step1?.title || step2?.title || 'N/A', pageWidth - 2 * margin - 10, 9);
    titleLines2.forEach(line => {
      page.drawText(line, { x: margin, y: yPos, size: 9, font: helvetica });
      yPos -= 12;
    });

    yPos -= 10;



    page.drawText('Organization:', {
      x: margin,
      y: yPos,
      size: 10,
      font: helveticaBold,
    });
    yPos -= 12;
    page.drawText(step2?.organization || step2?.institution || 'University of Makati', {
      x: margin,
      y: yPos,
      size: 9,
      font: helvetica,
    });
    yPos -= 15;

    page.drawText('College/Department:', {
      x: margin,
      y: yPos,
      size: 10,
      font: helveticaBold,
    });
    yPos -= 12;
    page.drawText(step2?.college || 'N/A', { x: margin, y: yPos, size: 9, font: helvetica });
    yPos -= 20;

    page.drawText('Type of Study:', {
      x: margin,
      y: yPos,
      size: 10,
      font: helveticaBold,
    });
    yPos -= 12;
    const typeOfStudy = step2?.typeOfStudy || [];
    const studyTypes = Array.isArray(typeOfStudy) ? typeOfStudy : [typeOfStudy];
    studyTypes.forEach((type: string) => {
      page.drawText(`• ${type}`, { x: margin + 10, y: yPos, size: 9, font: helvetica });
      yPos -= 12;
    });
    yPos -= 5;

    page.drawText('Source of Funding:', {
      x: margin,
      y: yPos,
      size: 10,
      font: helveticaBold,
    });
    yPos -= 12;
    const funding = step2?.sourceOfFunding || [];
    const fundingSources = Array.isArray(funding) ? funding : [funding];
    fundingSources.forEach((source: string) => {
      page.drawText(`• ${source}`, { x: margin + 10, y: yPos, size: 9, font: helvetica });
      yPos -= 12;
    });
    yPos -= 10;

    page.drawText(`Study Duration: ${step2?.startDate} to ${step2?.endDate}`, {
      x: margin,
      y: yPos,
      size: 9,
      font: helvetica,
    });
    yPos -= 12;

    page.drawText(`Number of Participants: ${step2?.numParticipants || 'N/A'}`, {
      x: margin,
      y: yPos,
      size: 9,
      font: helvetica,
    });
    yPos -= 20;

    // Research Protocol Sections
    addSection('I. Introduction', step3?.introduction);
    addSection('II. Background of the Study', step3?.background);
    addSection('III. Statement of the Problem/Objectives', step3?.problemStatement);
    addSection('IV. Scope and Delimitation', step3?.scopeDelimitation);
    addSection('V. Related Literature & Studies', step3?.literatureReview);
    addSection('VI. Research Methodology', step3?.methodology);
    addSection('VII. Population, Respondents, and Sample Size', step3?.population);
    addSection('VIII. Sampling Technique', step3?.samplingTechnique);
    addSection('IX. Research Instrument and Validation', step3?.researchInstrument);
    addSection('X. Statistical Treatment of Data', step3?.statisticalTreatment);
    addSection('XI. Ethical Consideration', step3?.ethicalConsideration);
    addSection('XII. References', step3?.references);

    // ========== SECTION 2: INFORMED CONSENT FORM ==========
    addPageBreak();

    page.drawText('SECTION 2: INFORMED CONSENT FORM', {
      x: margin,
      y: yPos,
      size: 12,
      font: helveticaBold,
    });
    yPos -= 30;

    const informedConsentFor = printField(step4?.informedConsentFor, step4?.participantGroupIdentity);
    if (informedConsentFor) {
      page.drawText('Informed Consent Form for:', {
        x: margin,
        y: yPos,
        size: 10,
        font: helveticaBold,
      });
      yPos -= 12;
      page.drawText(informedConsentFor, { x: margin, y: yPos, size: 9, font: helvetica });
      yPos -= 20;
    }

    // ========== ADULT CONSENT - ENGLISH ==========
    if (
      (consentType === 'adult' || consentType === 'both') &&
      (step4?.adultLanguage === 'english' || step4?.adultLanguage === 'both')
    ) {
      addConsentSection('1. INTRODUCTION', printField(step4?.introductionEnglish));
      addConsentSection('2. PURPOSE OF THE STUDY', printField(step4?.purposeEnglish));
      addConsentSection('3. TYPE OF RESEARCH INTERVENTION', printField(step4?.researchInterventionEnglish));
      addConsentSection('4. PARTICIPANT SELECTION', printField(step4?.participantSelectionEnglish));
      addConsentSection('5. VOLUNTARY PARTICIPATION', printField(step4?.voluntaryParticipationEnglish));
      addConsentSection('6. PROCEDURES', printField(step4?.proceduresEnglish));
      addConsentSection('7. DURATION', printField(step4?.durationEnglish));
      addConsentSection('8. RISKS AND INCONVENIENCES', printField(step4?.risksEnglish));
      addConsentSection('9. BENEFITS', printField(step4?.benefitsEnglish));
      addConsentSection('10. REIMBURSEMENTS', printField(step4?.reimbursementsEnglish));
      addConsentSection('11. CONFIDENTIALITY', printField(step4?.confidentialityEnglish));
      addConsentSection('12. SHARING THE RESULTS', printField(step4?.sharingResultsEnglish));
      addConsentSection('13. RIGHT TO REFUSE OR WITHDRAW', printField(step4?.rightToRefuseEnglish));
    }

    // ========== ADULT CONSENT - TAGALOG ==========
    if (
      (consentType === 'adult' || consentType === 'both') &&
      (step4?.adultLanguage === 'tagalog' || step4?.adultLanguage === 'both')
    ) {
      const hasTagalogContent = [
        step4?.introductionTagalog,
        step4?.purposeTagalog,
        step4?.researchInterventionTagalog,
        step4?.participantSelectionTagalog,
        step4?.voluntaryParticipationTagalog,
        step4?.proceduresTagalog,
        step4?.durationTagalog,
        step4?.risksTagalog,
        step4?.benefitsTagalog,
        step4?.reimbursementsTagalog,
        step4?.confidentialityTagalog,
        step4?.sharingResultsTagalog,
        step4?.rightToRefuseTagalog,
        step4?.whoToContactTagalog,
      ].some(field => field && String(field).trim());

      if (hasTagalogContent) {
        if (yPos < 600) {
          addPageBreak();
        }

        page.drawText('PAHINTULOT NA MAY KAALAMAN', {
          x: margin,
          y: yPos,
          size: 11,
          font: helveticaBold,
        });
        yPos -= 20;

        addConsentSection('1. PAMBUNGAD', printField(step4?.introductionTagalog));
        addConsentSection('2. LAYUNIN NG PANANALIKSIK', printField(step4?.purposeTagalog));
        addConsentSection('3. URI NG PANANALIKSIK NA PAKIKIBAHAGI', printField(step4?.researchInterventionTagalog));
        addConsentSection('4. PAGPILI NG KALAHOK', printField(step4?.participantSelectionTagalog));
        addConsentSection('5. KUSANG PAKIKIBAHAGI', printField(step4?.voluntaryParticipationTagalog));
        addConsentSection('6. MGA PAMAMARAAN', printField(step4?.proceduresTagalog));
        addConsentSection('7. TAGAL', printField(step4?.durationTagalog));
        addConsentSection('8. MGA PANGANIB AT ABALA', printField(step4?.risksTagalog));
        addConsentSection('9. MGA BENEPISYO', printField(step4?.benefitsTagalog));
        addConsentSection('10. PAGBABAYAD-BAYAD', printField(step4?.reimbursementsTagalog));
        addConsentSection('11. PAGIGING KUMPIDENSYAL', printField(step4?.confidentialityTagalog));
        addConsentSection('12. PAGBABAHAGI NG MGA RESULTA', printField(step4?.sharingResultsTagalog));
        addConsentSection('13. KARAPATAN NA TUMANGGI O LUMABAS', printField(step4?.rightToRefuseTagalog));
      }
    }

    // ========== MINOR ASSENT - ENGLISH ==========
    if (
      (consentType === 'minor' || consentType === 'both') &&
      (step4?.minorLanguage === 'english' || step4?.minorLanguage === 'both')
    ) {
      if (yPos < 600) {
        addPageBreak();
      }

      page.drawText('INFORMED ASSENT FORM FOR MINORS (ENGLISH)', {
        x: margin,
        y: yPos,
        size: 11,
        font: helveticaBold,
      });
      yPos -= 20;

      addConsentSection('1. INTRODUCTION', printField(step4?.introductionMinorEnglish));
      addConsentSection('2. PURPOSE OF RESEARCH', printField(step4?.purposeMinorEnglish));
      addConsentSection('3. CHOICE OF PARTICIPANTS', printField(step4?.choiceOfParticipantsEnglish));
      addConsentSection('4. VOLUNTARINESS OF PARTICIPATION', printField(step4?.voluntarinessMinorEnglish));
      addConsentSection('5. PROCEDURES', printField(step4?.proceduresMinorEnglish));
      addConsentSection('6. RISKS AND INCONVENIENCES', printField(step4?.risksMinorEnglish));
      addConsentSection('7. POSSIBLE BENEFITS', printField(step4?.benefitsMinorEnglish));
      addConsentSection('8. CONFIDENTIALITY', printField(step4?.confidentialityMinorEnglish));
      addConsentSection('9. SHARING THE FINDINGS', printField(step4?.sharingFindingsEnglish));
    }

    // ========== MINOR ASSENT - TAGALOG ==========
    if (
      (consentType === 'minor' || consentType === 'both') &&
      (step4?.minorLanguage === 'tagalog' || step4?.minorLanguage === 'both')
    ) {
      if (yPos < 600) {
        addPageBreak();
      }

      page.drawText('PAHINTULOT NA MAY KAALAMAN PARA SA BATA', {
        x: margin,
        y: yPos,
        size: 11,
        font: helveticaBold,
      });
      yPos -= 20;

      addConsentSection('1. PAMBUNGAD', printField(step4?.introductionMinorTagalog));
      addConsentSection('2. LAYUNIN NG PANANALIKSIK', printField(step4?.purposeMinorTagalog));
      addConsentSection('3. PAGPILI NG KALAHOK', printField(step4?.choiceOfParticipantsTagalog));
      addConsentSection('4. KUSANG PAKIKIBAHAGI', printField(step4?.voluntarinessMinorTagalog));
      addConsentSection('5. MGA PAMAMARAAN', printField(step4?.proceduresMinorTagalog));
      addConsentSection('6. MGA PANGANIB AT ABALA', printField(step4?.risksMinorTagalog));
      addConsentSection('7. POSIBLENG MGA BENEPISYO', printField(step4?.benefitsMinorTagalog));
      addConsentSection('8. PAGIGING KUMPIDENSYAL', printField(step4?.confidentialityMinorTagalog));
      addConsentSection('9. PAGBABAHAGI NG MGA NATUKLASAN', printField(step4?.sharingFindingsTagalog));
    }
    const supabase = await createClient();
    const downloadPdf = async (fileUrl: string) => {
      const { data: fileData } = await supabase.storage
        .from('research-documents')
        .download(fileUrl);

      if (fileData) {
        const arrayBuffer = await fileData.arrayBuffer();
        return Buffer.from(arrayBuffer);
      }
      return null;
    };

    // Get research_instrument document (questionnaire)
    const { data: documents } = await supabase
      .from('uploaded_documents')
      .select('*')
      .eq('submission_id', submissionData.submissionId) // Add submissionId to submissionData
      .eq('document_type', 'research_instrument');

    if (documents && documents.length > 0) {
      const doc = documents[0];
      try {
        const pdfBytes = await downloadPdf(doc.file_url);
        if (pdfBytes) {
          const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

          // Add separator page
          const separatorPage = pdfDoc.addPage([612, 792]);
          separatorPage.drawRectangle({
            x: 30,
            y: 356,
            width: 552,
            height: 80,
            color: rgb(1, 0.843, 0),
          });
          separatorPage.drawText('ATTACHMENT: RESEARCH INSTRUMENT (QUESTIONNAIRE)', {
            x: 80,
            y: 390,
            size: 14,
            font: helveticaBold,
            color: rgb(0.027, 0.067, 0.224),
          });

          // Add questionnaire pages
          const attachmentPdf = await PDFDocument.load(pdfBytes);
          const pages = await pdfDoc.copyPages(
            attachmentPdf,
            attachmentPdf.getPageIndices()
          );
          pages.forEach(page => pdfDoc.addPage(page));
        }
      } catch (error) {
        console.error('Error adding research instrument:', error);
      }
    }
    // PAGE NUMBERS & FOOTER
    const pages = pdfDoc.getPages();
    pages.forEach((page, index) => {
      page.drawText(`Page ${index + 1} of ${pages.length}`, {
        x: 265,
        y: 20,
        size: 8,
        font: helvetica,
        color: rgb(0.6, 0.6, 0.6),
      });

      page.drawText('CONFIDENTIAL - FOR REVIEWER USE ONLY', {
        x: margin,
        y: 30,
        size: 8,
        font: helveticaItalic,
        color: rgb(0.7, 0, 0),
      });
    });

    const pdfBytes = await pdfDoc.save();
    const pdfBase64 = `data:application/pdf;base64,${Buffer.from(pdfBytes).toString('base64')}`;

    return {
      success: true,
      pdfData: pdfBase64,
      fileName: `UMREC_Consolidated_Review_${Date.now()}.pdf`,
      pageCount: pages.length,
    };
  } catch (error) {
    console.error('Consolidated PDF generation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate consolidated PDF',
    };
  }
}