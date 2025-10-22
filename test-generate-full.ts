// test-generate-clean.ts
// Simplified version matching the original UMREC template structure

import { Document, Packer, Paragraph, Table, TableRow, TableCell, 
         WidthType, AlignmentType, ImageRun, BorderStyle, TextRun, VerticalAlign } from "docx";
import * as fs from "fs";

interface UMRECApplicationData {
  formNumber: string;
  versionNumber: string;
  effectivityDate: string;
  studyTitle: string;
  umrecCode: string;
  studySite: string;
  typeOfReview: string;
  leadResearcher: { name: string; contact: string; email: string };
  members: Array<{ name: string; contact: string; email: string }>;
  advisers: Array<{ name: string; contact: string; email: string }>;
  college: string;
  institution: string;
  institutionAddress: string;
  typeOfStudy: string[];
  siteType: string[];
  fundingSource: string[];
  fundingOther?: string;
  startDate: string;
  endDate: string;
  numParticipants: string;
  hasTechnicalReview: boolean;
  submittedToOtherUMREC: boolean;
  hasApplicationForm: boolean;
  hasResearchProtocol: boolean;
  hasInformedConsent: boolean;
  informedConsentLanguages: string[];
  hasAssentForm: boolean;
  assentFormLanguages: string[];
  hasEndorsementLetter: boolean;
  hasQuestionnaire: boolean;
  hasTechnicalReviewProof: boolean;
  hasDataCollectionForms: boolean;
  hasProductBrochure: boolean;
  hasFDAAuthorization: boolean;
  hasCompanyPermit: boolean;
  hasSpecialPopulationPermit: boolean;
  specialPopulationPermitDetails?: string;
  checklistOther?: string;
  researcherName: string;
  dateSubmitted: string;
  introduction: string;
  background: string;
  problemStatement: string;
  scopeDelimitation: string;
  literatureReview: string;
  methodology: string;
  population: string;
  samplingTechnique: string;
  researchInstrument: string;
  ethicalConsideration: string;
  statisticalTreatment: string;
  references: string;
}

const checkbox = (checked: boolean) => checked ? "☑" : "☐";

const boldText = (text: string) => new Paragraph({
  children: [new TextRun({ text, bold: true })]
});

const italicText = (text: string) => new Paragraph({
  children: [new TextRun({ text, italics: true })],
  spacing: { before: 0, after: 0 }
});

// Helper to create a simple label row (full width)
const createLabelRow = (label: string) => {
  return new TableRow({
    children: [
      new TableCell({
        children: [boldText(label)],
        width: { size: 100, type: WidthType.PERCENTAGE }
      })
    ]
  });
};

// Helper to create a data row (full width)
const createDataRow = (content: string) => {
  return new TableRow({
    children: [
      new TableCell({
        children: [new Paragraph(content)],
        width: { size: 100, type: WidthType.PERCENTAGE }
      })
    ]
  });
};

// Helper to create a two-column row
const createTwoColumnRow = (label1: string, content1: string, label2: string, content2: string) => {
  return [
    new TableRow({
      children: [
        new TableCell({
          children: [boldText(label1), italicText(content1)],
          width: { size: 50, type: WidthType.PERCENTAGE }
        }),
        new TableCell({
          children: [boldText(label2)],
          width: { size: 50, type: WidthType.PERCENTAGE }
        })
      ]
    }),
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph("")],
          width: { size: 50, type: WidthType.PERCENTAGE }
        }),
        new TableCell({
          children: [new Paragraph("")],
          width: { size: 50, type: WidthType.PERCENTAGE }
        })
      ]
    })
  ];
};

const createSectionRow = (sectionTitle: string, sectionContent: string) => {
  return [
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({ text: sectionTitle })],
          shading: { fill: "F2F2F2" }
        })
      ]
    }),
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({ text: sectionContent })]
        })
      ]
    })
  ];
};

