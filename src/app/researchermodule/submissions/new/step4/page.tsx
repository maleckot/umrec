// app/researchermodule/submissions/new/step4/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SubmissionStepLayout from '@/components/researcher/submission/SubmissionStepLayout';
import RichTextEditor from '@/components/researcher/submission/RichTextEditor';
import { RadioGroup } from '@/components/researcher/submission/FormComponents';

export default function Step4InformedConsent() {
  const router = useRouter();
  const [consentType, setConsentType] = useState<'adult' | 'minor' | 'both' | ''>('');
  const [formData, setFormData] = useState({
    // Adult Consent Form - English & Tagalog
    purposeEnglish: '',
    purposeTagalog: '',
    risksEnglish: '',
    risksTagalog: '',
    benefitsEnglish: '',
    benefitsTagalog: '',
    proceduresEnglish: '',
    proceduresTagalog: '',
    voluntarinessEnglish: '',
    voluntarinessTagalog: '',
    confidentialityEnglish: '',
    confidentialityTagalog: '',
    
    // Minor Assent Form - Bilingual
    introduction: '',
    purpose: '',
    choiceOfParticipants: '',
    voluntariness: '',
    procedures: '',
    risks: '',
    benefits: '',
    confidentiality: '',
    sharingFindings: '',
    certificateAssent: '',
    contactPerson: '',
    contactNumber: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('step4Data');
    if (saved) {
      const parsedData = JSON.parse(saved);
      setConsentType(parsedData.consentType || '');
      setFormData(parsedData.formData || formData);
    }
  }, []);

  const handleNext = () => {
    const dataToSave = {
      consentType,
      formData
    };
    localStorage.setItem('step4Data', JSON.stringify(dataToSave));
    router.push('/researchermodule/submissions/new/step5');
  };

  const handleBack = () => {
    router.push('/researchermodule/submissions/new/step3');
  };

  const showAdultForm = consentType === 'adult' || consentType === 'both';
  const showMinorForm = consentType === 'minor' || consentType === 'both';

  return (
    <SubmissionStepLayout
      stepNumber={4}
      title="Informed Consent / Assent Form"
      description="Complete the appropriate consent form based on your participant type."
      onBack={handleBack}
      onNext={handleNext}
      totalSteps={8}
    >
      <form className="space-y-8">
        {/* Instructions */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 p-4 sm:p-6 rounded-lg">
          <h4 className="font-bold text-[#1E293B] text-base sm:text-lg mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Instructions
          </h4>
          <p className="text-xs sm:text-sm text-[#475569] leading-relaxed" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Please select whether your research involves <strong>adult participants</strong>, <strong>minors (children 12 to under 15 years old)</strong>, or <strong>both</strong>. The form will adjust based on your selection. All fields should be completed thoroughly to ensure compliance with ethical research standards.
          </p>
        </div>

        {/* Consent Type Selection */}
        <div className="bg-white p-6 rounded-lg border-2 border-gray-300">
          <RadioGroup
            label="Select Participant Type"
            options={[
              { value: 'adult', label: 'Adult Participants Only (Informed Consent Form)' },
              { value: 'minor', label: 'Minors/Children 12-15 years old Only (Informed Assent Form)' },
              { value: 'both', label: 'Both Adult and Minor Participants' }
            ]}
            selected={consentType}
            onChange={(val) => setConsentType(val as 'adult' | 'minor' | 'both')}
            required
          />
        </div>

        {/* Adult Consent Form */}
        {showAdultForm && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 p-4 sm:p-6 rounded-lg">
              <h4 className="font-bold text-[#1E293B] text-base sm:text-lg mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Informed Consent Form (Adult Participants)
              </h4>
              <p className="text-xs sm:text-sm text-[#475569]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Please provide content in both <strong>English</strong> and <strong>Tagalog</strong> for each section.
              </p>
            </div>

            {/* Purpose of the Study */}
            <div className="space-y-4">
              <h5 className="font-bold text-[#1E293B] text-sm sm:text-base" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                1. Purpose of the Study
              </h5>
              
              <RichTextEditor
                label="Purpose (English Version)"
                value={formData.purposeEnglish}
                onChange={(val) => setFormData({...formData, purposeEnglish: val})}
                helperText="Explain the purpose and objectives of your research study in English."
                maxWords={500}
                required
              />

              <RichTextEditor
                label="Layunin (Tagalog Version)"
                value={formData.purposeTagalog}
                onChange={(val) => setFormData({...formData, purposeTagalog: val})}
                helperText="Ipaliwanag ang layunin at mga layunin ng iyong pag-aaral sa Tagalog."
                maxWords={500}
                required
              />
            </div>

            {/* Risks and Inconveniences */}
            <div className="space-y-4">
              <h5 className="font-bold text-[#1E293B] text-sm sm:text-base" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                2. Risks and Inconveniences
              </h5>
              
              <RichTextEditor
                label="Risks (English Version)"
                value={formData.risksEnglish}
                onChange={(val) => setFormData({...formData, risksEnglish: val})}
                helperText="Describe any potential risks or inconveniences to participants."
                maxWords={400}
                required
              />

              <RichTextEditor
                label="Mga Panganib (Tagalog Version)"
                value={formData.risksTagalog}
                onChange={(val) => setFormData({...formData, risksTagalog: val})}
                helperText="Ilarawan ang anumang mga panganib o abala sa mga kalahok."
                maxWords={400}
                required
              />
            </div>

            {/* Possible Benefits */}
            <div className="space-y-4">
              <h5 className="font-bold text-[#1E293B] text-sm sm:text-base" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                3. Possible Benefits for the Participants
              </h5>
              
              <RichTextEditor
                label="Benefits (English Version)"
                value={formData.benefitsEnglish}
                onChange={(val) => setFormData({...formData, benefitsEnglish: val})}
                helperText="Describe the potential benefits participants may receive."
                maxWords={400}
                required
              />

              <RichTextEditor
                label="Mga Benepisyo (Tagalog Version)"
                value={formData.benefitsTagalog}
                onChange={(val) => setFormData({...formData, benefitsTagalog: val})}
                helperText="Ilarawan ang mga posibleng benepisyo ng mga kalahok."
                maxWords={400}
                required
              />
            </div>

            {/* What Participants Will Do */}
            <div className="space-y-4">
              <h5 className="font-bold text-[#1E293B] text-sm sm:text-base" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                4. What You Will Be Asked to Do in the Study
              </h5>
              
              <RichTextEditor
                label="Procedures (English Version)"
                value={formData.proceduresEnglish}
                onChange={(val) => setFormData({...formData, proceduresEnglish: val})}
                helperText="Explain what participants will be required to do during the study."
                maxWords={400}
                required
              />

              <RichTextEditor
                label="Mga Proseso (Tagalog Version)"
                value={formData.proceduresTagalog}
                onChange={(val) => setFormData({...formData, proceduresTagalog: val})}
                helperText="Ipaliwanag kung ano ang gagawin ng mga kalahok sa pag-aaral."
                maxWords={400}
                required
              />
            </div>

            {/* Voluntariness of Participation */}
            <div className="space-y-4">
              <h5 className="font-bold text-[#1E293B] text-sm sm:text-base" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                5. Voluntariness of Participation
              </h5>
              
              <RichTextEditor
                label="Voluntariness (English Version)"
                value={formData.voluntarinessEnglish}
                onChange={(val) => setFormData({...formData, voluntarinessEnglish: val})}
                helperText="State clearly that participation is voluntary and participants can withdraw at any time without penalty."
                maxWords={300}
                required
              />

              <RichTextEditor
                label="Kusang-loob na Paglahok (Tagalog Version)"
                value={formData.voluntarinessTagalog}
                onChange={(val) => setFormData({...formData, voluntarinessTagalog: val})}
                helperText="Ipahayag nang malinaw na ang paglahok ay kusang-loob at maaaring umurong anumang oras."
                maxWords={300}
                required
              />
            </div>

            {/* Confidentiality */}
            <div className="space-y-4">
              <h5 className="font-bold text-[#1E293B] text-sm sm:text-base" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                6. Confidentiality
              </h5>
              
              <RichTextEditor
                label="Confidentiality (English Version)"
                value={formData.confidentialityEnglish}
                onChange={(val) => setFormData({...formData, confidentialityEnglish: val})}
                helperText="Explain how participant information will be kept confidential."
                maxWords={400}
                required
              />

              <RichTextEditor
                label="Pagiging Kumpidensyal (Tagalog Version)"
                value={formData.confidentialityTagalog}
                onChange={(val) => setFormData({...formData, confidentialityTagalog: val})}
                helperText="Ipaliwanag kung paano papanatilihing kumpidensyal ang impormasyon."
                maxWords={400}
                required
              />
            </div>
          </div>
        )}

        {/* Minor Assent Form */}
        {showMinorForm && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 p-4 sm:p-6 rounded-lg">
              <h4 className="font-bold text-[#1E293B] text-base sm:text-lg mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Informed Assent Form (For Minors 12-15 years old)
              </h4>
              <p className="text-xs sm:text-sm text-[#475569]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Complete all sections using child-friendly language. Include both English and Tagalog text in each field.
              </p>
            </div>

            {/* PART 1: INFORMATION SHEET */}
            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-[#FFD700] p-4 rounded-lg">
              <h5 className="font-bold text-[#1E293B] text-sm sm:text-base" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                PART 1: INFORMATION SHEET
              </h5>
            </div>

            {/* Introduction */}
            <RichTextEditor
              label="Introduction"
              value={formData.introduction}
              onChange={(val) => setFormData({...formData, introduction: val})}
              helperText="Provide a brief description of the study, state the procedure, and explain the parental consent requirement. Use simple, child-friendly language."
              maxWords={400}
              required
            />

            {/* Purpose of Research */}
            <RichTextEditor
              label="Purpose of Research"
              value={formData.purpose}
              onChange={(val) => setFormData({...formData, purpose: val})}
              helperText="Explain the purpose of research in simple terms that children can understand."
              maxWords={300}
              required
            />

            {/* Choice of Participants */}
            <RichTextEditor
              label="Choice of Participants"
              value={formData.choiceOfParticipants}
              onChange={(val) => setFormData({...formData, choiceOfParticipants: val})}
              helperText="Explain why the participants of the study were chosen."
              maxWords={200}
              required
            />

            {/* Voluntariness of Participation */}
            <RichTextEditor
              label="Voluntariness of Participation"
              value={formData.voluntariness}
              onChange={(val) => setFormData({...formData, voluntariness: val})}
              helperText="State clearly that the choice to participate is voluntary and their decision not to participate might be over-ridden by parental consent."
              maxWords={300}
              required
            />

            {/* Procedures */}
            <RichTextEditor
              label="Procedures"
              value={formData.procedures}
              onChange={(val) => setFormData({...formData, procedures: val})}
              helperText="Explain the procedures in simple terms."
              maxWords={400}
              required
            />

            {/* Risk and Inconveniences */}
            <RichTextEditor
              label="Risk and Inconveniences"
              value={formData.risks}
              onChange={(val) => setFormData({...formData, risks: val})}
              helperText="Describe what has been found that causes worry and how you, as a researcher, ensure that it will be prevented from happening."
              maxWords={300}
              required
            />

            {/* Possible Benefits */}
            <RichTextEditor
              label="Possible Benefits for the Participants"
              value={formData.benefits}
              onChange={(val) => setFormData({...formData, benefits: val})}
              helperText="Describe any benefits to the child (and to others)."
              maxWords={300}
              required
            />

            {/* Confidentiality */}
            <RichTextEditor
              label="Confidentiality"
              value={formData.confidentiality}
              onChange={(val) => setFormData({...formData, confidentiality: val})}
              helperText="State the limits and the scope of confidentiality of this research."
              maxWords={300}
              required
            />

            {/* Sharing the Findings */}
            <RichTextEditor
              label="Sharing the Findings"
              value={formData.sharingFindings}
              onChange={(val) => setFormData({...formData, sharingFindings: val})}
              helperText="Explain how the research findings will be shared in which confidential information will remain confidential."
              maxWords={200}
              required
            />

            {/* PART 2: CERTIFICATE OF ASSENT */}
            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-[#FFD700] p-4 rounded-lg mt-8">
              <h5 className="font-bold text-[#1E293B] text-sm sm:text-base mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                PART 2: CERTIFICATE OF ASSENT
              </h5>
              <p className="text-xs text-[#475569]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Fill in the specific details about your study in the text below. Include information in both English and Tagalog.
              </p>
            </div>

            <RichTextEditor
  label="Certificate of Assent Statement"
  value={formData.certificateAssent}
  onChange={(val) => setFormData({...formData, certificateAssent: val})}
  helperText="Complete the certificate statement with your study details. Include sections covering: research description, confidentiality assurance, risks, benefits, and participants' rights. Provide text in both English and Tagalog."
  maxWords={800}
  placeholder={`I am/we are (name of the researchers)* from the University of Makati, currently working on a study to figure out (why some kids don't do well in school, and how to help those kids better). We are asking you to take part in the research study because (your teacher recommended you for this project.)

Ako/kami po si (pangalan ng mga mananaliksik) mula sa University of Makati ay kasalukuyang gumagawa ng pag-aaral upang malaman (kung bakit ang ilang bata ay may kahinaan sa kanilang pag-aaral at kung paano sila matutulungan).

For this research, we will ask you some questions about (how you feel about school, and how you get along with your classmates). We will keep all your answers private and not show them to (your teacher or parent(s)/guardian). Only authorized people from the University working on the study will see them. Information derived from this study will only be used for academic purposes (or for research publication if necessary).

Sa pag-aaral na ito, kami po ay magbibigay ng ilang katanungan tungkol sa (kung ano ang iyong nararanasan sa iyong paaralan, at kung paano ka nakikisalamuha sa iyong mga kamag-aral). Tanging mga otorisadong mga tao mula aming unibersidad na kabahagi ng pagsasaliksik na ito ang tanging makakaalam. Ang mga impormasyon na makukuha sa pagsasaliksik na ito ay gagamitin lamang sa mga layuning pang akademiko (o sa paglalathala kung kinakailangan).

We don't think that any risks or problems will happen to you as part of this study, but you might feel sad when we ask about certain things (that happen at school. You also might be upset if other kids see your answers, but we will try to keep other kids from seeing what you write).

Ang mga mananaliksik ay naniniwalang walang panganib o problema ang maaaring mangyari sa iyo/inyo kung kayo ay magiging bahagi ng pag-aaral na ito. Subalit, maaari po kayong makaramdam ng (kalungkutan) habang isinasagawa ang pagtatanong.

(Describe direct benefits if applicable). You can feel good about helping us to (make things better for other kids who might have problems at their school.)

Maaari po kang makaramdam ng kasiyahan sa inyong pagtulong sa ginagawang pagsasaliksik (kung makakabuti sa ibang mag-aaral na nakaranas ng suliranin sa kanilang paaralan).

You should know that:
Dapat mong malaman na:

● You do not have to participate in this study if you do not want to. You won't get into any trouble with (the University, your teacher, or the school) if you say no.
Hindi mo kailangan na lumahok sa pagsasaliksik kung hindi mo kagustuhan. Hindi ka mapapahamak sa (iyong mga guro at paaralan) kung ikaw ay tatangi.

● You may stop participating in the study at any time. (If there is a question you don't want to answer, just leave it blank.)
Maaari mong itigil ang paglahok sa pagsasaliksik anumang oras.

● Your parent(s)/guardian(s) were asked if it is OK for you to be in this study. Even if they say it's OK, it is still your choice whether or not to take part.
Ang iyong mga magulang ay hiningian ng permiso kung nais mong maging bahagi ng pag-aaral. Subalit, kung sila man ay nagbigay ng pahintulot, ang iyong desisiyon na maging bahagi ng pag-aaral ang siya pa rin masusunod.

● You can ask any questions you have, now or later. If you think of a question later, you or your parents can contact me at (provide contact information for researcher(s), and advisor if graduate student).`}
  required
/>


            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Contact Person <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                  placeholder="Enter contact person name"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#3B82F6] focus:outline-none text-[#1E293B]"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Contact Number <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                  placeholder="Enter contact number"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#3B82F6] focus:outline-none text-[#1E293B]"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Important Note */}
        {consentType && (
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-[#FFD700] p-4 sm:p-6 rounded-lg">
            <h4 className="font-bold text-[#1E293B] mb-2 text-sm sm:text-base" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Important Note:
            </h4>
            <p className="text-xs sm:text-sm text-[#475569]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              {consentType === 'adult' 
                ? 'Ensure all sections are provided in both English and Tagalog to accommodate all participants. The consent form must clearly communicate the study details, risks, and benefits.'
                : consentType === 'minor'
                ? 'Use simple, child-friendly language appropriate for ages 12-15. Include both English and Tagalog text to ensure understanding. Parents/guardians must also provide consent.'
                : 'Complete both adult and minor consent forms thoroughly. Ensure all content is provided in both English and Tagalog for maximum accessibility.'}
            </p>
          </div>
        )}
      </form>
    </SubmissionStepLayout>
  );
}
