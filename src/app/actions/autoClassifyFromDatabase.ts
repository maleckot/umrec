// app/actions/autoClassify.ts
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

    // 🔍 DIAGNOSTIC: Log individual data sizes
    console.log('🔍 Submission JSON length:', textData.submission ? JSON.stringify(textData.submission).length : 0);
    console.log('🔍 Protocol JSON length:', textData.protocol ? JSON.stringify(textData.protocol).length : 0);
    console.log('🔍 Consent JSON length:', textData.consent ? JSON.stringify(textData.consent).length : 0);

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

function stripHtmlAndSanitize(text: string): string {
  if (!text) return '';

  let cleaned = text
    // Convert common HTML tags to text equivalents
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<li>/gi, '\n• ')
    .replace(/<\/li>/gi, '')

    // Remove all HTML tags
    .replace(/<[^>]+>/g, '')

    // Decode HTML entities
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&apos;/gi, "'")

    // Replace special characters
    .replace(/[●○■□]/g, '•')
    .replace(/[—–]/g, '-')
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .replace(/…/g, '...')

    // Clean whitespace
    .replace(/  +/g, ' ')
    .replace(/^ +| +$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

    // Remove non-WinAnsi characters
    .replace(/[^\x20-\x7E\xA0-\xFF\n\r\t]/g, '');

  return cleaned;
}

function cleanText(text: string): string {
  if (!text) return '';
  return stripHtmlAndSanitize(text);
}

function extractTextFromObject(obj: any): string {
  if (!obj) return '';
  
  const texts: string[] = [];
  
  for (const key in obj) {
    const value = obj[key];
    
    if (key.includes('id') || key.includes('Id') || key.includes('ID') || 
        key.includes('created') || key.includes('updated')) {
      continue;
    }
    
    if (typeof value === 'string') {
      const cleaned = cleanText(value);
      if (cleaned && cleaned.length > 5) {
        texts.push(cleaned);
      }
    }
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
        statistical_treatment
      `)
      .eq('submission_id', submissionId)
      .maybeSingle();

    if (protError) console.error('⚠️ Protocol fetch error:', protError);
    console.log('   ✓ Protocol found:', !!protocol);

    console.log('📥 Fetching consent form data...');
    const { data: consent, error: conError } = await supabase
      .from('consent_forms')
      .select('*')
      .eq('submission_id', submissionId)
      .maybeSingle();

    if (conError) console.error('❌ Consent fetch ERROR:', conError);
    if (consent) {
      console.log('✅ CONSENT FORM FOUND!');
      console.log('   Type:', consent.consent_type);
      console.log('🔍 Consent keys:', Object.keys(consent).length, 'fields');
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
    const cleanTitle = cleanText(data.submission.title || '');
    console.log('🧹 Submission BEFORE:', data.submission.title?.substring(0, 100));
    console.log('🧹 Submission AFTER:', cleanTitle.substring(0, 100));
    sections.push(`TITLE: ${cleanTitle}`);
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
  }

  if (data.consent) {
    console.log('✨ Including consent form in classification text');
    
    const consentText = extractTextFromObject(data.consent);
    console.log('🔍 Extracted consent text length:', consentText.length, 'characters');
    
    if (consentText) {
      sections.push(`CONSENT FORM: ${consentText}`);
    }
  } else {
    console.warn('⚠️ No consent form to include in classification text');
  }

  return sections
    .filter(s => cleanText(s).length > 10)
    .join('\n\n');
}
