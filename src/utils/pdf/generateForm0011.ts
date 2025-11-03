// utils/pdf/generateForm0011.ts
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

// Question mapping
const protocolQuestions: { [key: string]: string } = {
  q1: '1. Is/Are the research question(s) reasonable?',
  q2: '2. Are the study objectives clearly defined?',
  q3: '3. Are the methodology and research design appropriate?',
  q4: '4. Are the statistical methods appropriate?',
  q5: '5. Does the protocol present sufficient background information?',
  q6: '6. Does the study involve individuals who are vulnerable?',
  q7: '7. Are appropriate mechanisms in place to protect vulnerable participants?',
  q8: '8. Is the risk-benefit ratio acceptable?',
  q9: '9. Are the possible risks identified in the protocol?',
  q9b: '• Are the possible benefits identified in the protocol?',
  q10: '10. Are recruitment procedures appropriate?',
  q11: '11. Is the informed consent form adequate?',
  q12: '12. Are the privacy and confidentiality protections adequate?',
  q13: '13. Is the informed consent procedure/form adequate and culturally appropriate?',
  q14: '14. Are data collection and monitoring procedures appropriate?',
  q15: '15. Are provisions for data safety and security adequate?',
  q16: '16. Are provisions for handling adverse events adequate?',
  q17: '17. Are provisions for insurance/compensation adequate?',
  q18: '18. Overall assessment of protocol suitability?',
};

export async function generateForm0011PDF(submission: any, reviews: any[]) {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([612, 792]);
  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const margin = 50;
  let y = height - margin;

  // Title
  page.drawText('FORM 0011 - PROTOCOL REVIEWER WORKSHEET', {
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
    `Classification: ${submission.classification_type}`,
  ];

  info.forEach(line => {
    page.drawText(line, { x: margin, y, size: 10, font });
    y -= 20;
  });

  y -= 20;
  page.drawText('REVIEWER ASSESSMENTS:', {
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

    // Protocol answers with questions
    const protocolAnswers = review.protocol_answers || {};
    Object.entries(protocolAnswers).forEach(([key, value]) => {
      const question = protocolQuestions[key];
      if (question) {
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
    page.drawText(`Recommendation: ${sanitizeForPDF(review.protocol_recommendation || '')}`, {
      x: margin + 20,
      y,
      size: 10,
      font: boldFont
    });
    y -= 20;

    page.drawText(`Ethics Assessment: ${sanitizeForPDF(review.protocol_ethics_recommendation || '')}`, {
      x: margin + 20,
      y,
      size: 10,
      font: boldFont
    });
    y -= 20;

    // Comments section
    if (review.protocol_technical_suggestions) {
      page.drawText(`Comments: ${sanitizeForPDF(review.protocol_technical_suggestions)}`, {
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
