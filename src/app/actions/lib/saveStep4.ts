// src/app/actions/lib/saveStep4.ts

'use server';

import { createClient } from '@/utils/supabase/server';

export async function saveStep4Data({
  submissionId,
  consentData
}: {
  submissionId: string;
  consentData: {
    consentType: string;
    adultConsent?: File;
    minorAssent?: File;
    contactPerson: string;
    contactNumber: string;
    informedConsentFor: string;
  };
}) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    console.log('📝 Saving Step 4 - Consent Forms...');

    // ✅ Check if consent form already exists
    const { data: existingConsent } = await supabase
      .from('consent_forms')
      .select('*')
      .eq('submission_id', submissionId)
      .single();

    let uploadedFiles: any = {};
    let oldFiles: any = {};

    // ✅ Upload new files if provided
    if (consentData.adultConsent) {
      const buffer = await consentData.adultConsent.arrayBuffer();
      const filePath = `${user.id}/consent-forms/adult-consent-${submissionId}-${Date.now()}.pdf`;

      const { error: uploadError } = await supabase.storage
        .from('research-documents')
        .upload(filePath, buffer, {
          contentType: 'application/pdf',
          upsert: false
        });

      if (!uploadError) {
        uploadedFiles.adultConsentPath = filePath;
        if (existingConsent?.adult_consent?.file_url) {
          oldFiles.adult = existingConsent.adult_consent.file_url;
        }
        console.log(`✅ Adult consent uploaded: ${filePath}`);
      }
    }

    if (consentData.minorAssent) {
      const buffer = await consentData.minorAssent.arrayBuffer();
      const filePath = `${user.id}/consent-forms/minor-assent-${submissionId}-${Date.now()}.pdf`;

      const { error: uploadError } = await supabase.storage
        .from('research-documents')
        .upload(filePath, buffer, {
          contentType: 'application/pdf',
          upsert: false
        });

      if (!uploadError) {
        uploadedFiles.minorAssentPath = filePath;
        if (existingConsent?.minor_assent?.file_url) {
          oldFiles.minor = existingConsent.minor_assent.file_url;
        }
        console.log(`✅ Minor assent uploaded: ${filePath}`);
      }
    }

    // ✅ Prepare consent data
    const updateData = {
      submission_id: submissionId,
      consent_type: consentData.consentType,
      contact_person: consentData.contactPerson,
      contact_number: consentData.contactNumber,
      informed_consent_for: consentData.informedConsentFor,
      adult_consent: uploadedFiles.adultConsentPath
        ? {
            file_name: consentData.adultConsent?.name,
            file_url: uploadedFiles.adultConsentPath,
            uploaded_at: new Date().toISOString(),
            size: consentData.adultConsent?.size
          }
        : existingConsent?.adult_consent,
      minor_assent: uploadedFiles.minorAssentPath
        ? {
            file_name: consentData.minorAssent?.name,
            file_url: uploadedFiles.minorAssentPath,
            uploaded_at: new Date().toISOString(),
            size: consentData.minorAssent?.size
          }
        : existingConsent?.minor_assent
    };

    // ✅ Update or insert consent form
    let consentFormId: string;

    if (existingConsent) {
      const { error: updateError } = await supabase
        .from('consent_forms')
        .update(updateData)
        .eq('submission_id', submissionId);

      if (updateError) throw updateError;
      consentFormId = existingConsent.id;
      console.log('✅ Consent form updated');
    } else {
      const { data: newConsent, error: insertError } = await supabase
        .from('consent_forms')
        .insert(updateData)
        .select('id')
        .single();

      if (insertError) throw insertError;
      consentFormId = newConsent.id;
      console.log('✅ Consent form created');
    }

    // ✅ DELETE old files from storage
    if (Object.keys(oldFiles).length > 0) {
      console.log('🗑️ Deleting old files...');

      for (const [type, filePath] of Object.entries(oldFiles)) {
        try {
          await supabase.storage
            .from('research-documents')
            .remove([filePath as string]);
          console.log(`✅ Deleted old ${type} file: ${filePath}`);
        } catch (err) {
          console.warn(`⚠️ Failed to delete ${type} file:`, err);
        }
      }
    }

    // ✅ Track in uploaded_documents
    const consentDocuments = [];

    if (uploadedFiles.adultConsentPath) {
      consentDocuments.push({
        submission_id: submissionId,
        document_type: 'consent_form_adult',
        file_name: `Adult_Consent_${submissionId}.pdf`,
        file_size: consentData.adultConsent?.size || 0,
        file_url: uploadedFiles.adultConsentPath
      });
    }

    if (uploadedFiles.minorAssentPath) {
      consentDocuments.push({
        submission_id: submissionId,
        document_type: 'consent_form_minor',
        file_name: `Minor_Assent_${submissionId}.pdf`,
        file_size: consentData.minorAssent?.size || 0,
        file_url: uploadedFiles.minorAssentPath
      });
    }

    if (consentDocuments.length > 0) {
      // ✅ Delete old entries
      await supabase
        .from('uploaded_documents')
        .delete()
        .eq('submission_id', submissionId)
        .in('document_type', ['consent_form_adult', 'consent_form_minor']);

      // ✅ Insert new entries
      const { error: insertDocsError } = await supabase
        .from('uploaded_documents')
        .insert(consentDocuments);

      if (!insertDocsError) {
        console.log(`✅ Tracked ${consentDocuments.length} consent documents`);
      }
    }

    // ✅ Update submission status
    await supabase
      .from('research_submissions')
      .update({
        status: 'In Review',
        updated_at: new Date().toISOString()
      })
      .eq('id', submissionId);

    return { success: true, consentFormId };
  } catch (error) {
    console.error('❌ Save error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { success: false, error: errorMessage };
  }
}
