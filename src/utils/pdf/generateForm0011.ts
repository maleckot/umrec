// utils/pdf/generateForm0011.ts
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function generateForm0011PDF(submission: any, reviews: any[]) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]);
  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

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
    `Title: ${submission.title}`,
    `Researcher: ${submission.profiles?.full_name}`,
    `Classification: ${submission.classification_type}`,
  ];

  info.forEach(line => {
    page.drawText(line, {
      x: margin,
      y,
      size: 10,
      font: font
    });
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
    page.drawText(`Reviewer ${index + 1}: ${review.profiles?.full_name || 'Anonymous'}`, {
      x: margin,
      y,
      size: 10,
      font: boldFont
    });
    y -= 20;

    page.drawText(`Recommendation: ${review.protocol_recommendation}`, {
      x: margin + 20,
      y,
      size: 10,
      font: font
    });
    y -= 20;

    page.drawText(`Ethics Assessment: ${review.protocol_ethics_recommendation}`, {
      x: margin + 20,
      y,
      size: 10,
      font: font
    });
    y -= 30;
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
