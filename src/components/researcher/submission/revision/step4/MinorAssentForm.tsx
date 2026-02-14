import RichTextEditor from '@/components/researcher/submission/RichTextEditor';
import { RadioGroup } from '@/components/researcher/submission/FormComponents';

interface MinorFormProps {
  minorLanguage: 'english' | 'tagalog' | 'both' | '';
  setMinorLanguage: (val: 'english' | 'tagalog' | 'both') => void;
  formData: any;
  setFormData: (val: any) => void;
}

export default function MinorAssentForm({
  minorLanguage,
  setMinorLanguage,
  formData,
  setFormData,
}: MinorFormProps) {

  const sections = [
    { id: 1, key: 'IntroductionMinor', labelEng: 'Introduction', labelTag: 'Panimula', helpEng: 'Provide brief description...', helpTag: 'Magbigay ng maikling...', maxWords: 400 },
    { id: 2, key: 'PurposeMinor', labelEng: 'Purpose of Research', labelTag: 'Layunin', helpEng: 'Explain purpose...', helpTag: 'Ipaliwanag ang layunin...', maxWords: 300 },
    { id: 3, key: 'ChoiceOfParticipants', labelEng: 'Choice of Participants', labelTag: 'Pagpili ng mga Kalahok', helpEng: 'Explain why chosen...', helpTag: 'Ipaliwanag kung bakit...', maxWords: 200 },
    { id: 4, key: 'VoluntarinessMinor', labelEng: 'Voluntariness of Participation', labelTag: 'Kusang-loob na Paglahok', helpEng: 'State voluntary...', helpTag: 'Ipahayag na kusang-loob...', maxWords: 300 },
    { id: 5, key: 'ProceduresMinor', labelEng: 'Procedures', labelTag: 'Mga Proseso', helpEng: 'Explain procedures...', helpTag: 'Ipaliwanag ang mga proseso...', maxWords: 400 },
    { id: 6, key: 'RisksMinor', labelEng: 'Risk and Inconveniences', labelTag: 'Mga Panganib', helpEng: 'Describe risks...', helpTag: 'Ilarawan ang panganib...', maxWords: 300 },
    { id: 7, key: 'BenefitsMinor', labelEng: 'Possible Benefits', labelTag: 'Mga Benepisyo', helpEng: 'Describe benefits...', helpTag: 'Ilarawan ang benepisyo...', maxWords: 300 },
    { id: 8, key: 'ConfidentialityMinor', labelEng: 'Confidentiality', labelTag: 'Pagiging Kumpidensyal', helpEng: 'State limits...', helpTag: 'Ipahayag ang saklaw...', maxWords: 300 },
    { id: 9, key: 'SharingFindings', labelEng: 'Sharing the Findings', labelTag: 'Pagbabahagi ng mga Natuklasan', helpEng: 'Explain sharing...', helpTag: 'Ipaliwanag kung paano...', maxWords: 200 },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 pt-4 border-t border-gray-200">
      <div className="bg-gradient-to-r from-orange-50 to-orange-100/50 border-l-4 border-orange-500 p-4 sm:p-5 rounded-r-lg">
        <h4 className="font-bold text-[#071139] text-base sm:text-lg" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Informed Assent Form (For Minors 12-15 years old)
        </h4>
        <p className="text-xs sm:text-sm text-gray-700 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Select the language(s) you will provide for minor participants.
        </p>
      </div>

      <div>
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
            <div className="bg-gradient-to-r from-orange-100 to-orange-50 border-l-4 border-orange-600 p-4 sm:p-5 rounded-r-lg">
                <h5 className="font-bold text-[#071139] text-sm sm:text-base uppercase tracking-wide" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    PART 1: INFORMATION SHEET
                </h5>
            </div>

            {sections.map((section) => {
                const engKey = `${section.key.charAt(0).toLowerCase() + section.key.slice(1)}English`;
                const tagKey = `${section.key.charAt(0).toLowerCase() + section.key.slice(1)}Tagalog`;

                return (
                    <div key={section.id} className="space-y-4">
                        <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                            <span className="bg-gradient-to-br from-orange-500 to-orange-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm shadow-md">{section.id}</span>
                            {section.labelEng}
                        </h5>
                        {(minorLanguage === 'english' || minorLanguage === 'both') && (
                            <RichTextEditor
                                label={`${section.labelEng} (English Version)`}
                                value={formData[engKey]}
                                hideImageUpload={true}
                                onChange={(val) => setFormData({ ...formData, [engKey]: val })}
                                helperText={section.helpEng}
                                maxWords={section.maxWords}
                                required
                            />
                        )}
                        {(minorLanguage === 'tagalog' || minorLanguage === 'both') && (
                            <RichTextEditor
                                label={`${section.labelTag} (Tagalog Version)`}
                                value={formData[tagKey]}
                                hideImageUpload={true}
                                onChange={(val) => setFormData({ ...formData, [tagKey]: val })}
                                helperText={section.helpTag}
                                maxWords={section.maxWords}
                                required
                            />
                        )}
                    </div>
                );
            })}
        </>
      )}
    </div>
  );
}
