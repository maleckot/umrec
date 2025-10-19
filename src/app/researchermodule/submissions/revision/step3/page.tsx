// app/researchermodule/submissions/revision/step3/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import RevisionStepLayout from '@/components/researcher/revision/RevisionStepLayout';
import RevisionCommentBox from '@/components/researcher/revision/RevisionCommentBox';
import RichTextEditor from '@/components/researcher/submission/RichTextEditor';
import { FileUpload } from '@/components/researcher/submission/FormComponents';
import { Plus, X } from 'lucide-react';

// Word limits configuration
const WORD_LIMITS = {
  title: 0,
  introduction: 300,
  background: 500,
  problemStatement: 400,
  scopeDelimitation: 300,
  literatureReview: 600,
  methodology: 400,
  population: 300,
  samplingTechnique: 300,
  researchInstrument: 400,
  statisticalTreatment: 300,
  references: 0,
};

interface ResearcherSignature {
  id: string;
  name: string;
  signature: File | null;
}

export default function RevisionStep3() {
  const router = useRouter();
  const isInitialMount = useRef(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [formData, setFormData] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('revisionStep3Data');
      if (saved) {
        try {
          const parsedData = JSON.parse(saved);
          return parsedData.formData || parsedData;
        } catch (error) {
          console.error('Error loading saved revision step3 data:', error);
        }
      }

      const revisionStep1 = localStorage.getItem('revisionStep1Data');
      if (revisionStep1) {
        try {
          const revisionStep1Data = JSON.parse(revisionStep1);
          return {
            title: revisionStep1Data.title || '',
            introduction: '',
            background: '',
            problemStatement: '',
            scopeDelimitation: '',
            literatureReview: '',
            methodology: '',
            population: '',
            samplingTechnique: '',
            researchInstrument: '',
            statisticalTreatment: '',
            references: '',
          };
        } catch (error) {
          console.error('Error loading revisionStep1 data:', error);
        }
      }
    }

    return {
      title: '',
      introduction: '',
      background: '',
      problemStatement: '',
      scopeDelimitation: '',
      literatureReview: '',
      methodology: '',
      population: '',
      samplingTechnique: '',
      researchInstrument: '',
      statisticalTreatment: '',
      references: '',
    };
  });

  const [researchers, setResearchers] = useState<ResearcherSignature[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('revisionStep3Data');
      if (saved) {
        try {
          const parsedData = JSON.parse(saved);
          if (parsedData.researchers) {
            return parsedData.researchers.map((r: any) => ({ ...r, signature: null }));
          }
        } catch (error) {
          console.error('Error loading researchers:', error);
        }
      }

      const revisionStep1 = localStorage.getItem('revisionStep1Data');
      if (revisionStep1) {
        try {
          const revisionStep1Data = JSON.parse(revisionStep1);
          const fullName = `${revisionStep1Data.projectLeaderFirstName || ''} ${revisionStep1Data.projectLeaderMiddleName || ''} ${revisionStep1Data.projectLeaderLastName || ''}`.trim();
          return [{ id: '1', name: fullName, signature: null }];
        } catch (error) {
          console.error('Error loading revisionStep1 data:', error);
        }
      }
    }

    return [{ id: '1', name: '', signature: null }];
  });

  const [revisionComments] = useState(
    'Please expand the methodology section with more details about data collection procedures. The literature review needs to include more recent studies from the past 3 years. Ensure all research team member signatures are properly uploaded.'
  );

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
        formData,
        researchers: researchers.map((r) => ({ id: r.id, name: r.name, signature: null })),
      };
      localStorage.setItem('revisionStep3Data', JSON.stringify(dataToSave));
      console.log('💾 Revision Step 3 data auto-saved');
    }, 1000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [formData, researchers]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSave = {
      formData,
      researchers: researchers.map((r) => ({ id: r.id, name: r.name, signature: null })),
    };
    localStorage.setItem('revisionStep3Data', JSON.stringify(dataToSave));
    router.push('/researchermodule/submissions/revision/step4');
  };

  const handleBack = () => {
    router.push('/researchermodule/submissions/revision/step2');
  };

  const addResearcher = () => {
    const newId = (Math.max(...researchers.map((r) => parseInt(r.id))) + 1).toString();
    setResearchers([...researchers, { id: newId, name: '', signature: null }]);
  };

  const removeResearcher = (id: string) => {
    if (researchers.length > 1) {
      setResearchers(researchers.filter((r) => r.id !== id));
    }
  };

  const updateResearcher = (id: string, field: 'name' | 'signature', value: string | File | null) => {
    setResearchers(researchers.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  return (
    <RevisionStepLayout
      stepNumber={3}
      title="Research Protocol"
      description="Review and update your research protocol based on feedback."
      onBack={handleBack}
    >
      <RevisionCommentBox comments={revisionComments} />

      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        {/* Instructions */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 sm:p-6 rounded-lg">
          <h4 className="font-bold text-[#1E293B] text-base sm:text-lg mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Instructions to the Researcher
          </h4>
          <p className="text-xs sm:text-sm text-[#475569] leading-relaxed" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Review and update all sections based on the reviewer's feedback. Include all relevant information to facilitate a comprehensive re-review by the Ethics committee. For fields that are not applicable, write <strong>N/A</strong>.
          </p>
          <div className="mt-4 pt-4 border-t border-amber-200">
            <p className="text-xs sm:text-sm font-semibold text-[#1E293B] mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Available Formatting Options:
            </p>
            <ul className="text-xs sm:text-sm text-[#475569] space-y-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              <li>• <strong>Text formatting:</strong> Bold, italic, underline, lists (bullet/numbered)</li>
              <li>• <strong>Alignment & indentation:</strong> Align text left/center/right/justify, adjust indentation</li>
              <li>• <strong>Media uploads:</strong> Upload images and tables per section</li>
              <li>• <strong>Word limits:</strong> Some sections have maximum word counts - please stay within limits</li>
              <li>• <strong>Auto-save:</strong> Your progress is automatically saved every few seconds</li>
            </ul>
          </div>
        </div>

        {/* I. Title of the Study */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            I. Title of the Study <span className="text-red-600">*</span>
          </label>
          <p className="text-xs text-[#64748B] mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Indicate the complete title of the research.
          </p>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none text-[#1E293B]"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
            required
          />
        </div>

        {/* All RichTextEditor sections */}
        <RichTextEditor
          label="II. Introduction (Highlights)"
          value={formData.introduction}
          onChange={(val) => setFormData({ ...formData, introduction: val })}
          helperText="Provide a brief introduction to the study which includes an overview of the study."
          maxWords={WORD_LIMITS.introduction}
          required
        />

        <RichTextEditor
          label="III. Background of the Study (Highlights)"
          value={formData.background}
          onChange={(val) => setFormData({ ...formData, background: val })}
          helperText="Include the reason for embarking on the study, the historical background of the study, and the research gap."
          maxWords={WORD_LIMITS.background}
          required
        />

        <RichTextEditor
          label="IV. Statement of the Problem (Objectives of the Study)"
          value={formData.problemStatement}
          onChange={(val) => setFormData({ ...formData, problemStatement: val })}
          helperText="Include the general and specific research problems."
          maxWords={WORD_LIMITS.problemStatement}
          required
        />

        <RichTextEditor
          label="V. Scope and Delimitation"
          value={formData.scopeDelimitation}
          onChange={(val) => setFormData({ ...formData, scopeDelimitation: val })}
          helperText="Provide the locale, topic, and respondent inclusions and the exclusions."
          maxWords={WORD_LIMITS.scopeDelimitation}
          required
        />

        <RichTextEditor
          label="VI. Related Literature & Studies (Major Themes Only)"
          value={formData.literatureReview}
          onChange={(val) => setFormData({ ...formData, literatureReview: val })}
          helperText="Present the related literature and studies that support the major themes."
          maxWords={WORD_LIMITS.literatureReview}
          required
        />

        <RichTextEditor
          label="VII. Research Methodology"
          value={formData.methodology}
          onChange={(val) => setFormData({ ...formData, methodology: val })}
          helperText="Indicate the research design of the study."
          maxWords={WORD_LIMITS.methodology}
          required
        />

        <RichTextEditor
          label="VIII. Population, Respondents, and Sample Size / Participants"
          value={formData.population}
          onChange={(val) => setFormData({ ...formData, population: val })}
          helperText="For Quantitative: Include the population of the study and indicate the number of respondents. For Qualitative: Indicate the participants of the study."
          maxWords={WORD_LIMITS.population}
          required
        />

        <RichTextEditor
          label="IX. Sampling Technique / Criteria of Participants"
          value={formData.samplingTechnique}
          onChange={(val) => setFormData({ ...formData, samplingTechnique: val })}
          helperText="For Quantitative: Present the sampling technique. For Qualitative: Write the criteria for choosing participants."
          maxWords={WORD_LIMITS.samplingTechnique}
          required
        />

        <RichTextEditor
          label="X. Research Instrument and Validation / Interview/FGD Questions"
          value={formData.researchInstrument}
          onChange={(val) => setFormData({ ...formData, researchInstrument: val })}
          helperText="For Quantitative: Describe the details of the questionnaire. For Qualitative: Describe the details of the Interview/FGD Questions."
          maxWords={WORD_LIMITS.researchInstrument}
          required
        />

        <RichTextEditor
          label="XI. Statistical Treatment of Data / Data Analysis"
          value={formData.statisticalTreatment}
          onChange={(val) => setFormData({ ...formData, statisticalTreatment: val })}
          helperText="For Quantitative: Indicate the statistical tool of the study. For Qualitative: Indicate how the study will be analyzed."
          maxWords={WORD_LIMITS.statisticalTreatment}
          required
        />

        <RichTextEditor
          label="XII. References (Main Themes Only)"
          value={formData.references}
          onChange={(val) => setFormData({ ...formData, references: val })}
          helperText="Indicate the main references of the study."
          required
        />

        {/* Accomplished By Section */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 sm:p-6 rounded-lg mt-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h4 className="font-bold text-[#1E293B] text-base sm:text-lg" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Accomplished By (Research Team Members)
            </h4>
            <button
              type="button"
              onClick={addResearcher}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-semibold text-sm sm:text-base w-full sm:w-auto"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              <Plus size={18} />
              Add Member
            </button>
          </div>

          <p className="text-xs sm:text-sm text-[#475569] mb-6" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            All research team members must provide their printed name and signature below.
          </p>

          <div className="space-y-4 sm:space-y-6">
            {researchers.map((researcher, index) => (
              <div key={researcher.id} className="bg-white p-4 sm:p-6 rounded-lg border-2 border-amber-200 relative">
                {researchers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeResearcher(researcher.id)}
                    className="absolute top-2 right-2 sm:top-4 sm:right-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors z-10"
                    title="Remove member"
                  >
                    <X size={18} className="sm:w-5 sm:h-5" />
                  </button>
                )}

                <h5 className="font-semibold text-[#1E293B] mb-4 pr-10 text-sm sm:text-base" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Member {index + 1}
                </h5>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold mb-2 text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Printed Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={researcher.name}
                      onChange={(e) => updateResearcher(researcher.id, 'name', e.target.value)}
                      placeholder="Enter full name"
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none text-[#1E293B] text-sm sm:text-base"
                      style={{ fontFamily: 'Metropolis, sans-serif' }}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold mb-2 text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Signature <span className="text-red-600">*</span>
                    </label>
                    <p className="text-xs text-[#64748B] mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Upload a scanned copy or digital signature (PNG, JPG, or PDF format)
                    </p>
                    <FileUpload
                      label=""
                      value={researcher.signature}
                      onChange={(file) => updateResearcher(researcher.id, 'signature', file)}
                      accept="image/*,.pdf"
                      helperText="Max file size: 5MB"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Important Note */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 sm:p-6 rounded-lg">
          <h4 className="font-bold text-[#1E293B] mb-2 text-sm sm:text-base" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Important Note:
          </h4>
          <p className="text-xs sm:text-sm text-[#475569]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Your progress is automatically saved. You can safely close or refresh this page and return later. All your data will be preserved until final submission.
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 sm:pt-8 mt-6 sm:mt-8 border-t-2 border-gray-200">
          <button
            type="button"
            onClick={handleBack}
            className="w-full sm:w-auto px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold order-2 sm:order-1"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            Back
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-semibold cursor-pointer order-1 sm:order-2"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            Next
          </button>
        </div>
      </form>
    </RevisionStepLayout>
  );
}
