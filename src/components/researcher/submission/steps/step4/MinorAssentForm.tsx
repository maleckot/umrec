'use client';
import { FileText } from 'lucide-react';
import RichTextEditor from '@/components/researcher/submission/RichTextEditor';
import { RadioGroup } from '@/components/researcher/submission/FormComponents';

interface MinorAssentFormProps {
  minorLanguage: string;
  setMinorLanguage: (val: string) => void;
  formData: any;
  setFormData: (data: any) => void;
}

export default function MinorAssentForm({
  minorLanguage,
  setMinorLanguage,
  formData,
  setFormData
}: MinorAssentFormProps) {
  
  return (
    <div className="space-y-6 sm:space-y-8 pt-8 border-t-2 border-dashed border-gray-300">
      <div className="bg-gradient-to-r from-green-50 to-green-100/50 border-l-4 border-green-500 p-4 sm:p-5 rounded-r-lg">
        <h4 className="font-bold text-[#071139] text-sm sm:text-base mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Informed Assent Form (Minors 12-15 years old)
        </h4>
        <p className="text-xs sm:text-sm text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Select the language(s) you will provide for minor participants.
        </p>
      </div>

      {/* Language Selection for Minors */}
      <div>
        <RadioGroup
          label="Select Language for Minor Assent Form"
          options={[
            { value: 'english', label: 'English Only' },
            { value: 'tagalog', label: 'Tagalog Only' },
            { value: 'both', label: 'Both English and Tagalog' }
          ]}
          selected={minorLanguage}
          onChange={(val) => setMinorLanguage(val as string)}
          required
        />
      </div>

      {minorLanguage && (
        <>
          {/* 1. Introduction - Minor */}
          <div className="space-y-4">
            <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              <span className="bg-[#071139] text-white w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0">1</span>
              Introduction
            </h5>
            
            {(minorLanguage === 'english' || minorLanguage === 'both') && (
              <RichTextEditor
                label="Introduction - Minor (English)"
                value={formData.introductionMinorEnglish}
                hideImageUpload={true}
                onChange={(val) => setFormData({...formData, introductionMinorEnglish: val})}
                helperText="Introduce yourself and explain that you are doing a study."
                required
              />
            )}

            {(minorLanguage === 'tagalog' || minorLanguage === 'both') && (
              <RichTextEditor
                label="Panimula - Minor (Tagalog)"
                value={formData.introductionMinorTagalog}
                hideImageUpload={true}
                onChange={(val) => setFormData({...formData, introductionMinorTagalog: val})}
                helperText="Magpakilala at ipaliwanag na nagsasagawa ka ng pag-aaral."
                required
              />
            )}
          </div>

          {/* 2. Purpose - Minor */}
          <div className="space-y-4">
            <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              <span className="bg-[#071139] text-white w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0">2</span>
              Purpose of the Research
            </h5>
            
            {(minorLanguage === 'english' || minorLanguage === 'both') && (
              <RichTextEditor
                label="Purpose - Minor (English)"
                value={formData.purposeMinorEnglish}
                hideImageUpload={true}
                onChange={(val) => setFormData({...formData, purposeMinorEnglish: val})}
                helperText="Explain why you are doing this study in simple terms."
                required
              />
            )}

            {(minorLanguage === 'tagalog' || minorLanguage === 'both') && (
              <RichTextEditor
                label="Layunin - Minor (Tagalog)"
                value={formData.purposeMinorTagalog}
                hideImageUpload={true}
                onChange={(val) => setFormData({...formData, purposeMinorTagalog: val})}
                helperText="Ipaliwanag kung bakit ginagawa ang pag-aaral sa simpleng salita."
                required
              />
            )}
          </div>

          {/* 3. Choice of Participants - Minor */}
          <div className="space-y-4">
            <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              <span className="bg-[#071139] text-white w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0">3</span>
              Choice of Participants
            </h5>
            
            {(minorLanguage === 'english' || minorLanguage === 'both') && (
              <RichTextEditor
                label="Choice of Participants - Minor (English)"
                value={formData.choiceOfParticipantsEnglish}
                hideImageUpload={true}
                onChange={(val) => setFormData({...formData, choiceOfParticipantsEnglish: val})}
                helperText="Explain why the minor is being asked to participate."
                required
              />
            )}

            {(minorLanguage === 'tagalog' || minorLanguage === 'both') && (
              <RichTextEditor
                label="Pagpili ng Kalahok - Minor (Tagalog)"
                value={formData.choiceOfParticipantsTagalog}
                hideImageUpload={true}
                onChange={(val) => setFormData({...formData, choiceOfParticipantsTagalog: val})}
                helperText="Ipaliwanag kung bakit hinihiling ang partisipasyon ng menor de edad."
                required
              />
            )}
          </div>

          {/* 4. Voluntariness - Minor */}
          <div className="space-y-4">
            <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              <span className="bg-[#071139] text-white w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0">4</span>
              Participation is Voluntary
            </h5>
            
            {(minorLanguage === 'english' || minorLanguage === 'both') && (
              <RichTextEditor
                label="Voluntariness - Minor (English)"
                value={formData.voluntarinessMinorEnglish}
                hideImageUpload={true}
                onChange={(val) => setFormData({...formData, voluntarinessMinorEnglish: val})}
                helperText="Explain that they do not have to participate if they do not want to."
                required
              />
            )}

            {(minorLanguage === 'tagalog' || minorLanguage === 'both') && (
              <RichTextEditor
                label="Kusang-loob - Minor (Tagalog)"
                value={formData.voluntarinessMinorTagalog}
                hideImageUpload={true}
                onChange={(val) => setFormData({...formData, voluntarinessMinorTagalog: val})}
                helperText="Ipaliwanag na hindi nila kailangang lumahok kung ayaw nila."
                required
              />
            )}
          </div>

          {/* 5. Procedures - Minor */}
          <div className="space-y-4">
            <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              <span className="bg-[#071139] text-white w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0">5</span>
              What will happen (Procedures)
            </h5>
            
            {(minorLanguage === 'english' || minorLanguage === 'both') && (
              <RichTextEditor
                label="Procedures - Minor (English)"
                value={formData.proceduresMinorEnglish}
                hideImageUpload={true}
                onChange={(val) => setFormData({...formData, proceduresMinorEnglish: val})}
                helperText="Describe what will happen to the participant in simple terms."
                required
              />
            )}

            {(minorLanguage === 'tagalog' || minorLanguage === 'both') && (
              <RichTextEditor
                label="Mga Proseso - Minor (Tagalog)"
                value={formData.proceduresMinorTagalog}
                hideImageUpload={true}
                onChange={(val) => setFormData({...formData, proceduresMinorTagalog: val})}
                helperText="Ilarawan kung ano ang mangyayari sa kalahok sa simpleng salita."
                required
              />
            )}
          </div>

          {/* 6. Risks - Minor */}
          <div className="space-y-4">
            <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              <span className="bg-[#071139] text-white w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0">6</span>
              Risks
            </h5>
            
            {(minorLanguage === 'english' || minorLanguage === 'both') && (
              <RichTextEditor
                label="Risks - Minor (English)"
                value={formData.risksMinorEnglish}
                hideImageUpload={true}
                onChange={(val) => setFormData({...formData, risksMinorEnglish: val})}
                helperText="Explain any bad things that might happen."
                required
              />
            )}

            {(minorLanguage === 'tagalog' || minorLanguage === 'both') && (
              <RichTextEditor
                label="Mga Panganib - Minor (Tagalog)"
                value={formData.risksMinorTagalog}
                hideImageUpload={true}
                onChange={(val) => setFormData({...formData, risksMinorTagalog: val})}
                helperText="Ipaliwanag ang anumang masamang maaaring mangyari."
                required
              />
            )}
          </div>

          {/* 7. Benefits - Minor */}
          <div className="space-y-4">
            <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              <span className="bg-[#071139] text-white w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0">7</span>
              Benefits
            </h5>
            
            {(minorLanguage === 'english' || minorLanguage === 'both') && (
              <RichTextEditor
                label="Benefits - Minor (English)"
                value={formData.benefitsMinorEnglish}
                hideImageUpload={true}
                onChange={(val) => setFormData({...formData, benefitsMinorEnglish: val})}
                helperText="Explain any good things that might happen."
                required
              />
            )}

            {(minorLanguage === 'tagalog' || minorLanguage === 'both') && (
              <RichTextEditor
                label="Mga Benepisyo - Minor (Tagalog)"
                value={formData.benefitsMinorTagalog}
                hideImageUpload={true}
                onChange={(val) => setFormData({...formData, benefitsMinorTagalog: val})}
                helperText="Ipaliwanag ang anumang mabuting maaaring mangyari."
                required
              />
            )}
          </div>

          {/* 8. Confidentiality - Minor */}
          <div className="space-y-4">
            <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              <span className="bg-[#071139] text-white w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0">8</span>
              Confidentiality
            </h5>
            
            {(minorLanguage === 'english' || minorLanguage === 'both') && (
              <RichTextEditor
                label="Confidentiality - Minor (English)"
                value={formData.confidentialityMinorEnglish}
                hideImageUpload={true}
                onChange={(val) => setFormData({...formData, confidentialityMinorEnglish: val})}
                helperText="Explain that no one else will know what they say."
                required
              />
            )}

            {(minorLanguage === 'tagalog' || minorLanguage === 'both') && (
              <RichTextEditor
                label="Kumpidensyal - Minor (Tagalog)"
                value={formData.confidentialityMinorTagalog}
                hideImageUpload={true}
                onChange={(val) => setFormData({...formData, confidentialityMinorTagalog: val})}
                helperText="Ipaliwanag na walang ibang makakaalam ng kanilang sasabihin."
                required
              />
            )}
          </div>

          {/* 9. Sharing Findings - Minor */}
          <div className="space-y-4">
            <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              <span className="bg-[#071139] text-white w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0">9</span>
              Sharing the Findings
            </h5>
            
            {(minorLanguage === 'english' || minorLanguage === 'both') && (
              <RichTextEditor
                label="Sharing Findings - Minor (English)"
                value={formData.sharingFindingsEnglish}
                hideImageUpload={true}
                onChange={(val) => setFormData({...formData, sharingFindingsEnglish: val})}
                helperText="Explain if you will tell them what you find out."
                required
              />
            )}

            {(minorLanguage === 'tagalog' || minorLanguage === 'both') && (
              <RichTextEditor
                label="Pagbabahagi - Minor (Tagalog)"
                value={formData.sharingFindingsTagalog}
                hideImageUpload={true}
                onChange={(val) => setFormData({...formData, sharingFindingsTagalog: val})}
                helperText="Ipaliwanag kung sasabihin mo sa kanila ang iyong natuklasan."
                required
              />
            )}
          </div>

          {/* 10. Contact Person - Minor */}
          <div className="space-y-4">
            <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              <span className="bg-[#071139] text-white w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0">10</span>
              Who to Contact
            </h5>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-[#071139] mb-1 block" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Name of Contact Person
                </label>
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none text-[#071139] font-medium placeholder-gray-400"
                  placeholder="e.g., Juan Dela Cruz"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                />
              </div>
              <div>
                <label className="text-sm font-bold text-[#071139] mb-1 block" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Contact Number
                </label>
                <input
                  type="text"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none text-[#071139] font-medium placeholder-gray-400"
                  placeholder="e.g., 09123456789"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
