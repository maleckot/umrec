'use client';
import { FileText, AlertCircle } from 'lucide-react';
import RichTextEditor from '@/components/researcher/submission/RichTextEditor';
import Step3Instructions from './Step3Instructions';
import ResearchTeamMembers from './ResearchTeamMembers';

const ProtocolSection = ({ 
  id, 
  title, 
  description, 
  value, 
  onChange, 
  error, 
  dataLoaded 
}: { 
  id: string, 
  title: string, 
  description: string | React.ReactNode, 
  value: string, 
  onChange: (val: string) => void, 
  error?: string, 
  dataLoaded: boolean 
}) => (
  <div>
    <label htmlFor={id} className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md flex-shrink-0">
        <FileText size={18} className="text-[#F7D117]" />
      </div>
      <span dangerouslySetInnerHTML={{ __html: title }} /> <span className="text-red-500">*</span>
    </label>
    <div className="text-xs sm:text-sm text-gray-600 mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
       {typeof description === 'string' ? <p>{description}</p> : description}
    </div>
    <div className={error ? 'border-2 border-red-500 rounded-xl p-1' : ''}>
      <RichTextEditor
        key={`${id}-${dataLoaded}`}
        label=""
        value={value}
        onChange={onChange}
        helperText=""
        maxWords={0}
      />
    </div>
    {error && (
      <p className="text-red-500 text-sm mt-2 flex items-center gap-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        <AlertCircle size={16} /> {error}
      </p>
    )}
  </div>
);

interface Step3FormProps {
  formData: any;
  setFormData: (data: any) => void;
  researchers: any[];
  errors: Record<string, string>;
  dataLoaded: boolean;
  addResearcher: () => void;
  removeResearcher: (id: string) => void;
  updateResearcher: (id: string, field: 'name' | 'signature', value: any) => void;
  handleBack: () => void;
  handleNext: () => void;
}

