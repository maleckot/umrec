'use client';
import { FileText, AlertCircle } from 'lucide-react';
import RichTextEditor from '@/components/researcher/submission/RichTextEditor';
import { RadioGroup } from '@/components/researcher/submission/FormComponents';

interface AdultConsentFormProps {
  adultLanguage: string;
  setAdultLanguage: (val: string) => void;
  formData: any;
  setFormData: (data: any) => void;
  step2Data: any;
  step3Data: any;
}

export default function AdultConsentForm({
  adultLanguage,
  setAdultLanguage,
  formData,
  setFormData,
  step2Data,
  step3Data
}: AdultConsentFormProps) {
  
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 border-l-4 border-blue-500 p-4 sm:p-5 rounded-r-lg">
        <h4 className="font-bold text-[#071139] text-sm sm:text-base mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Informed Consent Form (Adult Participants)
        </h4>
        <p className="text-xs sm:text-sm text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Select the language(s) you will provide for adult participants.
        </p>
      </div>

      {/* Language Selection for Adults */}
      <div>
        <RadioGroup
          label="Select Language for Adult Consent Form"
          options={[
            { value: 'english', label: 'English Only' },
            { value: 'tagalog', label: 'Tagalog Only' },
            { value: 'both', label: 'Both English and Tagalog' }
          ]}
          selected={adultLanguage}
          onChange={(val) => setAdultLanguage(val as string)}
          required
        />
      </div>

      {adultLanguage && (
        <>
          {/* HEADER SECTION */}
          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 sm:p-5 rounded-r-lg">
            <h5 className="font-bold text-[#071139] text-sm sm:text-base mb-1 uppercase tracking-wide" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Header Information
            </h5>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              This section appears at the top of your consent form
            </p>
          </div>

          {/* Participant Group Identity */}
          <div>
            <label 
              htmlFor="participantGroupIdentity"
              className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]" 
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md flex-shrink-0">
                <FileText size={18} className="text-[#F7D117]" />
              </div>
              Informed Consent Form for: <span className="text-red-500">*</span>
            </label>
            <input
              id="participantGroupIdentity"
              type="text"
              value={formData.participantGroupIdentity}
              onChange={(e) => setFormData({...formData, participantGroupIdentity: e.target.value})}
              placeholder="e.g., clients, patients, community leaders, service providers"
              className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none text-[#071139] font-medium transition-all duration-300 hover:border-gray-400 placeholder-gray-400"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
              required
            />
            <p className="text-xs text-gray-600 mt-2 flex items-start gap-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              <AlertCircle size={14} className="flex-shrink-0 mt-0.5 text-blue-500" />
              Identity of the particular group of individuals in the project for whom this consent is intended
            </p>
          </div>

          {/* Display Project and Researcher Information from Step 2 */}
          {step2Data && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-6">
              <h6 className="font-bold text-[#071139] text-sm mb-4 flex items-center gap-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                <FileText size={18} className="text-[#071139]" />
                Project and Researcher Information (from Step 2)
              </h6>
              <div className="space-y-4 text-xs sm:text-sm text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {/* Principal Investigator */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="mb-2"><strong className="text-[#071139]">[Name of Principal Investigator]</strong></div>
                  <div className="mb-3 text-[#071139]">
                    {step2Data.researcherFirstName} {step2Data.researcherMiddleName} {step2Data.researcherLastName}
                  </div>
                  <div className="mb-2"><strong className="text-[#071139]">[Name of Organization]</strong></div>
                  <div className="mb-3 text-[#071139]">{step2Data.institution || 'N/A'}</div>
                  <div className="mb-2"><strong className="text-[#071139]">[Contact Number and Email]</strong></div>
                  <div className="text-[#071139]">{step2Data.mobileNo || 'N/A'} | {step2Data.email || 'N/A'}</div>
                </div>
                
                {/* Project Title */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <strong className="text-[#071139]">[Name of Project and Research]</strong>
                  <div className="mt-2 text-[#071139]">{step2Data.title || 'Not provided'}</div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-700 flex items-start gap-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                  This information will automatically appear at the top of your consent form.
                </p>
              </div>
            </div>
          )}

          {/* PART I: INFORMATION SHEET Header */}
          <div className="bg-gradient-to-r from-[#071139]/10 to-blue-100/50 border-l-4 border-[#071139] p-4 sm:p-5 rounded-r-lg mt-8">
            <h5 className="font-bold text-[#071139] text-base sm:text-lg uppercase tracking-wide" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Part I: Information Sheet
            </h5>
          </div>

          {/* 1. Introduction */}
          <div className="space-y-4">
            <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              <span className="bg-[#071139] text-white w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0">1</span>
              Introduction
            </h5>
            
            {(adultLanguage === 'english' || adultLanguage === 'both') && (
              <RichTextEditor
                label="Introduction (English Version)"
                value={formData.introductionEnglish}
                onChange={(val) => setFormData({...formData, introductionEnglish: val})}
                hideImageUpload={true}
                helperText="Briefly introduce the proponent and concerned organization, emphasize that this is an invitation to participate in a study/research and that they can take time to reflect on whether they want to participate or not. Assure the participant that they do not understand some of the words or concepts, that these will be explained and that they can ask questions at any time."
                required
              />
            )}

            {(adultLanguage === 'tagalog' || adultLanguage === 'both') && (
              <RichTextEditor
                label="Panimula (Tagalog Version)"
                value={formData.introductionTagalog}
                hideImageUpload={true}
                onChange={(val) => setFormData({...formData, introductionTagalog: val})}
                helperText="Ipakilala ang mga mananaliksik at organisasyon, at ipahayag na ito ay isang imbitasyon na lumahok sa pag-aaral."
                required
              />
            )}
          </div>

          {/* 2. Purpose of the Research */}
          <div className="space-y-4">
            <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              <span className="bg-[#071139] text-white w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0">2</span>
              Purpose of the Research
            </h5>
            
            {(adultLanguage === 'english' || adultLanguage === 'both') && (
              <RichTextEditor
                label="Purpose (English Version)"
                value={formData.purposeEnglish}
                hideImageUpload={true}
                onChange={(val) => setFormData({...formData, purposeEnglish: val})}
                helperText="Explain the research question in ordinary, non-technical terms. Use local and simplified words rather than scientific terms and professional jargon. Consider local beliefs and knowledge when deciding how best to provide the information."
                maxWords={500}
                required
              />
            )}

            {(adultLanguage === 'tagalog' || adultLanguage === 'both') && (
              <RichTextEditor
                label="Layunin ng Pananaliksik (Tagalog Version)"
                value={formData.purposeTagalog}
                hideImageUpload={true}
                onChange={(val) => setFormData({...formData, purposeTagalog: val})}
                helperText="Ipaliwanag ang layunin ng pananaliksik sa simpleng wika."
                maxWords={500}
                required
              />
            )}
          </div>

          {/* 3. Type of Research Intervention */}
          <div className="space-y-4">
            <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              <span className="bg-[#071139] text-white w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0">3</span>
              Type of Research Intervention
            </h5>
            
            {(adultLanguage === 'english' || adultLanguage === 'both') && (
              <RichTextEditor
                label="Research Intervention (English Version)"
                value={formData.researchInterventionEnglish}
                hideImageUpload={true}
                onChange={(val) => setFormData({...formData, researchInterventionEnglish: val})}
                helperText="Briefly state the type of intervention that will be undertaken. This will be expanded upon in the procedures section but it may be helpful and less confusing to the participant if they know from the very beginning whether, for example, the research involves a vaccine, an interview, a questionnaire, or a series of finger pricks."
                maxWords={300}
                required
              />
            )}

            {(adultLanguage === 'tagalog' || adultLanguage === 'both') && (
              <RichTextEditor
                label="Uri ng Interbensyon (Tagalog Version)"
                value={formData.researchInterventionTagalog}
                onChange={(val) => setFormData({...formData, researchInterventionTagalog: val})}
                helperText="Banggitin ang uri ng interbensyon na gagawin sa pag-aaral."
                maxWords={300}
                hideImageUpload={true}
                required
              />
            )}
          </div>

          {/* 4. Participant Selection */}
          <div className="space-y-4">
            <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              <span className="bg-[#071139] text-white w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0">4</span>
              Participant Selection
            </h5>
            
            {(adultLanguage === 'english' || adultLanguage === 'both') && (
              <RichTextEditor
                label="Participant Selection (English Version)"
                value={formData.participantSelectionEnglish}
                onChange={(val) => setFormData({...formData, participantSelectionEnglish: val})}
                helperText="Indicate why you have chosen this person to participate in this research. People wonder why they have been chosen and may be fearful, confused or concerned."
                maxWords={300}
                hideImageUpload={true}
                required
              />
            )}

            {(adultLanguage === 'tagalog' || adultLanguage === 'both') && (
              <RichTextEditor
                label="Pagpili ng Kalahok (Tagalog Version)"
                value={formData.participantSelectionTagalog}
                onChange={(val) => setFormData({...formData, participantSelectionTagalog: val})}
                helperText="Ipaliwanag kung bakit napili ang taong ito bilang kalahok sa pananaliksik."
                maxWords={300}
                hideImageUpload={true}
                required
              />
            )}
          </div>

          {/* 5. Voluntary Participation */}
          <div className="space-y-4">
            <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              <span className="bg-[#071139] text-white w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0">5</span>
              Voluntary Participation
            </h5>
            
            {(adultLanguage === 'english' || adultLanguage === 'both') && (
              <RichTextEditor
                label="Voluntary Participation (English Version)"
                value={formData.voluntaryParticipationEnglish}
                onChange={(val) => setFormData({...formData, voluntaryParticipationEnglish: val})}
                helperText="Indicate clearly that they can choose to participate or not. State, only if it is applicable, that they will still receive all the services they usually do if they choose not to participate."
                maxWords={300}
                hideImageUpload={true}
                required
              />
            )}

            {(adultLanguage === 'tagalog' || adultLanguage === 'both') && (
              <RichTextEditor
                label="Kusang-loob na Paglahok (Tagalog Version)"
                value={formData.voluntaryParticipationTagalog}
                onChange={(val) => setFormData({...formData, voluntaryParticipationTagalog: val})}
                helperText="Ipahayag nang malinaw na ang paglahok ay kusang-loob at maaaring tumanggi o umurong anumang oras."
                maxWords={300}
                hideImageUpload={true}
                required
              />
            )}
          </div>

          {/* 6. Procedures */}
          <div className="space-y-4">
            <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              <span className="bg-[#071139] text-white w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0">6</span>
              Procedures
            </h5>
            
            {(adultLanguage === 'english' || adultLanguage === 'both') && (
              <RichTextEditor
                label="Procedures (English Version)"
                value={formData.proceduresEnglish}
                onChange={(val) => setFormData({...formData, proceduresEnglish: val})}
                helperText="Provide a brief introduction to the format of the research study and explain the type of questions that participants are likely to be asked."
                maxWords={500}
                hideImageUpload={true}
                required
              />
            )}

            {(adultLanguage === 'tagalog' || adultLanguage === 'both') && (
              <RichTextEditor
                label="Mga Pamamaraan (Tagalog Version)"
                value={formData.proceduresTagalog}
                onChange={(val) => setFormData({...formData, proceduresTagalog: val})}
                helperText="Ipaliwanag ang format ng pag-aaral at kung ano ang gagawin ng mga kalahok."
                maxWords={500}
                hideImageUpload={true}
                required
              />
            )}
          </div>

          {/* 7. Duration */}
          <div className="space-y-4">
            <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              <span className="bg-[#071139] text-white w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0">7</span>
              Duration
            </h5>
            
            {(adultLanguage === 'english' || adultLanguage === 'both') && (
              <RichTextEditor
                label="Duration (English Version)"
                value={formData.durationEnglish}
                onChange={(val) => setFormData({...formData, durationEnglish: val})}
                helperText="Include a statement about the time commitments of the research for the participant including both the duration of the research and follow-up, if relevant."
                maxWords={200}
                hideImageUpload={true}
                required
              />
            )}

            {(adultLanguage === 'tagalog' || adultLanguage === 'both') && (
              <RichTextEditor
                label="Tagal ng Pag-aaral (Tagalog Version)"
                value={formData.durationTagalog}
                onChange={(val) => setFormData({...formData, durationTagalog: val})}
                helperText="Ipahayag ang tagal ng paglahok sa pananaliksik."
                maxWords={200}
                hideImageUpload={true}
                required
              />
            )}
          </div>

          {/* 8. Risks */}
          <div className="space-y-4">
            <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              <span className="bg-[#071139] text-white w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0">8</span>
              Risks
            </h5>
            
            {(adultLanguage === 'english' || adultLanguage === 'both') && (
              <RichTextEditor
                label="Risks (English Version)"
                value={formData.risksEnglish}
                hideImageUpload={true}
                onChange={(val) => setFormData({...formData, risksEnglish: val})}
                helperText="Explain and describe any risks that can be anticipated or that are possible. The risks depend upon the nature and type of qualitative intervention."
                required
              />
            )}

            {(adultLanguage === 'tagalog' || adultLanguage === 'both') && (
              <RichTextEditor
                label="Mga Panganib (Tagalog Version)"
                value={formData.risksTagalog}
                hideImageUpload={true}
                onChange={(val) => setFormData({...formData, risksTagalog: val})}
                helperText="Ilarawan ang anumang mga panganib o abala na maaaring maranasan ng mga kalahok."
                required
              />
            )}
          </div>

          {/* 9. Benefits */}
          <div className="space-y-4">
            <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              <span className="bg-[#071139] text-white w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0">9</span>
              Benefits
            </h5>
            
            {(adultLanguage === 'english' || adultLanguage === 'both') && (
              <RichTextEditor
                label="Benefits (English Version)"
                value={formData.benefitsEnglish}
                hideImageUpload={true}
                onChange={(val) => setFormData({...formData, benefitsEnglish: val})}
                helperText="Benefits may be divided into benefits to the individual, benefits to the community in which the individual resides, and benefits to society as a whole."
                required
              />
            )}

            {(adultLanguage === 'tagalog' || adultLanguage === 'both') && (
              <RichTextEditor
                label="Mga Benepisyo (Tagalog Version)"
                value={formData.benefitsTagalog}
                hideImageUpload={true}
                onChange={(val) => setFormData({...formData, benefitsTagalog: val})}
                helperText="Ilarawan ang mga benepisyo para sa kalahok, komunidad, at lipunan."
                required
              />
            )}
          </div>

          {/* 10. Reimbursements */}
          <div className="space-y-4">
            <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              <span className="bg-[#071139] text-white w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0">10</span>
              Reimbursements
            </h5>
            
            {(adultLanguage === 'english' || adultLanguage === 'both') && (
              <RichTextEditor
                label="Reimbursements (English Version)"
                value={formData.reimbursementsEnglish}
                onChange={(val) => setFormData({...formData, reimbursementsEnglish: val})}
                helperText="State clearly that the participants will not receive payments beyond reimbursements for expenses incurred because of their participation."
                maxWords={200}
                hideImageUpload={true}
                required
              />
            )}

            {(adultLanguage === 'tagalog' || adultLanguage === 'both') && (
              <RichTextEditor
                label="Kabayaran (Tagalog Version)"
                value={formData.reimbursementsTagalog}
                onChange={(val) => setFormData({...formData, reimbursementsTagalog: val})}
                helperText="Ipahayag kung makakatanggap ng anumang kabayaran ang kalahok."
                maxWords={200}
                hideImageUpload={true}
                required
              />
            )}
          </div>

          {/* 11. Confidentiality */}
          <div className="space-y-4">
            <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              <span className="bg-[#071139] text-white w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0">11</span>
              Confidentiality
            </h5>
            
            {(adultLanguage === 'english' || adultLanguage === 'both') && (
              <RichTextEditor
                label="Confidentiality (English Version)"
                value={formData.confidentialityEnglish}
                hideImageUpload={true}
                onChange={(val) => setFormData({...formData, confidentialityEnglish: val})}
                helperText="Explain how the research team will maintain the confidentiality of data with respect to both information about the participant and information that the participant shares."
                required
              />
            )}

            {(adultLanguage === 'tagalog' || adultLanguage === 'both') && (
              <RichTextEditor
                label="Pagiging Kumpidensyal (Tagalog Version)"
                value={formData.confidentialityTagalog}
                hideImageUpload={true}
                onChange={(val) => setFormData({...formData, confidentialityTagalog: val})}
                helperText="Ipaliwanag kung paano papanatilihing kumpidensyal ang impormasyon ng mga kalahok."
                required
              />
            )}
          </div>

          {/* 12. Sharing the Results */}
          <div className="space-y-4">
            <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              <span className="bg-[#071139] text-white w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0">12</span>
              Sharing the Results
            </h5>
            
            {(adultLanguage === 'english' || adultLanguage === 'both') && (
              <RichTextEditor
                label="Sharing Results (English Version)"
                value={formData.sharingResultsEnglish}
                hideImageUpload={true}
                onChange={(val) => setFormData({...formData, sharingResultsEnglish: val})}
                helperText="If there is a plan and a timeline for the sharing of information, include the details. The participant may also be informed that the research findings will be shared more broadly."
                maxWords={300}
                required
              />
            )}

            {(adultLanguage === 'tagalog' || adultLanguage === 'both') && (
              <RichTextEditor
                label="Pagbabahagi ng mga Resulta (Tagalog Version)"
                value={formData.sharingResultsTagalog}
                hideImageUpload={true}
                onChange={(val) => setFormData({...formData, sharingResultsTagalog: val})}
                helperText="Ipaliwanag kung paano at kailan ibabahagi ang mga resulta ng pag-aaral."
                maxWords={300}
                required
              />
            )}
          </div>

          {/* 13. Right to Refuse or Withdraw */}
          <div className="space-y-4">
            <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              <span className="bg-[#071139] text-white w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0">13</span>
              Right to Refuse or Withdraw
            </h5>
            
            {(adultLanguage === 'english' || adultLanguage === 'both') && (
              <RichTextEditor
                label="Right to Refuse or Withdraw (English Version)"
                value={formData.rightToRefuseEnglish}
                hideImageUpload={true}
                onChange={(val) => setFormData({...formData, rightToRefuseEnglish: val})}
                helperText="Reiterate that participation is voluntary and includes the right to withdraw. Tailor this section to ensure that it fits for the group for whom one is seeking consent."
                maxWords={300}
                required
              />
            )}

            {(adultLanguage === 'tagalog' || adultLanguage === 'both') && (
              <RichTextEditor
                label="Karapatan na Tumanggi o Umurong (Tagalog Version)"
                value={formData.rightToRefuseTagalog}
                hideImageUpload={true}
                onChange={(val) => setFormData({...formData, rightToRefuseTagalog: val})}
                helperText="Ipahayag muli na ang paglahok ay kusang-loob at may karapatang umurong anumang oras."
                maxWords={300}
                required
              />
            )}
          </div>

          {/* 14. Who to Contact */}
          <div className="space-y-4">
            <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              <span className="bg-[#071139] text-white w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0">14</span>
              Who to Contact
            </h5>
            
            {(adultLanguage === 'english' || adultLanguage === 'both') && (
              <RichTextEditor
                label="Who to Contact (English Version)"
                value={formData.whoToContactEnglish}
                hideImageUpload={true}
                onChange={(val) => setFormData({...formData, whoToContactEnglish: val})}
                helperText="Provide the name and contact information of someone who is involved, informed and accessible. State also the name of the local REC that has approved the proposal."
                maxWords={300}
                required
              />
            )}

            {(adultLanguage === 'tagalog' || adultLanguage === 'both') && (
              <RichTextEditor
                label="Sino ang Makikipag-ugnayan (Tagalog Version)"
                value={formData.whoToContactTagalog}
                hideImageUpload={true}
                onChange={(val) => setFormData({...formData, whoToContactTagalog: val})}
                helperText="Ibigay ang pangalan at contact information ng mga taong maaaring lapitan para sa mga katanungan."
                maxWords={300}
                required
              />
            )}
          </div>

          {/* Conforme Section */}
          <div className="bg-green-50 border-l-4 border-green-500 p-4 sm:p-5 rounded-r-lg mt-8">
            <h6 className="font-bold text-[#071139] text-sm mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Conforme:
            </h6>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Researcher information and signatures
            </p>
          </div>

          {step3Data && step3Data.researchers && step3Data.researchers.length > 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-6">
              <div className="space-y-6">
                {step3Data.researchers.map((researcher: any, index: number) => (
                  <div key={index} className="border-b border-gray-300 pb-6 last:border-b-0">
                    <div className="bg-white p-5 rounded-lg shadow-sm">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs font-semibold text-[#071139] mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                            Print Name of Researcher:
                          </p>
                          <p className="text-sm text-[#071139] font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                            {researcher.name || '________________________'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-[#071139] mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                            Date: [MM/DD/YYYY]
                          </p>
                          <p className="text-sm text-[#071139] font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                            {new Date().toLocaleDateString('en-US', {month: '2-digit', day: '2-digit', year: 'numeric'})}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-700 flex items-start gap-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                  These signatures from Step 3 will be included in your consent form.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle size={18} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  No signatures found from Step 3. Please ensure you complete Step 3 before finalizing this form.
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
