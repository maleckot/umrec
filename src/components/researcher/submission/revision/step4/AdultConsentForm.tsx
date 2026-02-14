import { FileText, AlertCircle } from 'lucide-react';
import RichTextEditor from '@/components/researcher/submission/RichTextEditor';
import { RadioGroup } from '@/components/researcher/submission/FormComponents';

interface AdultFormProps {
  adultLanguage: 'english' | 'tagalog' | 'both' | '';
  setAdultLanguage: (val: 'english' | 'tagalog' | 'both') => void;
  formData: any;
  setFormData: (val: any) => void;
  step2Info: any;
  step3Data: any;
}

export default function AdultConsentForm({
  adultLanguage,
  setAdultLanguage,
  formData,
  setFormData,
  step2Info,
  step3Data,
}: AdultFormProps) {

  const sections = [
      { id: 1, key: 'Introduction', labelEng: 'Introduction', labelTag: 'Panimula', helpEng: 'Briefly introduce...', helpTag: 'Ipakilala ang mga mananaliksik...' },
      { id: 2, key: 'Purpose', labelEng: 'Purpose of the Research', labelTag: 'Layunin ng Pananaliksik', helpEng: 'Explain the research question...', helpTag: 'Ipaliwanag ang layunin...', maxWords: 500 },
      { id: 3, key: 'ResearchIntervention', labelEng: 'Type of Research Intervention', labelTag: 'Uri ng Interbensyon', helpEng: 'Briefly state the intervention...', helpTag: 'Banggitin ang uri...', maxWords: 300 },
      { id: 4, key: 'ParticipantSelection', labelEng: 'Participant Selection', labelTag: 'Pagpili ng Kalahok', helpEng: 'Indicate why chosen...', helpTag: 'Ipaliwanag kung bakit...', maxWords: 300 },
      { id: 5, key: 'VoluntaryParticipation', labelEng: 'Voluntary Participation', labelTag: 'Kusang-loob na Paglahok', helpEng: 'Indicate clearly...', helpTag: 'Ipahayag nang malinaw...', maxWords: 300 },
      { id: 6, key: 'Procedures', labelEng: 'Procedures', labelTag: 'Mga Pamamaraan', helpEng: 'Provide introduction...', helpTag: 'Ipaliwanag ang format...', maxWords: 500 },
      { id: 7, key: 'Duration', labelEng: 'Duration', labelTag: 'Tagal ng Pag-aaral', helpEng: 'Include statement...', helpTag: 'Ipahayag ang tagal...', maxWords: 200 },
      { id: 8, key: 'Risks', labelEng: 'Risks', labelTag: 'Mga Panganib', helpEng: 'Explain risks...', helpTag: 'Ilarawan ang panganib...' },
      { id: 9, key: 'Benefits', labelEng: 'Benefits', labelTag: 'Mga Benepisyo', helpEng: 'Benefits to individual...', helpTag: 'Ilarawan ang benepisyo...' },
      { id: 10, key: 'Reimbursements', labelEng: 'Reimbursements', labelTag: 'Kabayaran', helpEng: 'State clearly...', helpTag: 'Ipahayag kung may kabayaran...', maxWords: 200 },
      { id: 11, key: 'Confidentiality', labelEng: 'Confidentiality', labelTag: 'Pagiging Kumpidensyal', helpEng: 'Explain confidentiality...', helpTag: 'Ipaliwanag ang kumpidensyal...' },
      { id: 12, key: 'SharingResults', labelEng: 'Sharing the Results', labelTag: 'Pagbabahagi ng mga Resulta', helpEng: 'Plan and timeline...', helpTag: 'Ipaliwanag kung paano...', maxWords: 300 },
      { id: 13, key: 'RightToRefuse', labelEng: 'Right to Refuse or Withdraw', labelTag: 'Karapatan na Tumanggi o Umurong', helpEng: 'Reiterate voluntary...', helpTag: 'Ipahayag muli...', maxWords: 300 },
      { id: 14, key: 'WhoToContact', labelEng: 'Who to Contact', labelTag: 'Sino ang Makikipag-ugnayan', helpEng: 'Contact info...', helpTag: 'Ibigay ang contact info...', maxWords: 300 },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 pt-4 border-t border-gray-200">
        <div className="bg-gradient-to-r from-orange-50 to-orange-100/50 border-l-4 border-orange-500 p-4 sm:p-5 rounded-r-lg">
        <h4 className="font-bold text-[#071139] text-base sm:text-lg" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Informed Consent Form (Adult Participants)
        </h4>
        <p className="text-xs sm:text-sm text-gray-700 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Select the language(s) you will provide for adult participants.
        </p>
        </div>

        <div>
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
            {/* PARTICIPANT GROUP IDENTITY */}
            <div>
            <label htmlFor="participantGroupIdentity" className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
                <FileText size={16} className="text-white" />
                </div>
                Informed Consent Form for: <span className="text-red-500">*</span>
            </label>
            <input
                id="participantGroupIdentity"
                type="text"
                value={formData.participantGroupIdentity}
                onChange={(e) => setFormData({ ...formData, participantGroupIdentity: e.target.value })}
                placeholder="e.g., clients, patients, community leaders"
                className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none text-[#071139] font-medium transition-all duration-300 hover:border-gray-400"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
                required
            />
            <p className="text-xs text-gray-600 mt-2 flex items-start gap-1 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                <AlertCircle size={14} className="flex-shrink-0 mt-0.5 text-orange-500" />
                Identity of the particular group of individuals for whom this consent is intended.
            </p>
            </div>

            {/* Step 2 Info Display */}
            {step2Info.title && (
            <div className="bg-orange-50/30 border border-orange-200 rounded-xl p-4 sm:p-6">
                <h6 className="font-bold text-[#071139] text-sm mb-4 flex items-center gap-2">
                <FileText size={18} className="text-orange-600" />
                Project and Researcher Information (from Step 2)
                </h6>
                <div className="space-y-3 text-xs sm:text-sm text-gray-800 font-medium">
                <div>
                    <p className="font-bold text-[#071139]">[Name of Project and Research]</p>
                    <p className="text-gray-700">{step2Info.title}</p>
                </div>
                <div>
                    <p className="font-bold text-[#071139]">Project Leader</p>
                    <p className="text-gray-700">{step2Info.projectLeader}</p>
                </div>
                </div>
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded flex items-start gap-2">
                {/* Fixed line below: removed escaped quotes and backslashes */}
                <AlertCircle size={16} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-800 font-bold">This information will automatically appear at the top of your consent form.</p>
                </div>
            </div>
            )}

            <div className="bg-gradient-to-r from-orange-100 to-orange-50 border-l-4 border-orange-600 p-4 sm:p-5 rounded-r-lg mt-8">
            <h5 className="font-bold text-[#071139] text-base sm:text-lg uppercase tracking-wide" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Part I: Information Sheet
            </h5>
            </div>

            {/* Dynamic Sections */}
            {sections.map((section) => {
                const engKey = `${section.key.charAt(0).toLowerCase() + section.key.slice(1)}English`;
                const tagKey = `${section.key.charAt(0).toLowerCase() + section.key.slice(1)}Tagalog`;

                return (
                    <div key={section.id} className="space-y-4">
                        <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                            <span className="bg-gradient-to-br from-orange-500 to-orange-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm shadow-md">{section.id}</span>
                            {section.labelEng}
                        </h5>
                        {(adultLanguage === 'english' || adultLanguage === 'both') && (
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
                        {(adultLanguage === 'tagalog' || adultLanguage === 'both') && (
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

            {/* Conforme Section */}
            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 sm:p-5 rounded-r-lg mt-8">
                <h6 className="font-bold text-[#071139] text-sm mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Conforme:
                </h6>
                <p className="text-xs text-gray-700 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Researcher information and signatures (from Step 3)
                </p>
            </div>

            {step3Data && step3Data.signatures && step3Data.signatures.length > 0 ? (
                <div className="bg-orange-50/30 border border-orange-200 rounded-xl p-4 sm:p-6">
                    <div className="space-y-6">
                    {step3Data.signatures.map((sig: any, index: number) => (
                        <div key={index} className="border-b border-orange-200 pb-6 last:border-b-0">
                        <div className="bg-white p-5 rounded-lg shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <p className="text-xs font-bold text-[#071139] mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                                Print Name of Researcher:
                                </p>
                                <p className="text-sm text-[#071139] font-bold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                                {sig.name || '________________________'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-[#071139] mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                                Date: [MM/DD/YYYY]
                                </p>
                                <p className="text-sm text-[#071139] font-bold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                                {sig.date ? new Date(sig.date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : '_____________________'}
                                </p>
                            </div>
                            </div>
                            {sig.signatureDataUrl && (
                            <div className="mt-4 pt-4 border-t border-orange-200">
                                <p className="text-xs font-bold text-[#071139] mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                                Signature of Researcher:
                                </p>
                                <div className="border-2 border-orange-300 rounded-lg p-3 bg-white inline-block shadow-sm">
                                <img
                                    src={sig.signatureDataUrl}
                                    alt={`Signature of ${sig.name}`}
                                    className="max-h-16"
                                />
                                </div>
                            </div>
                            )}
                        </div>
                        </div>
                    ))}
                    </div>
                </div>
            ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                    <AlertCircle size={18} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-yellow-800 font-bold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        No signatures found from Step 3. This data will be populated from your Step 3 submission.
                    </p>
                    </div>
                </div>
            )}
        </>
        )}
    </div>
  );
}
