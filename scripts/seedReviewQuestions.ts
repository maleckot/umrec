// scripts/seedReviewQuestions.ts
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

// Now TypeScript knows these are strings, not undefined
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface Question {
  question_id: string;
  question_text: string;
  question_type: 'radio' | 'textarea' | 'checkbox';
  options?: string[];
  depends_on?: {
    id: string;
    values: string[];
  };
  is_required: boolean;
  order_index: number;
}

interface Section {
  title: string;
  subtitle?: string;
  questions: Question[];
}

async function seedReviewQuestions() {
  console.log('🌱 Starting seed process...\n');

  try {
    // Step 1: Create form version
    console.log('📝 Creating form version...');
    const { data: formVersion, error: versionError } = await supabase
      .from('review_form_versions')
      .insert({
        version_name: 'UMREC Review Form v1.0',
        form_type: 'both',
        description: 'Initial UMREC protocol and consent review form',
        is_active: true,
      })
      .select()
      .single();

    if (versionError) {
      console.error('❌ Error creating form version:', versionError);
      return;
    }

    console.log(`✅ Created form version: ${formVersion.version_name} (ID: ${formVersion.id})\n`);

    // Step 2: Define all sections with questions
    const sectionsData: Section[] = [  // ✅ Added `: Section[]` type annotation
      {
        title: 'Protocol Review - Research Design & Methodology',
        questions: [
          {
            question_id: 'q1',
            question_text: '1. Is/Are the research question(s) reasonable?',
            question_type: 'radio',
            options: ['Yes', 'No', 'Unable to Assess'],
            is_required: false,
            order_index: 1,
          },
          {
            question_id: 'q1_comment',
            question_text: 'If NO or UNABLE TO ASSESS, please comment:',
            question_type: 'textarea',
            depends_on: { id: 'q1', values: ['No', 'Unable to Assess'] },
            is_required: false,
            order_index: 2,
          },
          {
            question_id: 'q2',
            question_text: '2. Are the study objectives specific, measurable, attainable, and reasonable?',
            question_type: 'radio',
            options: ['Yes', 'No', 'Unable to Assess'],
            is_required: false,
            order_index: 3,
          },
          {
            question_id: 'q2_comment',
            question_text: 'If NO or UNABLE TO ASSESS, please comment:',
            question_type: 'textarea',
            depends_on: { id: 'q2', values: ['No', 'Unable to Assess'] },
            is_required: false,
            order_index: 4,
          },
          {
            question_id: 'q3',
            question_text: '3. Is the research methodology appropriate?',
            question_type: 'radio',
            options: ['Yes', 'No', 'Unable to Assess'],
            is_required: false,
            order_index: 5,
          },
          {
            question_id: 'q3_comment',
            question_text: 'If NO or UNABLE TO ASSESS, please comment:',
            question_type: 'textarea',
            depends_on: { id: 'q3', values: ['No', 'Unable to Assess'] },
            is_required: false,
            order_index: 6,
          },
        ],
      },
      {
        title: 'Protocol Review - Participants & Background',
        questions: [
          {
            question_id: 'q4',
            question_text: '4. Does the research need to be carried out with human participants?',
            question_type: 'radio',
            options: ['Yes', 'No', 'Unable to Assess'],
            is_required: false,
            order_index: 1,
          },
          {
            question_id: 'q4_comment',
            question_text: 'If NO or UNABLE TO ASSESS, please comment:',
            question_type: 'textarea',
            depends_on: { id: 'q4', values: ['No', 'Unable to Assess'] },
            is_required: false,
            order_index: 2,
          },
          {
            question_id: 'q5',
            question_text: '5. Does the protocol present sufficient background information or results of previous studies prior to human experimentation?',
            question_type: 'radio',
            options: ['Yes', 'No', 'Unable to Assess'],
            is_required: false,
            order_index: 3,
          },
          {
            question_id: 'q5_comment',
            question_text: 'If NO or UNABLE TO ASSESS, please comment:',
            question_type: 'textarea',
            depends_on: { id: 'q5', values: ['No', 'Unable to Assess'] },
            is_required: false,
            order_index: 4,
          },
        ],
      },
      {
        title: 'Protocol Review - Vulnerable Populations',
        questions: [
          {
            question_id: 'q6',
            question_text: '6. Does the study involve individuals who are vulnerable?',
            question_type: 'radio',
            options: ['Yes', 'No', 'Unable to Assess'],
            is_required: false,
            order_index: 1,
          },
          {
            question_id: 'q6_comment',
            question_text: 'If YES, please comment:',
            question_type: 'textarea',
            depends_on: { id: 'q6', values: ['Yes'] },
            is_required: false,
            order_index: 2,
          },
          {
            question_id: 'q7',
            question_text: '7. Are appropriate mechanisms in place to protect the vulnerable potential participants?',
            question_type: 'radio',
            options: ['Yes', 'No', 'Unable to Assess', 'N/A'],
            is_required: false,
            order_index: 3,
          },
          {
            question_id: 'q7_comment',
            question_text: 'If NO or UNABLE TO ASSESS, please comment:',
            question_type: 'textarea',
            depends_on: { id: 'q7', values: ['No', 'Unable to Assess'] },
            is_required: false,
            order_index: 4,
          },
        ],
      },
      {
        title: 'Protocol Review - Risks & Benefits',
        questions: [
          {
            question_id: 'q8',
            question_text: '8. Are there probable risks to the human participants in the study?',
            question_type: 'radio',
            options: ['Yes', 'No', 'Unable to Assess'],
            is_required: false,
            order_index: 1,
          },
          {
            question_id: 'q8_comment',
            question_text: 'If YES, please comment:',
            question_type: 'textarea',
            depends_on: { id: 'q8', values: ['Yes'] },
            is_required: false,
            order_index: 2,
          },
          {
            question_id: 'q9',
            question_text: '9. What are the risks? Are these identified in the protocol?',
            question_type: 'radio',
            options: ['Yes', 'No', 'Unable to Assess'],
            is_required: false,
            order_index: 3,
          },
          {
            question_id: 'q9_comment',
            question_text: 'If NO or UNABLE TO ASSESS, please comment:',
            question_type: 'textarea',
            depends_on: { id: 'q9', values: ['No', 'Unable to Assess'] },
            is_required: false,
            order_index: 4,
          },
          {
            question_id: 'q9b',
            question_text: '● Are the possible benefits identified in the protocol?',
            question_type: 'radio',
            options: ['Yes', 'No', 'Unable to Assess'],
            is_required: false,
            order_index: 5,
          },
          {
            question_id: 'q9b_comment',
            question_text: 'If NO or UNABLE TO ASSESS, please comment:',
            question_type: 'textarea',
            depends_on: { id: 'q9b', values: ['No', 'Unable to Assess'] },
            is_required: false,
            order_index: 6,
          },
          {
            question_id: 'q10',
            question_text: '10. Does the protocol adequately address the risk/benefit balance?',
            question_type: 'radio',
            options: ['Yes', 'No', 'Unable to Assess'],
            is_required: false,
            order_index: 7,
          },
          {
            question_id: 'q10_comment',
            question_text: 'If NO or UNABLE TO ASSESS, please comment:',
            question_type: 'textarea',
            depends_on: { id: 'q10', values: ['No', 'Unable to Assess'] },
            is_required: false,
            order_index: 8,
          },
        ],
      },
      {
        title: 'Protocol Review - Privacy & Data Protection',
        questions: [
          {
            question_id: 'q11',
            question_text: '11. Does the protocol address issues of privacy and confidentiality? Is there a Data Protection Plan?',
            question_type: 'radio',
            options: ['Yes', 'No', 'Unable to Assess'],
            is_required: false,
            order_index: 1,
          },
          {
            question_id: 'q11_comment',
            question_text: 'If NO or UNABLE TO ASSESS, please comment:',
            question_type: 'textarea',
            depends_on: { id: 'q11', values: ['No', 'Unable to Assess'] },
            is_required: false,
            order_index: 2,
          },
        ],
      },
      {
        title: 'Protocol Review - Technical Aspects',
        questions: [
          {
            question_id: 'q12',
            question_text: '12. Are toxicological and pharmacological data adequate?',
            question_type: 'radio',
            options: ['Yes', 'No', 'N/A'],
            is_required: false,
            order_index: 1,
          },
          {
            question_id: 'q12_comment',
            question_text: 'If NO, please comment:',
            question_type: 'textarea',
            depends_on: { id: 'q12', values: ['No'] },
            is_required: false,
            order_index: 2,
          },
          {
            question_id: 'q13',
            question_text: '13. Is the informed consent procedure/form adequate and culturally appropriate?',
            question_type: 'radio',
            options: ['Yes', 'No'],
            is_required: false,
            order_index: 3,
          },
          {
            question_id: 'q13_comment',
            question_text: 'If NO, please comment:',
            question_type: 'textarea',
            depends_on: { id: 'q13', values: ['No'] },
            is_required: false,
            order_index: 4,
          },
        ],
      },
      {
        title: 'Protocol Review - Researcher Qualifications',
        questions: [
          {
            question_id: 'q14',
            question_text: '14. Are the proponents adequately trained and do they have sufficient experience?',
            question_type: 'radio',
            options: ['Yes', 'No', 'Unable to Assess'],
            is_required: false,
            order_index: 1,
          },
          {
            question_id: 'q14_comment',
            question_text: 'If NO or UNABLE TO ASSESS, please comment:',
            question_type: 'textarea',
            depends_on: { id: 'q14', values: ['No', 'Unable to Assess'] },
            is_required: false,
            order_index: 2,
          },
          {
            question_id: 'q15',
            question_text: '15. Does the protocol describe community engagement/consultation prior to and during the conduct of research?',
            question_type: 'radio',
            options: ['Yes', 'No'],
            is_required: false,
            order_index: 3,
          },
          {
            question_id: 'q15_comment',
            question_text: 'If NO, please comment:',
            question_type: 'textarea',
            depends_on: { id: 'q15', values: ['No'] },
            is_required: false,
            order_index: 4,
          },
        ],
      },
      {
        title: 'Protocol Review - Dissemination & Facilities',
        questions: [
          {
            question_id: 'q16',
            question_text: '16. Does the protocol include strategies to be used in disseminating/ensuring utilization of the expected research results?',
            question_type: 'radio',
            options: ['Yes', 'No'],
            is_required: false,
            order_index: 1,
          },
          {
            question_id: 'q16_comment',
            question_text: 'If NO, please comment:',
            question_type: 'textarea',
            depends_on: { id: 'q16', values: ['No'] },
            is_required: false,
            order_index: 2,
          },
          {
            question_id: 'q17',
            question_text: '17. Is the research facility appropriate?',
            question_type: 'radio',
            options: ['Yes', 'No'],
            is_required: false,
            order_index: 3,
          },
          {
            question_id: 'q17_comment',
            question_text: 'If NO, please comment:',
            question_type: 'textarea',
            depends_on: { id: 'q17', values: ['No'] },
            is_required: false,
            order_index: 4,
          },
          {
            question_id: 'q18',
            question_text: '18. Do you have any other concerns?',
            question_type: 'radio',
            options: ['Yes', 'No'],
            is_required: false,
            order_index: 5,
          },
          {
            question_id: 'q18_comment',
            question_text: 'If YES, please describe:',
            question_type: 'textarea',
            depends_on: { id: 'q18', values: ['Yes'] },
            is_required: false,
            order_index: 6,
          },
        ],
      },
      {
        title: 'Informed Consent Review - Part 1',
        questions: [
          {
            question_id: 'icf_q1',
            question_text: '1. Is it necessary to seek the informed consent of the participants?',
            question_type: 'radio',
            options: ['Unable to Assess', 'Yes', 'No'],
            is_required: false,
            order_index: 1,
          },
          {
            question_id: 'icf_q1_explain',
            question_text: 'If NO, please explain:',
            question_type: 'textarea',
            depends_on: { id: 'icf_q1', values: ['No'] },
            is_required: false,
            order_index: 2,
          },
        ],
      },
      {
        title: 'Informed Consent - Information Provided (Part 1)',
        subtitle: 'If YES to Question 1, are the participants provided with sufficient information about:',
        questions: [
          {
            question_id: 'icf_purpose',
            question_text: '● Purpose of the study?',
            question_type: 'radio',
            options: ['Yes', 'No'],
            is_required: false,
            order_index: 1,
          },
          {
            question_id: 'icf_duration',
            question_text: '● Expected duration of participation?',
            question_type: 'radio',
            options: ['Yes', 'No'],
            is_required: false,
            order_index: 2,
          },
          {
            question_id: 'icf_procedures',
            question_text: '● Procedures to be carried out?',
            question_type: 'radio',
            options: ['Yes', 'No'],
            is_required: false,
            order_index: 3,
          },
          {
            question_id: 'icf_discomforts',
            question_text: '● Discomforts and inconveniences?',
            question_type: 'radio',
            options: ['Yes', 'No'],
            is_required: false,
            order_index: 4,
          },
          {
            question_id: 'icf_risks',
            question_text: '● Risks (including possible discrimination)?',
            question_type: 'radio',
            options: ['Yes', 'No'],
            is_required: false,
            order_index: 5,
          },
        ],
      },
      {
        title: 'Informed Consent - Information Provided (Part 2)',
        questions: [
          {
            question_id: 'icf_benefits',
            question_text: '● Benefit to the participants?',
            question_type: 'radio',
            options: ['Yes', 'No'],
            is_required: false,
            order_index: 1,
          },
          {
            question_id: 'icf_compensation',
            question_text: '● Compensation and/or medical treatments in case of injury?',
            question_type: 'radio',
            options: ['Yes', 'No'],
            is_required: false,
            order_index: 2,
          },
          {
            question_id: 'icf_contact',
            question_text: '● Who to contact for questions/assistance?',
            question_type: 'radio',
            options: ['Yes', 'No'],
            is_required: false,
            order_index: 3,
          },
          {
            question_id: 'icf_withdrawal',
            question_text: '● Voluntary participation and withdrawal?',
            question_type: 'radio',
            options: ['Yes', 'No'],
            is_required: false,
            order_index: 4,
          },
          {
            question_id: 'icf_confidentiality',
            question_text: '● Extent of confidentiality?',
            question_type: 'radio',
            options: ['Yes', 'No'],
            is_required: false,
            order_index: 5,
          },
          {
            question_id: 'icf_data_protection',
            question_text: '● Data protection plan?',
            question_type: 'radio',
            options: ['Yes', 'No'],
            is_required: false,
            order_index: 6,
          },
        ],
      },
      {
        title: 'Informed Consent - Final Questions',
        questions: [
          {
            question_id: 'icf_q2',
            question_text: '2. Is the informed consent written in simple language?',
            question_type: 'radio',
            options: ['Yes', 'No'],
            is_required: false,
            order_index: 1,
          },
          {
            question_id: 'icf_q3',
            question_text: '3. Does the protocol ensure consent is voluntary?',
            question_type: 'radio',
            options: ['Yes', 'No'],
            is_required: false,
            order_index: 2,
          },
          {
            question_id: 'icf_q4',
            question_text: '4. Do you have any other concerns?',
            question_type: 'radio',
            options: ['Yes', 'No'],
            is_required: false,
            order_index: 3,
          },
          {
            question_id: 'icf_q4_concerns',
            question_text: 'If YES, please describe:',
            question_type: 'textarea',
            depends_on: { id: 'icf_q4', values: ['Yes'] },
            is_required: false,
            order_index: 4,
          },
        ],
      },
      {
        title: 'Final Recommendation',
        questions: [
          {
            question_id: 'recommendation',
            question_text: 'Select your recommendation:',
            question_type: 'radio',
            options: [
              'Approved with no revision',
              'Approved with Minor revision/s',
              'Major revision/s and resubmission required',
              'Disapproved',
            ],
            is_required: true,
            order_index: 1,
          },
          {
            question_id: 'disapproval_reasons',
            question_text: 'Reasons for disapproval:',
            question_type: 'textarea',
            depends_on: { id: 'recommendation', values: ['Disapproved'] },
            is_required: false,
            order_index: 2,
          },
          {
            question_id: 'ethics_recommendation',
            question_text: 'Ethics Review Recommendation:',
            question_type: 'textarea',
            is_required: true,
            order_index: 3,
          },
          {
            question_id: 'technical_suggestions',
            question_text: 'Technical Suggestions:',
            question_type: 'textarea',
            is_required: false,
            order_index: 4,
          },
        ],
      },
    ];

    // Step 3: Insert sections and questions
    for (let sectionIndex = 0; sectionIndex < sectionsData.length; sectionIndex++) {
      const sectionData = sectionsData[sectionIndex];

      console.log(`📋 Creating section: "${sectionData.title}"...`);

      // Insert section
      const { data: section, error: sectionError } = await supabase
        .from('review_sections')
        .insert({
          form_version_id: formVersion.id,
          title: sectionData.title,
          subtitle: sectionData.subtitle || null,
          order_index: sectionIndex + 1,
        })
        .select()
        .single();

      if (sectionError) {
        console.error(`  ❌ Error creating section:`, sectionError);
        continue;
      }

      // Insert questions for this section
      const questions = sectionData.questions.map((q) => ({
        section_id: section.id,
        question_id: q.question_id,
        question_text: q.question_text,
        question_type: q.question_type,
        options: q.options || null,
        depends_on: q.depends_on || null,
        is_required: q.is_required,
        order_index: q.order_index,
      }));

      const { error: questionsError } = await supabase
        .from('review_questions')
        .insert(questions);

      if (questionsError) {
        console.error(`  ❌ Error inserting questions:`, questionsError);
      } else {
        console.log(`  ✅ Inserted ${questions.length} questions\n`);
      }
    }

    console.log('\n🎉 Seeding complete!');
    console.log(`📊 Summary:`);
    console.log(`   - Form Version: ${formVersion.version_name}`);
    console.log(`   - Total Sections: ${sectionsData.length}`);
    console.log(`   - Total Questions: ${sectionsData.reduce((sum, s) => sum + s.questions.length, 0)}`);

  } catch (error) {
    console.error('❌ Fatal error:', error);
  }
}

// Run the seed function
seedReviewQuestions();