async function generateCleanUMRECDocument(data: UMRECApplicationData, logoPath?: string) {
  console.log("Starting document generation with clean structure...");

  let logoImage;
  if (logoPath && fs.existsSync(logoPath)) {
    logoImage = fs.readFileSync(logoPath);
  }

  const doc = new Document({
    sections: [
      // ========== APPLICATION FORM ==========
      {
        children: [
          // Header Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1 },
              bottom: { style: BorderStyle.SINGLE, size: 1 },
              left: { style: BorderStyle.SINGLE, size: 1 },
              right: { style: BorderStyle.SINGLE, size: 1 }
            },
            rows: [
              // Row 1: Logo + Title
              new TableRow({
                children: [
                  new TableCell({
                    children: logoImage 
                      ? [new Paragraph({
                          children: [
                            new ImageRun({
                              type: "png",
                              data: logoImage,
                              transformation: { width: 73, height: 73 }
                            })
                          ],
                          alignment: AlignmentType.CENTER
                        })]
                      : [new Paragraph("Logo")],
                    width: { size: 20, type: WidthType.PERCENTAGE },
                    verticalAlign: VerticalAlign.CENTER,
                    rowSpan: 2
                  }),
                  new TableCell({
                    children: [new Paragraph({ 
                      children: [new TextRun({ text: "UNIVERSITY OF MAKATI RESEARCH ETHICS COMMITTEE", bold: true })],
                      alignment: AlignmentType.CENTER
                    })],
                    width: { size: 80, type: WidthType.PERCENTAGE }
                  })
                ]
              }),
              // Row 2: Form title
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ 
                      children: [new TextRun({ text: "APPLICATION FORM FOR ETHICS REVIEW", bold: true })],
                      alignment: AlignmentType.CENTER
                    })],
                    width: { size: 80, type: WidthType.PERCENTAGE }
                  })
                ]
              }),
              // Row 3: Empty + UMREC Form No
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("")] }),
                  new TableCell({
                    children: [
                      new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        borders: {
                          top: { style: BorderStyle.NONE },
                          bottom: { style: BorderStyle.NONE },
                          left: { style: BorderStyle.NONE },
                          right: { style: BorderStyle.NONE },
                          insideHorizontal: { style: BorderStyle.NONE },
                          insideVertical: { style: BorderStyle.NONE }
                        },
                        rows: [
                          new TableRow({
                            children: [
                              new TableCell({
                                children: [new Paragraph("UMREC Form No.")],
                                width: { size: 60, type: WidthType.PERCENTAGE },
                                borders: {
                                  top: { style: BorderStyle.NONE },
                                  bottom: { style: BorderStyle.NONE },
                                  left: { style: BorderStyle.NONE },
                                  right: { style: BorderStyle.NONE }
                                }
                              }),
                              new TableCell({
                                children: [boldText(data.formNumber)],
                                width: { size: 40, type: WidthType.PERCENTAGE },
                                borders: {
                                  top: { style: BorderStyle.NONE },
                                  bottom: { style: BorderStyle.NONE },
                                  left: { style: BorderStyle.NONE },
                                  right: { style: BorderStyle.NONE }
                                }
                              })
                            ]
                          })
                        ]
                      })
                    ]
                  })
                ]
              }),
              // Row 4: Empty + Version No
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("")] }),
                  new TableCell({
                    children: [
                      new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        borders: {
                          top: { style: BorderStyle.NONE },
                          bottom: { style: BorderStyle.NONE },
                          left: { style: BorderStyle.NONE },
                          right: { style: BorderStyle.NONE },
                          insideHorizontal: { style: BorderStyle.NONE },
                          insideVertical: { style: BorderStyle.NONE }
                        },
                        rows: [
                          new TableRow({
                            children: [
                              new TableCell({
                                children: [new Paragraph("Version No.")],
                                width: { size: 60, type: WidthType.PERCENTAGE },
                                borders: {
                                  top: { style: BorderStyle.NONE },
                                  bottom: { style: BorderStyle.NONE },
                                  left: { style: BorderStyle.NONE },
                                  right: { style: BorderStyle.NONE }
                                }
                              }),
                              new TableCell({
                                children: [new Paragraph(data.versionNumber)],
                                width: { size: 40, type: WidthType.PERCENTAGE },
                                borders: {
                                  top: { style: BorderStyle.NONE },
                                  bottom: { style: BorderStyle.NONE },
                                  left: { style: BorderStyle.NONE },
                                  right: { style: BorderStyle.NONE }
                                }
                              })
                            ]
                          })
                        ]
                      })
                    ]
                  })
                ]
              }),
              // Row 5: Empty + Date of Effectivity
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("")] }),
                  new TableCell({
                    children: [
                      new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        borders: {
                          top: { style: BorderStyle.NONE },
                          bottom: { style: BorderStyle.NONE },
                          left: { style: BorderStyle.NONE },
                          right: { style: BorderStyle.NONE },
                          insideHorizontal: { style: BorderStyle.NONE },
                          insideVertical: { style: BorderStyle.NONE }
                        },
                        rows: [
                          new TableRow({
                            children: [
                              new TableCell({
                                children: [new Paragraph("Date of Effectivity")],
                                width: { size: 60, type: WidthType.PERCENTAGE },
                                borders: {
                                  top: { style: BorderStyle.NONE },
                                  bottom: { style: BorderStyle.NONE },
                                  left: { style: BorderStyle.NONE },
                                  right: { style: BorderStyle.NONE }
                                }
                              }),
                              new TableCell({
                                children: [boldText(data.effectivityDate)],
                                width: { size: 40, type: WidthType.PERCENTAGE },
                                borders: {
                                  top: { style: BorderStyle.NONE },
                                  bottom: { style: BorderStyle.NONE },
                                  left: { style: BorderStyle.NONE },
                                  right: { style: BorderStyle.NONE }
                                }
                              })
                            ]
                          })
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
          }),

          new Paragraph(""),
          boldText("Instructions to the Researcher:"),
          new Paragraph("Please complete this form and ensure that you have included in your submission the documents that you checked in Section 3-Checklist of Documents."),
          new Paragraph(""),

          // Main Content Table - SIMPLIFIED STRUCTURE
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1 },
              bottom: { style: BorderStyle.SINGLE, size: 1 },
              left: { style: BorderStyle.SINGLE, size: 1 },
              right: { style: BorderStyle.SINGLE, size: 1 }
            },
            rows: [
              // General Information header
              createLabelRow("General Information"),
              
              // Title of Study
              createLabelRow("Title of Study"),
              createDataRow(data.studyTitle),
              
              // UMREC Code + Study Site (side by side)
              ...createTwoColumnRow("UMREC Code", "(To be provided by UMREC)", "Study Site", ""),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph(data.umrecCode)],
                    width: { size: 50, type: WidthType.PERCENTAGE }
                  }),
                  new TableCell({
                    children: [new Paragraph(data.studySite)],
                    width: { size: 50, type: WidthType.PERCENTAGE }
                  })
                ]
              }),
              
              // Type of Review
              createLabelRow("Type of Review"),
              createDataRow(data.typeOfReview),
              
              // Researchers table (3 columns)
              new TableRow({
                children: [
                  new TableCell({
                    children: [boldText("Name of Researchers"), italicText("(First name Middle name/initial, Last name)")],
                    width: { size: 40, type: WidthType.PERCENTAGE }
                  }),
                  new TableCell({
                    children: [boldText("Contact Number")],
                    width: { size: 30, type: WidthType.PERCENTAGE }
                  }),
                  new TableCell({
                    children: [boldText("Email Address")],
                    width: { size: 30, type: WidthType.PERCENTAGE }
                  })
                ]
              }),
              // Lead researcher
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph(data.leadResearcher.name)] }),
                  new TableCell({ children: [new Paragraph(data.leadResearcher.contact)] }),
                  new TableCell({ children: [new Paragraph(data.leadResearcher.email)] })
                ]
              }),
              // Members label
              new TableRow({
                children: [
                  new TableCell({
                    children: [italicText("Members:")],
                    columnSpan: 3
                  })
                ]
              }),
              // Member rows
              ...data.members.map(member => new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph(member.name)] }),
                  new TableCell({ children: [new Paragraph(member.contact)] }),
                  new TableCell({ children: [new Paragraph(member.email)] })
                ]
              })),
              // Advisers label
              new TableRow({
                children: [
                  new TableCell({
                    children: [italicText("Technical/Content Adviser/s:")],
                    columnSpan: 3
                  })
                ]
              }),
              // Adviser rows
              ...data.advisers.map(adviser => new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph(adviser.name)] }),
                  new TableCell({ children: [new Paragraph(adviser.contact)] }),
                  new TableCell({ children: [new Paragraph(adviser.email)] })
                ]
              })),
              
              // College/Department
              createLabelRow("College/Department"),
              createDataRow(data.college),
              
              // Institution
              createLabelRow("Institution"),
              createDataRow(data.institution),
              
              // Address of Institution
              createLabelRow("Address of Institution"),
              createDataRow(data.institutionAddress),
              
              // Type of Study
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      boldText("Type of Study"),
                      ...data.typeOfStudy.map(type => new Paragraph(`${checkbox(true)} ${type}`))
                    ]
                  })
                ]
              }),
              
              // Site type checkboxes
              new TableRow({
                children: [
                  new TableCell({
                    children: data.siteType.map(site => new Paragraph(`${checkbox(true)} ${site}`))
                  })
                ]
              }),
              
              // Source of Funding
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      boldText("Source of Funding"),
                      ...data.fundingSource.map(source => new Paragraph(`${checkbox(true)} ${source}`)),
                      ...(data.fundingOther ? [new Paragraph(data.fundingOther)] : [])
                    ]
                  })
                ]
              }),
              
              // Duration + Participants
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      boldText("Duration of the study"),
                      new Paragraph(`Start date: ${data.startDate}`),
                      new Paragraph(`End date: ${data.endDate}`)
                    ],
                    width: { size: 50, type: WidthType.PERCENTAGE }
                  }),
                  new TableCell({
                    children: [
                      new Paragraph("No. of study participants"),
                      new Paragraph(data.numParticipants)
                    ],
                    width: { size: 50, type: WidthType.PERCENTAGE }
                  })
                ]
              }),
              
              // Technical Review question
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph("*Has the Research undergone a Technical Review/pre-oral defense?"),
                      new Paragraph(`${checkbox(data.hasTechnicalReview)} Yes    ${checkbox(!data.hasTechnicalReview)} No`)
                    ]
                  })
                ]
              }),
              
              // Submitted to another UMREC
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph("*Has the Research been submitted to another UMREC?"),
                      new Paragraph(`${checkbox(data.submittedToOtherUMREC)} Yes    ${checkbox(!data.submittedToOtherUMREC)} No`)
                    ]
                  })
                ]
              }),
              
              // CHECKLIST header
              new TableRow({
                children: [
                  new TableCell({
                    children: [boldText("Checklist of Documents")],
                    shading: { fill: "D9D9D9" }
                  })
                ]
              }),
              
              // Checklist - two columns
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      boldText("Basic requirements:"),
                      new Paragraph(`${checkbox(data.hasApplicationForm)} Application for Ethics Review of A New Protocol`),
                      new Paragraph(`${checkbox(data.hasResearchProtocol)} Research Protocol`),
                      new Paragraph(`${checkbox(data.hasInformedConsent)} Informed Consent Form`),
                      ...data.informedConsentLanguages.map(lang => new Paragraph(`     ${checkbox(true)} ${lang} version`)),
                      new Paragraph(`${checkbox(data.hasAssentForm)} Assent Form (if applicable)`),
                      ...data.assentFormLanguages.map(lang => new Paragraph(`     ${checkbox(true)} ${lang} version`)),
                      new Paragraph(`${checkbox(data.hasEndorsementLetter)} Endorsement Letter from Research Adviser`),
                      new Paragraph(`${checkbox(data.hasQuestionnaire)} Questionnaire`)
                    ],
                    width: { size: 50, type: WidthType.PERCENTAGE }
                  }),
                  new TableCell({
                    children: [
                      boldText("Supplementary Documents:"),
                      new Paragraph(`${checkbox(data.hasTechnicalReviewProof)} Technical review/pre-oral defense (Any documentary proof)`),
                      new Paragraph(`${checkbox(data.hasDataCollectionForms)} Data Collection Forms (if applicable)`),
                      new Paragraph(`${checkbox(data.hasProductBrochure)} Product Brochure (if applicable)`),
                      new Paragraph(`${checkbox(data.hasFDAAuthorization)} Philippine FDA Marketing Authorization or Import License (if applicable)`),
                      new Paragraph(`${checkbox(data.hasCompanyPermit)} Permit/s for the use of company name`),
                      new Paragraph(`${checkbox(data.hasSpecialPopulationPermit)} Permit/s for special populations (please specify)`),
                      ...(data.specialPopulationPermitDetails ? [new Paragraph(data.specialPopulationPermitDetails)] : []),
                      new Paragraph(`${checkbox(!!data.checklistOther)} Others (please specify)`),
                      ...(data.checklistOther ? [new Paragraph(data.checklistOther)] : [])
                    ],
                    width: { size: 50, type: WidthType.PERCENTAGE }
                  })
                ]
              }),
              
              // Signature
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph("Accomplished by:"),
                      new Paragraph(""),
                      new Paragraph("_______________________________________"),
                      new Paragraph("Signature over printed name"),
                      new Paragraph(""),
                      new Paragraph(`Date submitted: ${data.dateSubmitted}`)
                    ]
                  })
                ]
              }),
              
              // UMREC Secretariat section
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({
                      text: "----------------------   To be filled by the UMREC Secretariat ----------------------",
                      alignment: AlignmentType.CENTER
                    })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        borders: {
                          top: { style: BorderStyle.NONE },
                          bottom: { style: BorderStyle.NONE },
                          left: { style: BorderStyle.NONE },
                          right: { style: BorderStyle.NONE },
                          insideHorizontal: { style: BorderStyle.NONE },
                          insideVertical: { style: BorderStyle.SINGLE, size: 1 }
                        },
                        rows: [
                          new TableRow({
                            children: [
                              new TableCell({
                                children: [new Paragraph("Completeness of Document")],
                                width: { size: 40, type: WidthType.PERCENTAGE },
                                borders: {
                                  top: { style: BorderStyle.NONE },
                                  bottom: { style: BorderStyle.NONE },
                                  left: { style: BorderStyle.NONE },
                                  right: { style: BorderStyle.SINGLE, size: 1 }
                                }
                              }),
                              new TableCell({
                                children: [
                                  new Paragraph("☐ Complete"),
                                  new Paragraph("☐ Incomplete")
                                ],
                                width: { size: 30, type: WidthType.PERCENTAGE },
                                borders: {
                                  top: { style: BorderStyle.NONE },
                                  bottom: { style: BorderStyle.NONE },
                                  left: { style: BorderStyle.NONE },
                                  right: { style: BorderStyle.SINGLE, size: 1 }
                                }
                              }),
                              new TableCell({
                                children: [new Paragraph("(place stamp here)")],
                                width: { size: 30, type: WidthType.PERCENTAGE },
                                borders: {
                                  top: { style: BorderStyle.NONE },
                                  bottom: { style: BorderStyle.NONE },
                                  left: { style: BorderStyle.NONE },
                                  right: { style: BorderStyle.NONE }
                                }
                              })
                            ]
                          })
                        ]
                      })
                    ]
                  })
                ]
              }),
              createLabelRow("Remarks"),
              createDataRow(""),
              createLabelRow("Date Received"),
              createDataRow(""),
              createLabelRow("Received by"),
              createDataRow("")
            ]
          })
        ]
      },
      
      // ========== RESEARCH PROTOCOL ==========
      {
        children: [
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: logoImage 
                      ? [new Paragraph({
                          children: [
                            new ImageRun({
                              type: "png",
                              data: logoImage,
                              transformation: { width: 73, height: 73 }
                            })
                          ],
                          alignment: AlignmentType.CENTER
                        })]
                      : [new Paragraph("Logo")],
                    width: { size: 20, type: WidthType.PERCENTAGE },
                    rowSpan: 5,
                    verticalAlign: VerticalAlign.CENTER
                  }),
                  new TableCell({
                    children: [new Paragraph({ 
                      text: "UNIVERSITY OF MAKATI RESEARCH ETHICS COMMITTEE",
                      alignment: AlignmentType.CENTER
                    })],
                    columnSpan: 2
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ text: "RESEARCH PROTOCOL", alignment: AlignmentType.CENTER })],
                    columnSpan: 2
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("UMREC Form No.")] }),
                  new TableCell({ children: [new Paragraph({ text: "0033" })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Version No.")] }),
                  new TableCell({ children: [new Paragraph("3")] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Date of Effectivity")] }),
                  new TableCell({ children: [new Paragraph("October 1, 2025")] })
                ]
              })
            ]
          }),

          new Paragraph(""),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              ...createSectionRow(
                "I. Title of the Study\nIndicate the complete title of the research.",
                data.studyTitle
              ),
              ...createSectionRow(
                "II. Introduction\nProvide the introduction of the study, which includes an overview of the study.",
                data.introduction
              ),
              ...createSectionRow(
                "III. Background of the Study\nInclude the reason for embarking on the study, the historical background of the study, and the research gap.",
                data.background
              ),
              ...createSectionRow(
                "IV. Statement of the Problem/Objectives of the Study\nInclude the general and specific research problems/objectives of the study.",
                data.problemStatement
              ),
              ...createSectionRow(
                "V. Scope and Delimitation\nProvide the locale, topic, and respondent inclusions and the exclusions.",
                data.scopeDelimitation
              ),
              ...createSectionRow(
                "VI. Related Literature & Studies\nWrite the related literature and studies that support the objectives/problem.",
                data.literatureReview
              ),
              ...createSectionRow(
                "VII. Research Methodology\nIndicate the research design of the study.",
                data.methodology
              ),
              ...createSectionRow(
                "VIII. Population, Respondents, and Sample Size for Quantitative Research\nInclude the population of the study and indicate the number of respondents.\nParticipants for Qualitative Research\nIndicate the number of participants.",
                data.population
              ),
              ...createSectionRow(
                "IX. Sampling Technique for Quantitative Research\nPresent the sampling technique for quantitative.\nCriteria of Participants for Qualitative Research\nWrite the criteria for choosing participants.",
                data.samplingTechnique
              ),
              ...createSectionRow(
                "X. Research Instrument and Validation for Quantitative Research\nDescribe the details of the questionnaire or Interview/FGD Questions.\nInterview/FGD Questions for Qualitative Research\nDescribe the details of the questionnaire.",
                data.researchInstrument
              ),
              ...createSectionRow(
                "XI. Ethical Consideration\nExplain the risks, benefits, mitigation of risks, inconveniences, vulnerability, data protection plan, and confidentiality of the study.",
                data.ethicalConsideration
              ),
              ...createSectionRow(
                "XII. Statistical Treatment of Data for Quantitative Research\nIndicate the statistical tool of the study.\nData Analysis for Qualitative Research\nIndicate how the study will be analyzed.",
                data.statisticalTreatment
              ),
              ...createSectionRow(
                "XIII. References (Main Themes Only)\nIndicate the main references of the study.",
                data.references
              ),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph("Accomplished by:"),
                      new Paragraph(""),
                      new Paragraph("______________________________     ___________________________"),
                      new Paragraph("Signature over printed name                    Date")
                    ]
                  })
                ]
              })
            ]
          })
        ]
      }
    ]
  });

  console.log("Generating document buffer...");
  const buffer = await Packer.toBuffer(doc);
  
  console.log("Writing to file...");
  fs.writeFileSync("Complete-UMREC-Clean.docx", buffer);
  
  console.log("✅ Clean document generated: Complete-UMREC-Clean.docx");
}

