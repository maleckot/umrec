// utils/pdf/generateForm0012.ts
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// ✅ Sanitization helper
function sanitizeForPDF(text: string): string {
  if (!text) return '';
  
  return text
    .replace(/●/g, '•')
    .replace(/○/g, 'o')
    .replace(/■/g, '[■]')
    .replace(/□/g, '[ ]')
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .replace(/[—–]/g, '-')
    .replace(/…/g, '...')
    .replace(/[^\x20-\x7E\n\r\t]/g, '?');
}

const consentQuestions: { [key: string]: string } = {
  icf_q1: '1. Is it necessary to seek the informed consent of the participants?',
  icf_q2: '2. Are the information sheets clear and comprehensive?',
  icf_q3: '3. Is the consent procedure adequate?',
  icf_q4: '4. Do you have any other concerns?',
  icf_purpose: '• Purpose of the study?',
  icf_procedures: '• Procedures to be carried out?',
  icf_duration: '• Expected duration of participation?',
  icf_risks: '• Risks (including possible discrimination)?',
  icf_benefits: '• Benefits?',
  icf_compensation: '• Compensation/reimbursement?',
  icf_confidentiality: '• Confidentiality?',
  icf_data_protection: '• Data protection plan?',
  icf_withdrawal: '• Right to withdraw?',
  icf_discomforts: '• Discomforts and inconveniences?',
  icf_contact: '• Contact information?',
};

export async function generateForm0012PDF(submission: any, reviews: any[]) {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([612, 792]);
  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const margin = 50;
  let y = height - margin;

  // Title
  page.drawText('FORM 0012 - INFORMED CONSENT CHECKLIST', {
    x: margin,
    y,
    size: 14,
    font: boldFont
  });
  y -= 40;

  // Submission Info
  const info = [
    `Tracking Number: ${submission.submission_id}`,
    `Title: ${sanitizeForPDF(submission.title)}`,
    `Researcher: ${sanitizeForPDF(submission.profiles?.full_name || 'N/A')}`,
  ];

  info.forEach(line => {
    page.drawText(line, { x: margin, y, size: 10, font });
    y -= 20;
  });

  y -= 20;
  page.drawText('INFORMED CONSENT REVIEW:', {
    x: margin,
    y,
    size: 12,
    font: boldFont
  });
  y -= 30;

  // Reviews
  reviews?.forEach((review, index) => {
    page.drawText(`Reviewer ${index + 1}`, {
      x: margin,
      y,
      size: 10,
      font: boldFont
    });
    y -= 20;

    // Consent answers with questions
    const consentAnswers = review.consent_answers || {};
    Object.entries(consentAnswers).forEach(([key, value]) => {
      const question = consentQuestions[key];
      if (question && key !== 'icf_recommendation' && key !== 'icf_ethics_recommendation' && key !== 'icf_technical_suggestions') {
        if (y < 80) {
          page = pdfDoc.addPage([612, 792]);
          y = height - margin;
        }
        
        // ✅ Sanitize before drawing
        const safeQuestion = sanitizeForPDF(question);
        const safeAnswer = sanitizeForPDF(String(value));
        
        page.drawText(safeQuestion, { x: margin + 20, y, size: 9, font });
        y -= 15;
        page.drawText(`Answer: ${safeAnswer}`, { x: margin + 40, y, size: 9, font: boldFont, color: rgb(0, 0.5, 0) });
        y -= 15;
      }
    });

    y -= 10;
    page.drawText(`ICF Recommendation: ${sanitizeForPDF(consentAnswers.icf_recommendation || 'N/A')}`, {
      x: margin + 20,
      y,
      size: 10,
      font: boldFont
    });
    y -= 20;

    page.drawText(`Ethics Assessment: ${sanitizeForPDF(consentAnswers.icf_ethics_recommendation || 'N/A')}`, {
      x: margin + 20,
      y,
      size: 10,
      font: boldFont
    });
    y -= 20;

    // Comments section
    if (consentAnswers.icf_technical_suggestions) {
      page.drawText(`Comments: ${sanitizeForPDF(consentAnswers.icf_technical_suggestions)}`, {
        x: margin + 20,
        y,
        size: 9,
        font: italicFont
      });
      y -= 30;
    }

    y -= 20;
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
