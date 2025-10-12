// app/actions/autoClassifyFromDatabase.ts
'use server';

import { createClient } from '@/utils/supabase/server';

export async function autoClassifyFromDatabase(submissionId: string) {
  try {
    const supabase = await createClient();


    const textData = await gatherSubmissionText(supabase, submissionId);

    if (!textData) {
      return { success: false, error: 'Failed to gather submission data' };
    }


    const combinedText = combineTextForClassification(textData);

    
    const mlResponse = await fetch('http://localhost:3000/api/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: combinedText,
        model_name: 'distilbert',
        use_chunking: true
      })
    });

    if (!mlResponse.ok) {
      const errorText = await mlResponse.text();
      throw new Error(`ML API request failed: ${mlResponse.status}`);
    }

    const mlResult = await mlResponse.json();


    const { data: updateData, error: updateError } = await supabase
      .from('research_submissions')
      .update({
        ai_suggested_classification: mlResult.prediction,
        ai_classification_confidence: mlResult.confidence,
        ai_classification_method: mlResult.method,
        ai_classified_at: new Date().toISOString(),
        classification_metadata: mlResult,
      })
      .eq('id', submissionId)
      .select(); // 

    if (updateError) {
      return { success: false, error: updateError.message };
    }


    return {
      success: true,
      classification: mlResult.prediction,
      confidence: mlResult.confidence,
      method: mlResult.method,
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Classification failed'
    };
  }
}

async function gatherSubmissionText(supabase: any, submissionId: string) {
  try {
    const { data: submission } = await supabase
      .from('research_submissions')
      .select('title, research_description')
      .eq('id', submissionId)
      .single();

    const { data: protocol } = await supabase
      .from('research_protocols')
      .select(`
        title,
        introduction,
        background,
        problem_statement,
        scope_delimitation,
        literature_review,
        methodology,
        population,
        sampling_technique,
        research_instrument,
        statistical_treatment,
        researchers
      `)
      .eq('submission_id', submissionId)
      .single();

    const { data: consent } = await supabase
      .from('consent_forms')
      .select(`
        consent_type,
        adult_consent,
        minor_assent,
        contact_person
      `)
      .eq('submission_id', submissionId)
      .single();

    return {
      submission,
      protocol,
      consent,
    };
  } catch (error) {
    console.error('Error gathering text:', error);
    return null;
  }
}

function combineTextForClassification(data: any): string {
  const sections: string[] = [];

  if (data.submission) {
    sections.push(`TITLE: ${data.submission.title || ''}`);
    sections.push(`DESCRIPTION: ${data.submission.research_description || ''}`);
  }

  if (data.protocol) {
    sections.push(`PROTOCOL TITLE: ${data.protocol.title || ''}`);
    sections.push(`INTRODUCTION: ${data.protocol.introduction || ''}`);
    sections.push(`BACKGROUND: ${data.protocol.background || ''}`);
    sections.push(`PROBLEM STATEMENT: ${data.protocol.problem_statement || ''}`);
    sections.push(`SCOPE: ${data.protocol.scope_delimitation || ''}`);
    sections.push(`LITERATURE: ${data.protocol.literature_review || ''}`);
    sections.push(`METHODOLOGY: ${data.protocol.methodology || ''}`);
    sections.push(`POPULATION: ${data.protocol.population || ''}`);
    sections.push(`SAMPLING: ${data.protocol.sampling_technique || ''}`);
    sections.push(`INSTRUMENT: ${data.protocol.research_instrument || ''}`);
    sections.push(`STATISTICAL: ${data.protocol.statistical_treatment || ''}`);
    
    if (data.protocol.researchers) {
      sections.push(`RESEARCHERS: ${JSON.stringify(data.protocol.researchers)}`);
    }
  }

  if (data.consent) {
    sections.push(`CONSENT TYPE: ${data.consent.consent_type || ''}`);
    
    if (data.consent.adult_consent) {
      sections.push(`ADULT CONSENT: ${JSON.stringify(data.consent.adult_consent)}`);
    }
    
    if (data.consent.minor_assent) {
      sections.push(`MINOR ASSENT: ${JSON.stringify(data.consent.minor_assent)}`);
    }
    
    sections.push(`CONTACT: ${data.consent.contact_person || ''}`);
  }

  return sections.filter(s => s.trim() && s.length > 10).join('\n\n');
}
