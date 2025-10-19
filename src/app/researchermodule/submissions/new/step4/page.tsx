// app/researchermodule/submissions/new/step4/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import SubmissionStepLayout from '@/components/researcher/submission/SubmissionStepLayout';
import RichTextEditor from '@/components/researcher/submission/RichTextEditor';
import { RadioGroup } from '@/components/researcher/submission/FormComponents';

export default function Step4InformedConsent() {
  const router = useRouter();
  const isInitialMount = useRef(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [consentType, setConsentType] = useState<'adult' | 'minor' | 'both' | ''>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('step4Data');
      if (saved) {
        try {
          const parsedData = JSON.parse(saved);
          return parsedData.consentType || '';
        } catch (error) {
          console.error('Error loading consent type:', error);
        }
      }
    }
    return '';
  });

  const [adultLanguage, setAdultLanguage] = useState<'english' | 'tagalog' | 'both' | ''>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('step4Data');
      if (saved) {
        try {
          const parsedData = JSON.parse(saved);
          return parsedData.adultLanguage || '';
        } catch (error) {
          console.error('Error loading adult language:', error);
        }
      }
    }
    return '';
  });

  const [minorLanguage, setMinorLanguage] = useState<'english' | 'tagalog' | 'both' | ''>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('step4Data');
      if (saved) {
        try {
          const parsedData = JSON.parse(saved);
          return parsedData.minorLanguage || '';
        } catch (error) {
          console.error('Error loading minor language:', error);
        }
      }
    }
    return '';
  });

  const [formData, setFormData] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('step4Data');
      if (saved) {
        try {
          const parsedData = JSON.parse(saved);
          return parsedData.formData || {
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
            introductionEnglish: '',
            introductionTagalog: '',
            purposeMinorEnglish: '',
            purposeMinorTagalog: '',
            choiceOfParticipantsEnglish: '',
            choiceOfParticipantsTagalog: '',
            voluntarinessMinorEnglish: '',
            voluntarinessMinorTagalog: '',
            proceduresMinorEnglish: '',
            proceduresMinorTagalog: '',
            risksMinorEnglish: '',
            risksMinorTagalog: '',
            benefitsMinorEnglish: '',
            benefitsMinorTagalog: '',
            confidentialityMinorEnglish: '',
            confidentialityMinorTagalog: '',
            sharingFindingsEnglish: '',
            sharingFindingsTagalog: '',
            certificateAssentEnglish: '',
            certificateAssentTagalog: '',
            contactPerson: '',
            contactNumber: ''
          };
        } catch (error) {
          console.error('Error loading form data:', error);
        }
      }
    }

    return {
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
      introductionEnglish: '',
      introductionTagalog: '',
      purposeMinorEnglish: '',
      purposeMinorTagalog: '',
      choiceOfParticipantsEnglish: '',
      choiceOfParticipantsTagalog: '',
      voluntarinessMinorEnglish: '',
      voluntarinessMinorTagalog: '',
      proceduresMinorEnglish: '',
      proceduresMinorTagalog: '',
      risksMinorEnglish: '',
      risksMinorTagalog: '',
      benefitsMinorEnglish: '',
      benefitsMinorTagalog: '',
      confidentialityMinorEnglish: '',
      confidentialityMinorTagalog: '',
      sharingFindingsEnglish: '',
      sharingFindingsTagalog: '',
      certificateAssentEnglish: '',
      certificateAssentTagalog: '',
      contactPerson: '',
      contactNumber: ''
    };
  });

  // Auto-save on data change
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      const dataToSave = {
        consentType,
        adultLanguage,
        minorLanguage,
        formData
      };
      localStorage.setItem('step4Data', JSON.stringify(dataToSave));
    }, 1000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [consentType, adultLanguage, minorLanguage, formData]);

  const handleNext = () => {
    const dataToSave = {
      consentType,
      adultLanguage,
      minorLanguage,
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
      <form className="space-y-6 sm:space-y-8">
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
            onChange={(val) => {
              setConsentType(val as 'adult' | 'minor' | 'both');
              // Reset language selections when consent type changes
              if (val !== 'adult' && val !== 'both') setAdultLanguage('');
              if (val !== 'minor' && val !== 'both') setMinorLanguage('');
            }}
            required
          />
        </div>

        {/* Adult Consent Form */}
        {showAdultForm && (
          <div className="space-y-6 sm:space-y-8">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 p-4 sm:p-6 rounded-lg">
              <h4 className="font-bold text-[#1E293B] text-base sm:text-lg mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Informed Consent Form (Adult Participants)
              </h4>
              <p className="text-xs sm:text-sm text-[#475569]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Select the language(s) you will provide for adult participants.
              </p>
            </div>

            {/* Language Selection for Adults */}
            <div className="bg-white p-6 rounded-lg border-2 border-gray-300">
              <RadioGroup
                label="Select Language for Adult Consent Form"
                options={[
                  { value: 'english', label: 'English Only' },
                  { value: 'tagalog', label: 'Tagalog Only' },
                  { value: 'both', label: 'Both English and Tagalog' }
                ]}
                selected={adultLanguage}
                onChange={(val) => setAdultLanguage(val as 'english' | 'tagalog' | 'both')}
                required
              />
            </div>

            {adultLanguage && (
              <>
                {/* Purpose of the Study */}
                <div className="space-y-4">
                  <h5 className="font-bold text-[#1E293B] text-sm sm:text-base" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    1. Purpose of the Study
                  </h5>
                  
                  {(adultLanguage === 'english' || adultLanguage === 'both') && (
                    <RichTextEditor
                      label="Purpose (English Version)"
                      value={formData.purposeEnglish}
                      onChange={(val) => setFormData({...formData, purposeEnglish: val})}
                      helperText="Explain the purpose and objectives of your research study in English."
                      maxWords={500}
                      required
                    />
                  )}

                  {(adultLanguage === 'tagalog' || adultLanguage === 'both') && (
                    <RichTextEditor
                      label="Layunin (Tagalog Version)"
                      value={formData.purposeTagalog}
                      onChange={(val) => setFormData({...formData, purposeTagalog: val})}
                      helperText="Ipaliwanag ang layunin at mga layunin ng iyong pag-aaral sa Tagalog."
                      maxWords={500}
                      required
                    />
                  )}
                </div>

                {/* Risks and Inconveniences */}
                <div className="space-y-4">
                  <h5 className="font-bold text-[#1E293B] text-sm sm:text-base" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    2. Risks and Inconveniences
                  </h5>
                  
                  {(adultLanguage === 'english' || adultLanguage === 'both') && (
                    <RichTextEditor
                      label="Risks (English Version)"
                      value={formData.risksEnglish}
                      onChange={(val) => setFormData({...formData, risksEnglish: val})}
                      helperText="Describe any potential risks or inconveniences to participants."
                      maxWords={400}
                      required
                    />
                  )}

                  {(adultLanguage === 'tagalog' || adultLanguage === 'both') && (
                    <RichTextEditor
                      label="Mga Panganib (Tagalog Version)"
                      value={formData.risksTagalog}
                      onChange={(val) => setFormData({...formData, risksTagalog: val})}
                      helperText="Ilarawan ang anumang mga panganib o abala sa mga kalahok."
                      maxWords={400}
                      required
                    />
                  )}
                </div>

                {/* Possible Benefits */}
                <div className="space-y-4">
                  <h5 className="font-bold text-[#1E293B] text-sm sm:text-base" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    3. Possible Benefits for the Participants
                  </h5>
                  
                  {(adultLanguage === 'english' || adultLanguage === 'both') && (
                    <RichTextEditor
                      label="Benefits (English Version)"
                      value={formData.benefitsEnglish}
                      onChange={(val) => setFormData({...formData, benefitsEnglish: val})}
                      helperText="Describe the potential benefits participants may receive."
                      maxWords={400}
                      required
                    />
                  )}

                  {(adultLanguage === 'tagalog' || adultLanguage === 'both') && (
                    <RichTextEditor
                      label="Mga Benepisyo (Tagalog Version)"
                      value={formData.benefitsTagalog}
                      onChange={(val) => setFormData({...formData, benefitsTagalog: val})}
                      helperText="Ilarawan ang mga posibleng benepisyo ng mga kalahok."
                      maxWords={400}
                      required
                    />
                  )}
                </div>

                {/* What Participants Will Do */}
                <div className="space-y-4">
                  <h5 className="font-bold text-[#1E293B] text-sm sm:text-base" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    4. What You Will Be Asked to Do in the Study
                  </h5>
                  
                  {(adultLanguage === 'english' || adultLanguage === 'both') && (
                    <RichTextEditor
                      label="Procedures (English Version)"
                      value={formData.proceduresEnglish}
                      onChange={(val) => setFormData({...formData, proceduresEnglish: val})}
                      helperText="Explain what participants will be required to do during the study."
                      maxWords={400}
                      required
                    />
                  )}

                  {(adultLanguage === 'tagalog' || adultLanguage === 'both') && (
                    <RichTextEditor
                      label="Mga Proseso (Tagalog Version)"
                      value={formData.proceduresTagalog}
                      onChange={(val) => setFormData({...formData, proceduresTagalog: val})}
                      helperText="Ipaliwanag kung ano ang gagawin ng mga kalahok sa pag-aaral."
                      maxWords={400}
                      required
                    />
                  )}
                </div>

                {/* Voluntariness of Participation */}
                <div className="space-y-4">
                  <h5 className="font-bold text-[#1E293B] text-sm sm:text-base" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    5. Voluntariness of Participation
                  </h5>
                  
                  {(adultLanguage === 'english' || adultLanguage === 'both') && (
                    <RichTextEditor
                      label="Voluntariness (English Version)"
                      value={formData.voluntarinessEnglish}
                      onChange={(val) => setFormData({...formData, voluntarinessEnglish: val})}
                      helperText="State clearly that participation is voluntary and participants can withdraw at any time without penalty."
                      maxWords={300}
                      required
                    />
                  )}

                  {(adultLanguage === 'tagalog' || adultLanguage === 'both') && (
                    <RichTextEditor
                      label="Kusang-loob na Paglahok (Tagalog Version)"
                      value={formData.voluntarinessTagalog}
                      onChange={(val) => setFormData({...formData, voluntarinessTagalog: val})}
                      helperText="Ipahayag nang malinaw na ang paglahok ay kusang-loob at maaaring umurong anumang oras."
                      maxWords={300}
                      required
                    />
                  )}
                </div>

                {/* Confidentiality */}
                <div className="space-y-4">
                  <h5 className="font-bold text-[#1E293B] text-sm sm:text-base" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    6. Confidentiality
                  </h5>
                  
                  {(adultLanguage === 'english' || adultLanguage === 'both') && (
                    <RichTextEditor
                      label="Confidentiality (English Version)"
                      value={formData.confidentialityEnglish}
                      onChange={(val) => setFormData({...formData, confidentialityEnglish: val})}
                      helperText="Explain how participant information will be kept confidential."
                      maxWords={400}
                      required
                    />
                  )}

                  {(adultLanguage === 'tagalog' || adultLanguage === 'both') && (
                    <RichTextEditor
                      label="Pagiging Kumpidensyal (Tagalog Version)"
                      value={formData.confidentialityTagalog}
                      onChange={(val) => setFormData({...formData, confidentialityTagalog: val})}
                      helperText="Ipaliwanag kung paano papanatilihing kumpidensyal ang impormasyon."
                      maxWords={400}
                      required
                    />
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Minor Assent Form */}
        {showMinorForm && (
          <div className="space-y-6 sm:space-y-8">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 p-4 sm:p-6 rounded-lg">
              <h4 className="font-bold text-[#1E293B] text-base sm:text-lg mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Informed Assent Form (For Minors 12-15 years old)
              </h4>
              <p className="text-xs sm:text-sm text-[#475569]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Select the language(s) you will provide for minor participants.
              </p>
            </div>

            {/* Language Selection for Minors */}
            <div className="bg-white p-6 rounded-lg border-2 border-gray-300">
              <RadioGroup
                label="Select Language for Minor Assent Form"
                options={[
                  { value: 'english', label: 'English Only' },
                  { value: 'tagalog', label: 'Tagalog Only' },
                  { value: 'both', label: 'Both English and Tagalog' }
                ]}
                selected={minorLanguage}
                onChange={(val) => setMinorLanguage(val as 'english' | 'tagalog' | 'both')}
                required
              />
            </div>

            {minorLanguage && (
              <>
                {/* PART 1: INFORMATION SHEET */}
                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-[#FFD700] p-4 rounded-lg">
                  <h5 className="font-bold text-[#1E293B] text-sm sm:text-base" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    PART 1: INFORMATION SHEET
                  </h5>
                </div>

                {/* Introduction */}
                <div className="space-y-4">
                  <h5 className="font-bold text-[#1E293B] text-sm sm:text-base" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Introduction
                  </h5>
                  
                  {(minorLanguage === 'english' || minorLanguage === 'both') && (
                    <RichTextEditor
                      label="Introduction (English Version)"
                      value={formData.introductionEnglish}
                      onChange={(val) => setFormData({...formData, introductionEnglish: val})}
                      helperText="Provide a brief description of the study, state the procedure, and explain the parental consent requirement. Use simple, child-friendly language."
                      maxWords={400}
                      required
                    />
                  )}

                  {(minorLanguage === 'tagalog' || minorLanguage === 'both') && (
                    <RichTextEditor
                      label="Panimula (Tagalog Version)"
                      value={formData.introductionTagalog}
                      onChange={(val) => setFormData({...formData, introductionTagalog: val})}
                      helperText="Magbigay ng maikling paglalarawan ng pag-aaral. Gumamit ng simple na wika na nauunawaan ng mga bata."
                      maxWords={400}
                      required
                    />
                  )}
                </div>

                {/* Purpose of Research */}
                <div className="space-y-4">
                  <h5 className="font-bold text-[#1E293B] text-sm sm:text-base" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Purpose of Research
                  </h5>
                  
                  {(minorLanguage === 'english' || minorLanguage === 'both') && (
                    <RichTextEditor
                      label="Purpose (English Version)"
                      value={formData.purposeMinorEnglish}
                      onChange={(val) => setFormData({...formData, purposeMinorEnglish: val})}
                      helperText="Explain the purpose of research in simple terms that children can understand."
                      maxWords={300}
                      required
                    />
                  )}

                  {(minorLanguage === 'tagalog' || minorLanguage === 'both') && (
                    <RichTextEditor
                      label="Layunin (Tagalog Version)"
                      value={formData.purposeMinorTagalog}
                      onChange={(val) => setFormData({...formData, purposeMinorTagalog: val})}
                      helperText="Ipaliwanag ang layunin ng pananaliksik sa simpleng wika."
                      maxWords={300}
                      required
                    />
                  )}
                </div>

                {/* Choice of Participants */}
                <div className="space-y-4">
                  <h5 className="font-bold text-[#1E293B] text-sm sm:text-base" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Choice of Participants
                  </h5>
                  
                  {(minorLanguage === 'english' || minorLanguage === 'both') && (
                    <RichTextEditor
                      label="Choice of Participants (English Version)"
                      value={formData.choiceOfParticipantsEnglish}
                      onChange={(val) => setFormData({...formData, choiceOfParticipantsEnglish: val})}
                      helperText="Explain why the participants of the study were chosen."
                      maxWords={200}
                      required
                    />
                  )}

                  {(minorLanguage === 'tagalog' || minorLanguage === 'both') && (
                    <RichTextEditor
                      label="Pagpili ng mga Kalahok (Tagalog Version)"
                      value={formData.choiceOfParticipantsTagalog}
                      onChange={(val) => setFormData({...formData, choiceOfParticipantsTagalog: val})}
                      helperText="Ipaliwanag kung bakit napili ang mga kalahok."
                      maxWords={200}
                      required
                    />
                  )}
                </div>

                {/* Voluntariness of Participation */}
                <div className="space-y-4">
                  <h5 className="font-bold text-[#1E293B] text-sm sm:text-base" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Voluntariness of Participation
                  </h5>
                  
                  {(minorLanguage === 'english' || minorLanguage === 'both') && (
                    <RichTextEditor
                      label="Voluntariness (English Version)"
                      value={formData.voluntarinessMinorEnglish}
                      onChange={(val) => setFormData({...formData, voluntarinessMinorEnglish: val})}
                      helperText="State clearly that the choice to participate is voluntary and their decision not to participate might be over-ridden by parental consent."
                      maxWords={300}
                      required
                    />
                  )}

                  {(minorLanguage === 'tagalog' || minorLanguage === 'both') && (
                    <RichTextEditor
                      label="Kusang-loob na Paglahok (Tagalog Version)"
                      value={formData.voluntarinessMinorTagalog}
                      onChange={(val) => setFormData({...formData, voluntarinessMinorTagalog: val})}
                      helperText="Ipahayag na ang paglahok ay kusang-loob."
                      maxWords={300}
                      required
                    />
                  )}
                </div>

                {/* Procedures */}
                <div className="space-y-4">
                  <h5 className="font-bold text-[#1E293B] text-sm sm:text-base" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Procedures
                  </h5>
                  
                  {(minorLanguage === 'english' || minorLanguage === 'both') && (
                    <RichTextEditor
                      label="Procedures (English Version)"
                      value={formData.proceduresMinorEnglish}
                      onChange={(val) => setFormData({...formData, proceduresMinorEnglish: val})}
                      helperText="Explain the procedures in simple terms."
                      maxWords={400}
                      required
                    />
                  )}

                  {(minorLanguage === 'tagalog' || minorLanguage === 'both') && (
                    <RichTextEditor
                      label="Mga Proseso (Tagalog Version)"
                      value={formData.proceduresMinorTagalog}
                      onChange={(val) => setFormData({...formData, proceduresMinorTagalog: val})}
                      helperText="Ipaliwanag ang mga proseso sa simpleng wika."
                      maxWords={400}
                      required
                    />
                  )}
                </div>

                {/* Risk and Inconveniences */}
                <div className="space-y-4">
                  <h5 className="font-bold text-[#1E293B] text-sm sm:text-base" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Risk and Inconveniences
                  </h5>
                  
                  {(minorLanguage === 'english' || minorLanguage === 'both') && (
                    <RichTextEditor
                      label="Risks (English Version)"
                      value={formData.risksMinorEnglish}
                      onChange={(val) => setFormData({...formData, risksMinorEnglish: val})}
                      helperText="Describe what has been found that causes worry and how you, as a researcher, ensure that it will be prevented from happening."
                      maxWords={300}
                      required
                    />
                  )}

                  {(minorLanguage === 'tagalog' || minorLanguage === 'both') && (
                    <RichTextEditor
                      label="Mga Panganib (Tagalog Version)"
                      value={formData.risksMinorTagalog}
                      onChange={(val) => setFormData({...formData, risksMinorTagalog: val})}
                      helperText="Ilarawan ang mga panganib at kung paano ito maiiwasan."
                      maxWords={300}
                      required
                    />
                  )}
                </div>

                {/* Possible Benefits */}
                <div className="space-y-4">
                  <h5 className="font-bold text-[#1E293B] text-sm sm:text-base" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Possible Benefits for the Participants
                  </h5>
                  
                  {(minorLanguage === 'english' || minorLanguage === 'both') && (
                    <RichTextEditor
                      label="Benefits (English Version)"
                      value={formData.benefitsMinorEnglish}
                      onChange={(val) => setFormData({...formData, benefitsMinorEnglish: val})}
                      helperText="Describe any benefits to the child (and to others)."
                      maxWords={300}
                      required
                    />
                  )}

                  {(minorLanguage === 'tagalog' || minorLanguage === 'both') && (
                    <RichTextEditor
                      label="Mga Benepisyo (Tagalog Version)"
                      value={formData.benefitsMinorTagalog}
                      onChange={(val) => setFormData({...formData, benefitsMinorTagalog: val})}
                      helperText="Ilarawan ang mga benepisyo para sa bata."
                      maxWords={300}
                      required
                    />
                  )}
                </div>

                {/* Confidentiality */}
                <div className="space-y-4">
                  <h5 className="font-bold text-[#1E293B] text-sm sm:text-base" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Confidentiality
                  </h5>
                  
                  {(minorLanguage === 'english' || minorLanguage === 'both') && (
                    <RichTextEditor
                      label="Confidentiality (English Version)"
                      value={formData.confidentialityMinorEnglish}
                      onChange={(val) => setFormData({...formData, confidentialityMinorEnglish: val})}
                      helperText="State the limits and the scope of confidentiality of this research."
                      maxWords={300}
                      required
                    />
                  )}

                  {(minorLanguage === 'tagalog' || minorLanguage === 'both') && (
                    <RichTextEditor
                      label="Pagiging Kumpidensyal (Tagalog Version)"
                      value={formData.confidentialityMinorTagalog}
                      onChange={(val) => setFormData({...formData, confidentialityMinorTagalog: val})}
                      helperText="Ipahayag ang saklaw ng pagiging kumpidensyal."
                      maxWords={300}
                      required
                    />
                  )}
                </div>

                {/* Sharing the Findings */}
                <div className="space-y-4">
                  <h5 className="font-bold text-[#1E293B] text-sm sm:text-base" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Sharing the Findings
                  </h5>
                  
                  {(minorLanguage === 'english' || minorLanguage === 'both') && (
                    <RichTextEditor
                      label="Sharing Findings (English Version)"
                      value={formData.sharingFindingsEnglish}
                      onChange={(val) => setFormData({...formData, sharingFindingsEnglish: val})}
                      helperText="Explain how the research findings will be shared in which confidential information will remain confidential."
                      maxWords={200}
                      required
                    />
                  )}

                  {(minorLanguage === 'tagalog' || minorLanguage === 'both') && (
                    <RichTextEditor
                      label="Pagbabahagi ng mga Natuklasan (Tagalog Version)"
                      value={formData.sharingFindingsTagalog}
                      onChange={(val) => setFormData({...formData, sharingFindingsTagalog: val})}
                      helperText="Ipaliwanag kung paano ibabahagi ang mga natuklasan."
                      maxWords={200}
                      required
                    />
                  )}
                </div>

                {/* PART 2: CERTIFICATE OF ASSENT */}
                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-[#FFD700] p-4 rounded-lg mt-8">
                  <h5 className="font-bold text-[#1E293B] text-sm sm:text-base mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    PART 2: CERTIFICATE OF ASSENT
                  </h5>
                  <p className="text-xs text-[#475569]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Fill in the specific details about your study in the text below.
                  </p>
                </div>

                <div className="space-y-4">
                  {(minorLanguage === 'english' || minorLanguage === 'both') && (
                    <RichTextEditor
                      label="Certificate of Assent Statement (English Version)"
                      value={formData.certificateAssentEnglish}
                      onChange={(val) => setFormData({...formData, certificateAssentEnglish: val})}
                      helperText="Complete the certificate statement with your study details. Include sections covering: research description, confidentiality assurance, risks, benefits, and participants' rights."
                      maxWords={800}
                      placeholder="I am/we are (name of the researchers) from the University of Makati, currently working on a study to figure out..."
                      required
                    />
                  )}

                  {(minorLanguage === 'tagalog' || minorLanguage === 'both') && (
                    <RichTextEditor
                      label="Sertipiko ng Pahintulot (Tagalog Version)"
                      value={formData.certificateAssentTagalog}
                      onChange={(val) => setFormData({...formData, certificateAssentTagalog: val})}
                      helperText="Kumpletuhin ang pahayag ng sertipiko kasama ang mga detalye ng iyong pag-aaral."
                      maxWords={800}
                      placeholder="Ako/kami po si (pangalan ng mga mananaliksik) mula sa University of Makati ay kasalukuyang gumagawa ng pag-aaral..."
                      required
                    />
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Contact Information - Only show once outside conditional blocks */}
        {consentType && (adultLanguage || minorLanguage) && (
          <div className="space-y-4">
            <h5 className="font-bold text-[#1E293B] text-sm sm:text-base" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Contact Information
            </h5>
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
        {consentType && (adultLanguage || minorLanguage) && (
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-[#FFD700] p-4 sm:p-6 rounded-lg">
            <h4 className="font-bold text-[#1E293B] mb-2 text-sm sm:text-base" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Important Note:
            </h4>
            <p className="text-xs sm:text-sm text-[#475569]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              {consentType === 'adult' && adultLanguage === 'both' && 'Ensure all sections are provided in both English and Tagalog to accommodate all participants. The consent form must clearly communicate the study details, risks, and benefits.'}
              {consentType === 'adult' && adultLanguage !== 'both' && `Complete all sections in ${adultLanguage === 'english' ? 'English' : 'Tagalog'}. The consent form must clearly communicate the study details, risks, and benefits.`}
              {consentType === 'minor' && minorLanguage === 'both' && 'Use simple, child-friendly language appropriate for ages 12-15. Include both English and Tagalog text to ensure understanding. Parents/guardians must also provide consent.'}
              {consentType === 'minor' && minorLanguage !== 'both' && `Use simple, child-friendly language appropriate for ages 12-15 in ${minorLanguage === 'english' ? 'English' : 'Tagalog'}. Parents/guardians must also provide consent.`}
              {consentType === 'both' && 'Complete both adult and minor consent forms thoroughly in your selected languages for maximum accessibility.'}
            </p>
          </div>
        )}
      </form>
    </SubmissionStepLayout>
  );
}
