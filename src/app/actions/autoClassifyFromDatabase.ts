'use server';

import { createClient } from '@/utils/supabase/server';

export async function autoClassifyFromDatabase(submissionId: string) {
  try {
    const supabase = await createClient();
    
    console.log('🚀 Starting classification for submission:', submissionId);

    const textData = await gatherSubmissionText(supabase, submissionId);

    if (!textData) {
      console.error('❌ Failed to gather submission data');
      return { success: false, error: 'Failed to gather submission data' };
    }

    const combinedText = combineTextForClassification(textData);
    
    console.log('📝 Combined text length:', combinedText.length, 'characters');

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
      console.error('❌ ML API error:', mlResponse.status, errorText);
      throw new Error(`ML API request failed: ${mlResponse.status}`);
    }

    const mlResult = await mlResponse.json();
    
    console.log('✨ Classification Result:', mlResult.prediction);
    console.log('   Confidence:', (mlResult.confidence * 100).toFixed(2) + '%');

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
      .select();

    if (updateError) {
      console.error('❌ Database update error:', updateError.message);
      return { success: false, error: updateError.message };
    }

    console.log('✅ Database updated successfully');

    return {
      success: true,
      classification: mlResult.prediction,
      confidence: mlResult.confidence,
      method: mlResult.method,
    };

  } catch (error) {
    console.error('❌ Classification failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Classification failed'
    };
  }
}

// ✅ Utility function to clean text
function cleanText(text: string): string {
  if (!text) return '';
  
  // Remove HTML tags
  text = text.replace(/<[^>]*>/g, ' ');
  
  // Remove "N/A" and "<br>" placeholder strings
  text = text.replace(/N\/A/g, '');
  text = text.replace(/<br>/g, ' ');
  
  // Remove extra whitespace
  text = text.replace(/\s+/g, ' ').trim();
  
  return text;
}

// ✅ Utility to extract text from JSON objects
function extractTextFromObject(obj: any): string {
  if (!obj) return '';
  
  const texts: string[] = [];
  
  for (const key in obj) {
    const value = obj[key];
    
    // Skip metadata fields
    if (key.includes('id') || key.includes('Id') || key.includes('ID') || 
        key.includes('created') || key.includes('updated')) {
      continue;
    }
    
    // Extract from string values
    if (typeof value === 'string') {
      const cleaned = cleanText(value);
      if (cleaned && cleaned.length > 5) {
        texts.push(cleaned);
      }
    }
    // Recursively extract from objects
    else if (typeof value === 'object' && value !== null) {
      const extracted = extractTextFromObject(value);
      if (extracted) texts.push(extracted);
    }
  }
  
  return texts.join(' ');
}

async function gatherSubmissionText(supabase: any, submissionId: string) {
  try {
    console.log('📥 Fetching submission data...');
    const { data: submission, error: subError } = await supabase
      .from('research_submissions')
      .select('title')
      .eq('id', submissionId)
      .maybeSingle();

    if (subError) console.error('⚠️ Submission fetch error:', subError);
    console.log('   ✓ Submission found:', !!submission);

    console.log('📥 Fetching research protocol data...');
    const { data: protocol, error: protError } = await supabase
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
      .maybeSingle();

    if (protError) console.error('⚠️ Protocol fetch error:', protError);
    console.log('   ✓ Protocol found:', !!protocol);

    console.log('📥 Fetching consent form data...');
    const { data: consent, error: conError } = await supabase
      .from('consent_forms')
      .select('*')  // ✅ Get ALL fields (includes all those English/Tagalog variants)
      .eq('submission_id', submissionId)
      .maybeSingle();

    if (conError) console.error('❌ Consent fetch ERROR:', conError);
    if (consent) {
      console.log('✅ CONSENT FORM FOUND!');
      console.log('   Type:', consent.consent_type);
    } else {
      console.warn('⚠️ NO CONSENT FORM FOUND for submission:', submissionId);
    }

    return {
      submission,
      protocol,
      consent,
    };
  } catch (error) {
    console.error('❌ Error gathering text:', error);
    return null;
  }
}

function combineTextForClassification(data: any): string {
  const sections: string[] = [];

  if (data.submission) {
    sections.push(`TITLE: ${cleanText(data.submission.title || '')}`);
    sections.push(`DESCRIPTION: ${cleanText(data.submission.research_description || '')}`);
  }

  if (data.protocol) {
    sections.push(`PROTOCOL TITLE: ${cleanText(data.protocol.title || '')}`);
    sections.push(`INTRODUCTION: ${cleanText(data.protocol.introduction || '')}`);
    sections.push(`BACKGROUND: ${cleanText(data.protocol.background || '')}`);
    sections.push(`PROBLEM STATEMENT: ${cleanText(data.protocol.problem_statement || '')}`);
    sections.push(`SCOPE: ${cleanText(data.protocol.scope_delimitation || '')}`);
    sections.push(`LITERATURE: ${cleanText(data.protocol.literature_review || '')}`);
    sections.push(`METHODOLOGY: ${cleanText(data.protocol.methodology || '')}`);
    sections.push(`POPULATION: ${cleanText(data.protocol.population || '')}`);
    sections.push(`SAMPLING: ${cleanText(data.protocol.sampling_technique || '')}`);
    sections.push(`INSTRUMENT: ${cleanText(data.protocol.research_instrument || '')}`);
    sections.push(`STATISTICAL: ${cleanText(data.protocol.statistical_treatment || '')}`);
    
    if (data.protocol.researchers) {
      sections.push(`RESEARCHERS: ${cleanText(JSON.stringify(data.protocol.researchers))}`);
    }
  }

  // ✅ Extract all text from consent form (handles all those English/Tagalog fields)
  if (data.consent) {
    console.log('✨ Including consent form in classification text');
    
    // Extract ALL meaningful text from the consent object
    const consentText = extractTextFromObject(data.consent);
    if (consentText) {
      sections.push(`CONSENT FORM: ${consentText}`);
    }
  } else {
    console.warn('⚠️ No consent form to include in classification text');
  }

  // Final cleanup: filter empty sections and join
  return sections
    .filter(s => cleanText(s).length > 10)  // Only keep sections with real content
    .join('\n\n');
}
