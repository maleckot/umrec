import { FileText, Info, Building, Calendar, Users } from 'lucide-react';
import Tooltip from './Tooltip';

interface StudyDetailsProps {
  formData: any;
  setFormData: (val: any) => void;
  handleInputChange: (field: string, value: string) => void;
}

export default function StudyDetailsSection({ formData, setFormData, handleInputChange }: StudyDetailsProps) {
  
  const labelClass = "flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]";
  const inputClass = "w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none text-[#071139] font-medium transition-all duration-300 hover:border-gray-400";

  const studyTypes = [
    { value: 'clinical_trial_sponsored', label: 'Clinical Trial (Sponsored)' },
    { value: 'clinical_trial_researcher', label: 'Clinical Trials (Researcher-initiated)' },
    { value: 'health_operations', label: 'Health Operations Research (Health Programs and Policies)' },
    { value: 'social_behavioral', label: 'Social / Behavioral Research' },
    { value: 'public_health', label: 'Public Health / Epidemiologic Research' },
    { value: 'biomedical', label: 'Biomedical research (Retrospective, Prospective, and diagnostic studies)' },
    { value: 'stem_cell', label: 'Stem Cell Research' },
    { value: 'genetic', label: 'Genetic Research' },
    { value: 'others', label: 'Others (please specify)' }
  ];

  const fundingSources = [
    { value: 'self_funded', label: 'Self-funded' },
    { value: 'government', label: 'Government-Funded' },
    { value: 'scholarship', label: 'Scholarship/Research Grant' },
    { value: 'pharmaceutical', label: 'Sponsored by Pharmaceutical Company' },
    { value: 'institution', label: 'Institution-Funded' },
    { value: 'others', label: 'Others (please specify)' }
  ];

  return (
    <div className="space-y-8">
      {/* Type of Study */}
      <fieldset>
        <legend className={labelClass} style={{ fontFamily: 'Metropolis, sans-serif' }}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md flex-shrink-0">
             <FileText size={16} className="text-[#F7D117]" />
          </div>
          <span className="flex-1">Type of Study <span className="text-red-500">*</span></span>
          <Tooltip text="Select all types that apply to your research study">
            <Info size={18} className="text-gray-400 cursor-help flex-shrink-0" />
          </Tooltip>
        </legend>
        <div className="space-y-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
          {studyTypes.map((option) => (
            <div key={option.value}>
              <label className="flex items-start gap-3 cursor-pointer p-3 hover:bg-white rounded-lg transition-colors">
                <input
                  type="checkbox"
                  checked={formData.typeOfStudy.includes(option.value)}
                  onChange={(e) => {
                    const newTypes = e.target.checked
                      ? [...formData.typeOfStudy, option.value]
                      : formData.typeOfStudy.filter((v: string) => v !== option.value);
                    setFormData({ ...formData, typeOfStudy: newTypes });
                  }}
                  className="w-5 h-5 min-w-[1.25rem] rounded mt-0.5"
                />
                <span className="text-sm text-[#071139] leading-snug font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>{option.label}</span>
              </label>
              {option.value === 'others' && formData.typeOfStudy.includes('others') && (
                <div className="ml-11 mr-3 mb-2">
                  <input
                    type="text"
                    placeholder="Please specify"
                    value={formData.typeOfStudyOthers}
                    onChange={(e) => handleInputChange('typeOfStudyOthers', e.target.value)}
                    className={inputClass}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </fieldset>

      {/* Study Site Type */}
      <div>
        <label className={labelClass} style={{ fontFamily: 'Metropolis, sans-serif' }}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md flex-shrink-0">
                <Building size={16} className="text-[#F7D117]" />
            </div>
            <span className="flex-1">Study Site Type <span className="text-red-500">*</span></span>
        </label>
        <div className="space-y-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
            {['Multicenter (International)', 'Multicenter (National)', 'Single Site'].map((val) => (
                <label key={val} className="flex items-start gap-3 cursor-pointer p-3 hover:bg-white rounded-lg transition-colors">
                    <input
                        type="radio" name="studySiteType" value={val}
                        checked={formData.studySiteType === val}
                        onChange={(e) => handleInputChange('studySiteType', e.target.value)}
                        className="w-5 h-5 min-w-[1.25rem] mt-0.5"
                    />
                    <span className="text-sm text-[#071139] font-medium">{val}</span>
                </label>
            ))}
        </div>
      </div>

      {/* Source of Funding */}
      <div>
         <label className={labelClass} style={{ fontFamily: 'Metropolis, sans-serif' }}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md flex-shrink-0">
                <FileText size={16} className="text-[#F7D117]" />
            </div>
            <span className="flex-1">Source of Funding <span className="text-red-500">*</span></span>
         </label>
         <div className="space-y-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
            {fundingSources.map((option) => (
                <div key={option.value}>
                    <label className="flex items-start gap-3 cursor-pointer p-3 hover:bg-white rounded-lg transition-colors">
                        <input
                            type="checkbox"
                            checked={formData.sourceOfFunding.includes(option.value)}
                            onChange={(e) => {
                                const newSrc = e.target.checked
                                  ? [...formData.sourceOfFunding, option.value]
                                  : formData.sourceOfFunding.filter((v: string) => v !== option.value);
                                setFormData({ ...formData, sourceOfFunding: newSrc });
                            }}
                            className="w-5 h-5 min-w-[1.25rem] rounded mt-0.5"
                        />
                        <span className="text-sm text-[#071139] font-medium">{option.label}</span>
                    </label>
                    {option.value === 'pharmaceutical' && formData.sourceOfFunding.includes('pharmaceutical') && (
                        <div className="ml-11 mr-3 mb-2">
                             <input type="text" placeholder="Specify Company" value={formData.pharmaceuticalSponsor} onChange={(e) => handleInputChange('pharmaceuticalSponsor', e.target.value)} className={inputClass} />
                        </div>
                    )}
                    {option.value === 'others' && formData.sourceOfFunding.includes('others') && (
                        <div className="ml-11 mr-3 mb-2">
                             <input type="text" placeholder="Specify Source" value={formData.fundingOthers} onChange={(e) => handleInputChange('fundingOthers', e.target.value)} className={inputClass} />
                        </div>
                    )}
                </div>
            ))}
         </div>
      </div>

      {/* Duration */}
      <div>
         <div className={labelClass} style={{ fontFamily: 'Metropolis, sans-serif' }}>
             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
                <Calendar size={16} className="text-[#F7D117]" />
             </div>
             <span>Duration of the Study <span className="text-red-500">*</span></span>
         </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div>
                 <label className="block text-xs font-bold mb-2 text-gray-700">Start date</label>
                 <input type="date" value={formData.startDate} onChange={(e) => handleInputChange('startDate', e.target.value)} className={inputClass} required />
             </div>
             <div>
                 <label className="block text-xs font-bold mb-2 text-gray-700">End date</label>
                 <input type="date" value={formData.endDate} onChange={(e) => handleInputChange('endDate', e.target.value)} className={inputClass} required />
             </div>
         </div>
      </div>

      {/* Participants */}
      <div>
         <label className={labelClass} style={{ fontFamily: 'Metropolis, sans-serif' }}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
                <Users size={16} className="text-[#F7D117]" />
            </div>
            No. of study participants <span className="text-red-500">*</span>
         </label>
         <input type="number" value={formData.numParticipants} onChange={(e) => handleInputChange('numParticipants', e.target.value)} placeholder="e.g., 100" className={inputClass} required />
      </div>
    </div>
  );
}
