// src/app/actions/generateConsolidatedPdf.ts
'use server';

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function generateConsolidatedPdf(
  submissionData: any,
  uploadedFiles: { step5?: string; step6?: string; step7?: string }
) {
  try {
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

    page.drawText('UMREC Form No. 0013-1', {
      x: 245,
      y: yPos,
      size: 10,
      font: helvetica,
    });

    yPos -= 25;

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

    // ALL FIELDS
    addField('Title of Study', step1.title);
    addField('Study Site Type', step2.studySiteType);
    addField('Study Site', step2.studySite);
    addField('Principal Investigator', 
      `${step1.projectLeaderFirstName || ''} ${step1.projectLeaderMiddleName || ''} ${step1.projectLeaderLastName || ''}`.trim()
    );
    addField('Email', step1.projectLeaderEmail);
    addField('Contact', step1.projectLeaderContact);
    
    if (step1.coAuthors) addField('Co-Authors', step1.coAuthors);
    if (step2.coResearcher) addField('Co-Researcher', step2.coResearcher);
    
    addField('Organization', step1.organization);
    addField('College', step2.college);
    addField('Institution', step2.institution);
    
    if (step2.institutionAddress) {
      addField('Institution Address', step2.institutionAddress);
    }
    
    // Type of Study
    const formatTypeOfStudy = () => {
      const types = step2.typeOfStudy || [];
      if (Array.isArray(types) && types.length > 0) {
        return types.join(', ');
      }
      return 'N/A';
    };
    
    addField('Type of Study', formatTypeOfStudy());
    
    if (step2.typeOfStudyOthers) {
      addField('Type of Study (Others)', step2.typeOfStudyOthers);
    }
    
    // Source of Funding
    const formatFunding = () => {
      const funding = step2.sourceOfFunding || [];
      if (Array.isArray(funding) && funding.length > 0) {
        return funding.join(', ');
      }
      return 'N/A';
    };
    
    addField('Source of Funding', formatFunding());
    
    if (step2.fundingOthers) {
      addField('Funding Source (Others)', step2.fundingOthers);
    }
    
    if (step2.pharmaceuticalSponsor) {
      addField('Pharmaceutical Sponsor', step2.pharmaceuticalSponsor);
    }
    
    // Study Duration
    addField('Duration', `${step2.startDate || 'N/A'} to ${step2.endDate || 'N/A'}`);
    
    // Number of Participants
    addField('Number of Participants', step2.numParticipants?.toString() || 'N/A');
    
    // Technical Review
    if (step2.technicalReview) {
      addField('Technical Review', step2.technicalReview);
    }
    
    // Submitted to Other UMREC
    if (step2.submittedToOther) {
      addField('Submitted to Other UMREC', step2.submittedToOther);
    }

    // Researcher Contact Information
    if (step2.telNo || step2.mobileNo || step2.email) {
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
      
      if (step2.telNo) addField('Telephone', step2.telNo);
      if (step2.mobileNo) addField('Mobile', step2.mobileNo);
      if (step2.email) addField('Email', step2.email);
      if (step2.faxNo && step2.faxNo !== 'N/A') {
        addField('Fax', step2.faxNo);
      }
    }

    // ============= PAGE 2+: RESEARCH PROTOCOL =============
    
    const step3 = submissionData.step3?.formData || {};
    
    if (step3.title || step3.introduction || step3.background) {
      page = consolidatedDoc.addPage([612, 792]);
      yPos = 740;

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

      // Researchers list
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

      // Adult consent (English)
      if (step4.purposeEnglish) {
        addConsentSection('PURPOSE OF THE STUDY', step4.purposeEnglish);
        addConsentSection('RISKS AND INCONVENIENCES', step4.risksEnglish);
        addConsentSection('BENEFITS', step4.benefitsEnglish);
        addConsentSection('PROCEDURES', step4.proceduresEnglish);
        addConsentSection('VOLUNTARINESS', step4.voluntarinessEnglish);
        addConsentSection('CONFIDENTIALITY', step4.confidentialityEnglish);
      }

      // Adult consent (Tagalog)
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

      // Minor assent
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

  } catch (error) {
    console.error('PDF generation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate PDF',
    };
  }
}
