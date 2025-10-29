'use server';

import { createClient } from '@/utils/supabase/server';
import {
  generateApplicationFormPdf,
  generateResearchProtocolPdf,
  generateConsentFormPdf
} from '@/app/actions/generatePdfFromDatabase';

export async function repairMissingPdfs() {
  const supabase = await createClient();

  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Get all submissions
    const { data: submissions, error: submissionsError } = await supabase
      .from('research_submissions')
      .select('id, submission_id, user_id, title');

    if (submissionsError) {
      return { success: false, error: 'Failed to fetch submissions' };
    }

    console.log(`\n📋 Found ${submissions.length} total submissions to check\n`);

    let repaired = 0;
    let skipped = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const submission of submissions) {
      try {
        console.log(`🔍 Checking ${submission.submission_id}...`);

        // Check existing documents
        const { data: existingDocs } = await supabase
          .from('uploaded_documents')
          .select('document_type')
          .eq('submission_id', submission.id);

        const existingTypes = new Set(existingDocs?.map(d => d.document_type) || []);

        const missing = {
          application_form: !existingTypes.has('application_form'),
          research_protocol: !existingTypes.has('research_protocol'),
          consent_form: !existingTypes.has('consent_form')
        };

        // Skip if all exist
        if (!missing.application_form && !missing.research_protocol && !missing.consent_form) {
          console.log(`✅ All PDFs exist for ${submission.submission_id}`);
          skipped++;
          continue;
        }

        console.log(`⚠️  Missing:`, Object.keys(missing).filter(k => missing[k as keyof typeof missing]));

        // Fetch data for PDF generation
        const { data: appForm } = await supabase
          .from('application_forms')
          .select('*')
          .eq('submission_id', submission.id)
          .single();

        const { data: protocol } = await supabase
          .from('research_protocols')
          .select('*')
          .eq('submission_id', submission.id)
          .single();

        const { data: consent } = await supabase
          .from('consent_forms')
          .select('*')
          .eq('submission_id', submission.id)
          .single();

        // Build formData structure
        const formData = {
          step1: {
            title: submission.title,
            projectLeaderFirstName: appForm?.researcher_first_name || '',
            projectLeaderMiddleName: appForm?.researcher_middle_name || '',
            projectLeaderLastName: appForm?.researcher_last_name || '',
            projectLeaderEmail: appForm?.contact_info?.email || '',
            projectLeaderContact: appForm?.contact_info?.mobileNo || '',
            coAuthors: appForm?.co_researcher?.map((r: any) => r.fullName).join(', ') || '',
            organization: appForm?.institution || ''
          },
          step2: appForm,
          step3: protocol ? {
            formData: {
              title: protocol.title,
              introduction: protocol.introduction,
              background: protocol.background,
              problemStatement: protocol.problem_statement,
              scopeDelimitation: protocol.scope_delimitation,
              literatureReview: protocol.literature_review,
              methodology: protocol.methodology,
              population: protocol.population,
              samplingTechnique: protocol.sampling_technique,
              researchInstrument: protocol.research_instrument,
              statisticalTreatment: protocol.statistical_treatment,
              ethicalConsideration: protocol.ethical_consideration,
              references: protocol.research_references
            },
            researchers: protocol.researchers
          } : null,
          step4: consent ? {
            consentType: consent.consent_type,
            informedConsentFor: consent.informed_consent_for,
            formData: {
              participantGroupIdentity: consent.informed_consent_for,
              ...consent.adult_consent,
              ...consent.minor_assent,
              contactPerson: consent.contact_person,
              contactNumber: consent.contact_number
            }
          } : null
        };

        // Helper to upload PDF
        const uploadPdf = async (pdfResult: any, docType: string, fileName: string) => {
          if (!pdfResult.success || !pdfResult.pdfData) {
            console.warn(`❌ Failed to generate ${docType}`);
            return false;
          }

          const base64Data = pdfResult.pdfData.split(',')[1];
          const pdfBuffer = Buffer.from(base64Data, 'base64');
          const pdfPath = `${submission.user_id}/${docType}-${submission.id}-${Date.now()}.pdf`;

          const { error: uploadError } = await supabase.storage
            .from('research-documents')
            .upload(pdfPath, pdfBuffer, {
              contentType: 'application/pdf',
              upsert: false
            });

          if (uploadError) {
            console.error(`❌ Upload failed for ${docType}:`, uploadError.message);
            return false;
          }

          const { error: insertError } = await supabase
            .from('uploaded_documents')
            .insert({
              submission_id: submission.id,
              document_type: docType,
              file_name: `${fileName}_${submission.submission_id}.pdf`,
              file_size: pdfBuffer.length,
              file_url: pdfPath,
            });

          if (insertError) {
            console.error(`❌ DB save failed for ${docType}:`, insertError.message);
            return false;
          }

          console.log(`✅ Generated ${docType}`);
          return true;
        };

        let generatedCount = 0;

        // Generate missing PDFs
        if (missing.application_form && appForm) {
          const pdf = await generateApplicationFormPdf(formData);
          if (await uploadPdf(pdf, 'application_form', 'Application_For_Ethics_Review')) {
            generatedCount++;
          }
        }

        if (missing.research_protocol && protocol) {
          const pdf = await generateResearchProtocolPdf(formData);
          if (await uploadPdf(pdf, 'research_protocol', 'Research_Protocol')) {
            generatedCount++;
          }
        }

        if (missing.consent_form && consent) {
          const pdf = await generateConsentFormPdf(formData);
          if (await uploadPdf(pdf, 'consent_form', 'Informed_Consent_Form')) {
            generatedCount++;
          }
        }

        if (generatedCount > 0) {
          console.log(`✅ Repaired ${generatedCount} PDFs for ${submission.submission_id}\n`);
          repaired++;
        } else {
          console.log(`⚠️  Could not repair ${submission.submission_id}\n`);
          errors.push(`${submission.submission_id}: No PDFs generated`);
          failed++;
        }

      } catch (error) {
        console.error(`❌ Error processing ${submission.submission_id}:`, error);
        errors.push(`${submission.submission_id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        failed++;
      }
    }

    return {
      success: true,
      message: `Repair complete: ${repaired} submissions repaired, ${skipped} skipped, ${failed} failed`,
      repaired,
      skipped,
      failed,
      total: submissions.length,
      errors: errors.length > 0 ? errors : undefined
    };

  } catch (error) {
    console.error('Repair script error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to repair PDFs'
    };
  }
}
