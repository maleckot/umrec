import { FileText, AlertCircle } from 'lucide-react';
import RichTextEditor from '@/components/researcher/submission/RichTextEditor';

interface FormFieldsProps {
  formData: any;
  setFormData: (val: any) => void;
  errors: Record<string, string>;
}

export default function FormFieldsSection({ formData, setFormData, errors }: FormFieldsProps) {
  
  const sections = [
    { key: 'introduction', title: 'II. Introduction', label: 'Overview of the study', placeholder: 'Enter your introduction here...' },
    { key: 'background', title: 'III. Background of the Study', label: 'Historical background & research gap', placeholder: 'Enter background...' },
    { key: 'problemStatement', title: 'IV. Statement of the Problem/Objectives', label: 'General & specific problems', placeholder: 'Enter objectives...' },
    { key: 'scopeDelimitation', title: 'V. Scope and Delimitation', label: 'Locale, topic, inclusions/exclusions', placeholder: 'Enter scope...' },
    { key: 'literatureReview', title: 'VI. Related Literature & Studies', label: 'Supporting literature', placeholder: 'Enter literature review...' },
    { key: 'methodology', title: 'VII. Research Methodology', label: 'Research design', placeholder: 'Enter methodology...' },
    { key: 'population', title: 'VIII. Population, Respondents, and Sample Size', label: 'Population/Participants details', placeholder: 'Enter details...' },
    { key: 'samplingTechnique', title: 'IX. Sampling Technique / Criteria', label: 'Sampling technique/Criteria', placeholder: 'Enter sampling technique...' },
    { key: 'researchInstrument', title: 'X. Research Instrument', label: 'Questionnaire or Interview details', placeholder: 'Enter instrument details...' },
    { key: 'ethicalConsideration', title: 'XI. Ethical Consideration', label: 'Risks, benefits, confidentiality', placeholder: 'Enter ethical considerations...' },
    { key: 'statisticalTreatment', title: 'XII. Statistical Treatment / Data Analysis', label: 'Statistical tools or analysis plan', placeholder: 'Enter statistical treatment...' },
    { key: 'references', title: 'XIII. References (Main Themes Only)', label: 'Main references', placeholder: 'List references...' },
  ];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <label htmlFor="study-title" className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
            <FileText size={16} className="text-[#F7D117]" />
          </div>
          I. Title of the Study <span className="text-red-500">*</span>
        </label>
        <p className="text-xs sm:text-sm text-gray-700 font-medium mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Indicate the complete title of the research.
        </p>
        <input
          id="study-title"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className={`w-full px-4 sm:px-5 py-3 sm:py-4 border-2 rounded-xl focus:ring-2 focus:outline-none text-[#071139] font-medium transition-all duration-300 ${errors.title ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-[#071139] focus:ring-[#071139]/20 hover:border-gray-400'}`}
          style={{ fontFamily: 'Metropolis, sans-serif' }}
          placeholder="Enter your research title"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-2 flex items-center gap-1 font-bold">
            <AlertCircle size={16} /> {errors.title}
          </p>
        )}
      </div>

      {/* Dynamic Sections */}
      {sections.map(({ key, title, label, placeholder }) => (
        <div key={key}>
          <label htmlFor={`${key}-editor`} className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
              <FileText size={16} className="text-[#F7D117]" />
            </div>
            {title} <span className="text-red-500">*</span>
          </label>
          <p className="text-xs sm:text-sm text-gray-700 font-medium mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {label}
          </p>
          <div id={`${key}-editor`} className={`${errors[key] ? 'ring-2 ring-red-500 rounded-xl' : ''}`}>
            <RichTextEditor
              label=""
              value={formData[key]}
              onChange={(val) => setFormData({ ...formData, [key]: val })}
              placeholder={placeholder}
            />
          </div>
          {errors[key] && (
            <p className="text-red-500 text-sm mt-2 flex items-center gap-1 font-bold">
              <AlertCircle size={16} /> {errors[key]}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
