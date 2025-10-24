// utils/pdf/generateCertificate.ts
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function generateCertificatePDF(submission: any) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]); // Letter size
  const { width, height } = page.getSize();

  // Load fonts
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  const margin = 72; // 1 inch margin
  let y = height - margin;

  // Header
  page.drawText('UNIVERSITY OF MAKATI', {
    x: margin,
    y,
    size: 16,
    font: timesRomanBold,
    color: rgb(0, 0, 0.5)
  });
  y -= 20;

  page.drawText('University Research Ethics Committee (UMREC)', {
    x: margin,
    y,
    size: 14,
    font: timesRomanBold,
    color: rgb(0, 0, 0.5)
  });
  y -= 60;

  // Title
  page.drawText('CERTIFICATE OF APPROVAL', {
    x: width / 2 - 150,
    y,
    size: 20,
    font: timesRomanBold,
    color: rgb(0, 0, 0)
  });
  y -= 60;

  // Body
  const approvalDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const text = [
    `This is to certify that the research proposal entitled:`,
    ``,
    `"${submission.title}"`,
    ``,
    `Submitted by: ${submission.profiles?.full_name || 'N/A'}`,
    `Tracking Number: ${submission.submission_id}`,
    ``,
    `has been reviewed and APPROVED by the University of Makati Research Ethics Committee (UMREC)`,
    `in accordance with ethical standards for research involving human participants.`,
    ``,
    `Date of Approval: ${approvalDate}`,
    `Classification: ${submission.classification_type || 'Full Review'}`,
    ``,
    `This certificate is valid for one (1) year from the date of issue and may be renewed upon request.`,
  ];

  text.forEach(line => {
    page.drawText(line, {
      x: margin,
      y,
      size: 12,
      font: line.startsWith('"') ? timesRomanBold : timesRomanFont,
      color: rgb(0, 0, 0),
      maxWidth: width - 2 * margin
    });
    y -= 20;
  });

  // Footer signature section
  y -= 40;
  page.drawText('_______________________________', {
    x: margin,
    y,
    size: 12,
    font: timesRomanFont
  });
  y -= 20;
  page.drawText('UMREC Chair', {
    x: margin,
    y,
    size: 10,
    font: timesRomanFont
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