export default function Step3Form({
  formData,
  setFormData,
  researchers,
  errors,
  dataLoaded,
  addResearcher,
  removeResearcher,
  updateResearcher,
  handleBack,
  handleNext
}: Step3FormProps) {

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-8 md:p-10 lg:p-12">
      <form className="space-y-6 sm:space-y-8" onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
        
        <Step3Instructions />

        {/* I. Title */}
        <div>
          <label htmlFor="study-title" className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md flex-shrink-0">
              <FileText size={18} className="text-[#F7D117]" />
            </div>
            I. Title of the Study <span className="text-red-500">*</span>
          </label>
          <p className="text-xs sm:text-sm text-gray-600 mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Indicate the complete title of the research.
          </p>
          <input
            id="study-title"
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className={`w-full px-4 sm:px-5 py-3 sm:py-4 border-2 rounded-xl focus:ring-2 focus:outline-none text-[#071139] transition-all duration-300 ${errors.title ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-[#071139] focus:ring-[#071139]/20 hover:border-gray-400'}`}
            style={{ fontFamily: 'Metropolis, sans-serif' }}
            placeholder="Enter your research title"
          />
          {errors.title && <p className="text-red-500 text-sm mt-2 flex items-center gap-1" style={{ fontFamily: 'Metropolis, sans-serif' }}><AlertCircle size={16} /> {errors.title}</p>}
        </div>

        {/* Rich Text Sections */}
        <ProtocolSection 
           id="introduction-editor" 
           title="II. Introduction" 
           description="Provide a brief introduction to the study which includes an overview of the study."
           value={formData.introduction} 
           onChange={(v) => handleChange('introduction', v)} 
           error={errors.introduction} 
           dataLoaded={dataLoaded} 
        />

        <ProtocolSection 
           id="background-editor" 
           title="III. Background of the Study" 
           description="Include the reason for embarking on the study, the historical background of the study, and the research gap."
           value={formData.background} 
           onChange={(v) => handleChange('background', v)} 
           error={errors.background} 
           dataLoaded={dataLoaded} 
        />

        <ProtocolSection 
           id="problem-statement-editor" 
           title="IV. Statement of the Problem/Objectives of the Study" 
           description="Include the general and specific research problems/objectives of the study."
           value={formData.problemStatement} 
           onChange={(v) => handleChange('problemStatement', v)} 
           error={errors.problemStatement} 
           dataLoaded={dataLoaded} 
        />

        <ProtocolSection 
           id="scope-delimitation-editor" 
           title="V. Scope and Delimitation" 
           description="Provide the locale, topic, and respondent inclusions and the exclusions."
           value={formData.scopeDelimitation} 
           onChange={(v) => handleChange('scopeDelimitation', v)} 
           error={errors.scopeDelimitation} 
           dataLoaded={dataLoaded} 
        />

        <ProtocolSection 
           id="literature-review-editor" 
           title="VI. Related Literature &amp; Studies" 
           description="Write the related literature and studies that support the objectives/problem."
           value={formData.literatureReview} 
           onChange={(v) => handleChange('literatureReview', v)} 
           error={errors.literatureReview} 
           dataLoaded={dataLoaded} 
        />

        <ProtocolSection 
           id="methodology-editor" 
           title="VII. Research Methodology" 
           description="Indicate the research design of the study."
           value={formData.methodology} 
           onChange={(v) => handleChange('methodology', v)} 
           error={errors.methodology} 
           dataLoaded={dataLoaded} 
        />

        <ProtocolSection 
           id="population-editor" 
           title="VIII. Population, Respondents, and Sample Size for <strong>Quantitative Research</strong> / Participants for <strong>Qualitative Research</strong>" 
           description="Include the population of the study and indicate the number of respondents. Participants for Qualitative Research: Indicate the participants of the study."
           value={formData.population} 
           onChange={(v) => handleChange('population', v)} 
           error={errors.population} 
           dataLoaded={dataLoaded} 
        />

        <ProtocolSection 
           id="sampling-technique-editor" 
           title="IX. Sampling Technique for <strong>Quantitative Research</strong> / Criteria of Participants for <strong>Qualitative Research</strong>" 
           description="Present the sampling technique for quantitative. Criteria of Participants for Qualitative Research: Write the criteria for choosing participants."
           value={formData.samplingTechnique} 
           onChange={(v) => handleChange('samplingTechnique', v)} 
           error={errors.samplingTechnique} 
           dataLoaded={dataLoaded} 
        />

        <ProtocolSection 
           id="research-instrument-editor" 
           title="X. Research Instrument and Validation for <strong>Quantitative Research</strong> / Interview/FGD Questions for <strong>Qualitative Research</strong>" 
           description="Describe the details of the questionnaire or Interview/FGD Questions. Interview/FGD Questions for Qualitative Research: Describe the details of the Interview/FGD Questions."
           value={formData.researchInstrument} 
           onChange={(v) => handleChange('researchInstrument', v)} 
           error={errors.researchInstrument} 
           dataLoaded={dataLoaded} 
        />

        <ProtocolSection 
           id="ethical-consideration-editor" 
           title="XI. Ethical Consideration" 
           description="Explain the risks, benefits, mitigation of risks, inconveniences, vulnerability, data protection plan, and confidentiality of the study."
           value={formData.ethicalConsideration} 
           onChange={(v) => handleChange('ethicalConsideration', v)} 
           error={errors.ethicalConsideration} 
           dataLoaded={dataLoaded} 
        />

        <ProtocolSection 
           id="statistical-treatment-editor" 
           title="XII. Statistical Treatment of Data for <strong>Quantitative Research</strong> / Data Analysis for <strong>Qualitative Research</strong>" 
           description="Indicate the statistical tool of the study. Data Analysis for Qualitative Research: Indicate how the study will be analyzed."
           value={formData.statisticalTreatment} 
           onChange={(v) => handleChange('statisticalTreatment', v)} 
           error={errors.statisticalTreatment} 
           dataLoaded={dataLoaded} 
        />

        <ProtocolSection 
           id="references-editor" 
           title="XIII. References (Main Themes Only)" 
           description="Indicate the main references of the study."
           value={formData.references} 
           onChange={(v) => handleChange('references', v)} 
           error={errors.references} 
           dataLoaded={dataLoaded} 
        />

        <ResearchTeamMembers 
          researchers={researchers} 
          errors={errors} 
          addResearcher={addResearcher} 
          removeResearcher={removeResearcher} 
          updateResearcher={updateResearcher}
        />

        {/* Important Note */}
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-[#F7D117] p-4 sm:p-6 rounded-xl shadow-sm">
           <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#F7D117] rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                 <AlertCircle size={20} className="text-[#071139]" />
              </div>
              <div>
                 <h4 className="font-bold text-[#071139] mb-2 text-sm sm:text-base" style={{ fontFamily: 'Metropolis, sans-serif' }}>Important Note:</h4>
                 <p className="text-xs sm:text-sm text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Your progress is automatically saved. You can safely close or refresh this page and return later. All your data will be preserved until final submission.
                 </p>
              </div>
           </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 mt-8 border-t-2 border-gray-200">
          <button type="button" onClick={handleBack} className="w-full sm:w-auto px-10 sm:px-12 py-3 sm:py-4 bg-gray-200 text-[#071139] rounded-xl hover:bg-gray-300 transition-all duration-300 font-bold text-base sm:text-lg shadow-lg hover:shadow-xl hover:scale-105">
             <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 17l-5-5m0 0l5-5m-5 5h12" /></svg> Previous Step
             </span>
          </button>
          <button type="submit" className="w-full sm:w-auto group relative px-10 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-[#071139] to-[#003366] text-white rounded-xl hover:from-[#003366] hover:to-[#071139] transition-all duration-300 font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl hover:scale-105 overflow-hidden">
             <span className="absolute inset-0 bg-gradient-to-r from-[#F7D117] via-white/10 to-[#F7D117] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 opacity-20"></span>
             <span className="relative z-10 flex items-center justify-center gap-2">
                Next Step <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
             </span>
          </button>
        </div>

      </form>
    </div>
  );
}