// SAMPLE DATA
const sampleData: UMRECApplicationData = {
  formNumber: "0013-1",
  versionNumber: "4",
  effectivityDate: "Dec 19, 2024",
  studyTitle: "Sample Research: Impact of AI on Education in Metro Manila",
  umrecCode: "UMREC-2025-001",
  studySite: "University of Makati",
  typeOfReview: "Full Board Review",
  leadResearcher: {
    name: "Juan Dela Cruz",
    contact: "09123456789",
    email: "juan.delacruz@umak.edu.ph"
  },
  members: [
    { name: "Maria Santos", contact: "09187654321", email: "maria.santos@umak.edu.ph" }
  ],
  advisers: [
    { name: "Dr. Ana Garcia", contact: "09123456780", email: "ana.garcia@umak.edu.ph" }
  ],
  college: "College of Science",
  institution: "University of Makati",
  institutionAddress: "J.P. Rizal Ext., West Rembo, Makati City",
  typeOfStudy: ["☑ Social / Behavioral Research"],
  siteType: ["☑ Single Site"],
  fundingSource: ["Self-funded"],
  startDate: "January 2025",
  endDate: "December 2025",
  numParticipants: "500",
  hasTechnicalReview: true,
  submittedToOtherUMREC: false,
  hasApplicationForm: true,
  hasResearchProtocol: true,
  hasInformedConsent: true,
  informedConsentLanguages: ["English", "Filipino"],
  hasAssentForm: false,
  assentFormLanguages: [],
  hasEndorsementLetter: true,
  hasQuestionnaire: true,
  hasTechnicalReviewProof: true,
  hasDataCollectionForms: true,
  hasProductBrochure: false,
  hasFDAAuthorization: false,
  hasCompanyPermit: false,
  hasSpecialPopulationPermit: false,
  researcherName: "Juan Dela Cruz",
  dateSubmitted: "October 21, 2025",
  introduction: "This study explores the integration of artificial intelligence in modern educational systems...",
  background: "With the rapid advancement of technology, AI has become increasingly prevalent in various sectors...",
  problemStatement: "This study aims to answer: How does AI integration affect student learning outcomes?",
  scopeDelimitation: "This study covers undergraduate students in Metro Manila from 2024-2025...",
  literatureReview: "Previous studies have shown that AI-powered learning systems improve engagement...",
  methodology: "This research employs a mixed-methods approach combining quantitative surveys...",
  population: "The population consists of 500 undergraduate students from University of Makati...",
  samplingTechnique: "Stratified random sampling will be used to ensure representation...",
  researchInstrument: "A validated questionnaire with Likert scale questions will be used...",
  ethicalConsideration: "Informed consent will be obtained. Data will be anonymized and stored securely...",
  statisticalTreatment: "Descriptive statistics, correlation analysis, and regression will be employed...",
  references: "Smith, J. (2023). AI in Education. Journal of Educational Technology..."
};

generateCleanUMRECDocument(sampleData).catch(console.error);
