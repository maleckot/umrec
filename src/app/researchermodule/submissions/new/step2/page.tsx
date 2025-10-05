// app/researchermodule/submissions/new/step2/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SubmissionStepLayout from '@/components/researcher/submission/SubmissionStepLayout';
import { TextInput, TextArea, Select, CheckboxGroup, RadioGroup, FileUpload } from '@/components/researcher/submission/FormComponents';

export default function Step2ApplicationForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    studySite: '',
    researcherFirstName: '',
    researcherMiddleName: '',
    researcherLastName: '',
    telNo: '',
    mobileNo: '',
    email: '',
    faxNo: 'N/A',
    coResearcher: '',
    college: '',
    institution: 'University of Makati',
    institutionAddress: '',
    typeOfStudy: [] as string[],
    typeOfStudyOthers: '',
    multicenterType: '',
    sourceOfFunding: [] as string[],
    pharmaceuticalSponsor: '',
    fundingOthers: '',
    startDate: '',
    endDate: '',
    numParticipants: '',
    technicalReview: '',
    technicalReviewFile: null as File | null,
    submittedToOther: '',
    // Checklist - Basic Requirements
    hasApplicationForm: true,
    hasResearchProtocol: false,
    hasInformedConsentEnglish: false,
    hasInformedConsentFilipino: false,
    hasInformedConsentOthers: false,
    informedConsentOthers: '',
    hasAssentFormEnglish: false,
    hasAssentFormFilipino: false,
    hasAssentFormOthers: false,
    assentFormOthers: '',
    hasEndorsementLetter: false,
    // Supplementary Documents
    hasQuestionnaire: false,
    hasDataCollectionForms: false,
    hasProductBrochure: false,
    hasFDAAuthorization: false,
    hasSpecialPopulationPermit: false,
    specialPopulationPermitDetails: '',
    hasOtherDocs: false,
    otherDocsDetails: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('step2Data');
    if (saved) {
      const parsedData = JSON.parse(saved);
      setFormData({...parsedData, technicalReviewFile: null}); // Don't persist file
    } else {
      // Pre-fill from step 1
      const step1 = localStorage.getItem('step1Data');
      if (step1) {
        const step1Data = JSON.parse(step1);
        setFormData(prev => ({
          ...prev,
          title: step1Data.title || '',
          studySite: step1Data.studySite || '',
          researcherFirstName: step1Data.projectLeaderFirstName || '',
          researcherMiddleName: step1Data.projectLeaderMiddleName || '',
          researcherLastName: step1Data.projectLeaderLastName || '',
          mobileNo: step1Data.projectLeaderContact || '',
          email: step1Data.projectLeaderEmail || '',
          coResearcher: step1Data.coAuthors || '',
          college: step1Data.college || '',
          institution: step1Data.institution || 'University of Makati',
        }));
      }
    }
  }, []);

  const handleNext = () => {
    const dataToSave = {...formData};
    delete (dataToSave as any).technicalReviewFile; // Don't save file to localStorage
    localStorage.setItem('step2Data', JSON.stringify(dataToSave));
    router.push('/researchermodule/submissions/new/step3');
  };

  const handleBack = () => {
    router.push('/researchermodule/submissions/new/step1');
  };

  const typeOfStudyOptions = [
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

  const fundingOptions = [
    { value: 'self_funded', label: 'Self-funded' },
    { value: 'government', label: 'Government-Funded' },
    { value: 'scholarship', label: 'Scholarship/Research Grant' },
    { value: 'pharmaceutical', label: 'Sponsored by Pharmaceutical Company' },
    { value: 'institution', label: 'Institution-Funded' },
    { value: 'others', label: 'Others (please specify)' }
  ];

  return (
    <SubmissionStepLayout
      stepNumber={2}
      title="Application for Ethics Review"
      description="Please accomplish this form and ensure accuracy of information."
      onBack={handleBack}
      onNext={handleNext}
      totalSteps={8}
    >
      <form className="space-y-6">
        {/* Section 1: General Information */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mb-6">
          <h4 className="font-bold text-[#1E293B] text-lg mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            1. General Information
          </h4>
          <p className="text-sm text-[#475569]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Fields marked with * are required. Some information has been pre-filled from Step 1.
          </p>
        </div>

        {/* Title of Study */}
        <TextInput
          label="Title of Study"
          value={formData.title}
          onChange={(val) => setFormData({...formData, title: val})}
          required
        />

        {/* Study Site */}
        <TextInput
          label="Study Site"
          value={formData.studySite}
          onChange={(val) => setFormData({...formData, studySite: val})}
          required
        />

        {/* Name of Researcher */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Name of Researcher <span className="text-red-600">*</span>
          </label>
          <p className="text-xs text-[#64748B] mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Format: First Name, MI, Last name
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="First Name"
              value={formData.researcherFirstName}
              onChange={(e) => setFormData({...formData, researcherFirstName: e.target.value})}
              className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#3B82F6] focus:outline-none text-[#1E293B]"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
              required
            />
            <input
              type="text"
              placeholder="Middle Initial"
              value={formData.researcherMiddleName}
              onChange={(e) => setFormData({...formData, researcherMiddleName: e.target.value})}
              className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#3B82F6] focus:outline-none text-[#1E293B]"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={formData.researcherLastName}
              onChange={(e) => setFormData({...formData, researcherLastName: e.target.value})}
              className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#3B82F6] focus:outline-none text-[#1E293B]"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
              required
            />
          </div>
        </div>

        {/* Contact Information */}
<div>
  <label className="block text-sm font-semibold mb-3 text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
    Contact Information
  </label>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label className="block text-sm font-semibold mb-2 text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        Tel No
      </label>
      <input
        type="tel"
        value={formData.telNo}
        onChange={(e) => setFormData({...formData, telNo: e.target.value})}
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#3B82F6] focus:outline-none text-[#1E293B]"
        style={{ fontFamily: 'Metropolis, sans-serif' }}
      />
    </div>
    <div>
      <label className="block text-sm font-semibold mb-2 text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        Mobile No <span className="text-red-600">*</span>
      </label>
      <input
        type="tel"
        value={formData.mobileNo}
        onChange={(e) => setFormData({...formData, mobileNo: e.target.value})}
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#3B82F6] focus:outline-none text-[#1E293B]"
        style={{ fontFamily: 'Metropolis, sans-serif' }}
        required
      />
    </div>
    <div>
      <label className="block text-sm font-semibold mb-2 text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        Fax No
      </label>
      <input
        type="text"
        value={formData.faxNo}
        onChange={(e) => setFormData({...formData, faxNo: e.target.value})}
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#3B82F6] focus:outline-none text-[#1E293B]"
        style={{ fontFamily: 'Metropolis, sans-serif' }}
      />
      <p className="text-xs text-[#64748B] mt-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        Default: N/A
      </p>
    </div>
    <div>
      <label className="block text-sm font-semibold mb-2 text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        Email <span className="text-red-600">*</span>
      </label>
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#3B82F6] focus:outline-none text-[#1E293B]"
        style={{ fontFamily: 'Metropolis, sans-serif' }}
        required
      />
    </div>
  </div>
</div>

        {/* Co-researcher */}
        <TextArea
          label="Co-researcher (if any)"
          value={formData.coResearcher}
          onChange={(val) => setFormData({...formData, coResearcher: val})}
          placeholder="First Name MI, Last name (if multiple, separate with commas)"
          rows={2}
          helperText="If there are none, please write N/A"
        />

        {/* College/Department */}
        <TextInput
          label="College/Department"
          value={formData.college}
          onChange={(val) => setFormData({...formData, college: val})}
          required
        />

        {/* Institution */}
        <TextInput
          label="Institution"
          value={formData.institution}
          onChange={(val) => setFormData({...formData, institution: val})}
          required
        />

        {/* Address of Institution */}
        <TextInput
          label="Address of Institution"
          value={formData.institutionAddress}
          onChange={(val) => setFormData({...formData, institutionAddress: val})}
          required
        />

        {/* Type of Study */}
        <CheckboxGroup
          label="Type of Study"
          options={typeOfStudyOptions}
          selected={formData.typeOfStudy}
          onChange={(val) => setFormData({...formData, typeOfStudy: val})}
          required
        />

        {formData.typeOfStudy.includes('others') && (
          <TextInput
            label="Please specify other type of study"
            value={formData.typeOfStudyOthers}
            onChange={(val) => setFormData({...formData, typeOfStudyOthers: val})}
            required
          />
        )}

        {/* Multicenter Type */}
        <RadioGroup
          label="Study Site Type"
          options={[
            { value: 'international', label: 'Multicenter (International)' },
            { value: 'national', label: 'Multicenter (National)' },
            { value: 'single', label: 'Single Site' }
          ]}
          selected={formData.multicenterType}
          onChange={(val) => setFormData({...formData, multicenterType: val})}
          required
        />

        {/* Source of Funding */}
        <CheckboxGroup
          label="Source of Funding"
          options={fundingOptions}
          selected={formData.sourceOfFunding}
          onChange={(val) => setFormData({...formData, sourceOfFunding: val})}
          required
        />

        {formData.sourceOfFunding.includes('pharmaceutical') && (
          <TextInput
            label="Specify Pharmaceutical Company"
            value={formData.pharmaceuticalSponsor}
            onChange={(val) => setFormData({...formData, pharmaceuticalSponsor: val})}
            placeholder="Company name"
            required
          />
        )}

        {formData.sourceOfFunding.includes('others') && (
          <TextInput
            label="Specify Other Funding Source"
            value={formData.fundingOthers}
            onChange={(val) => setFormData({...formData, fundingOthers: val})}
            required
          />
        )}

        {/* Duration of the Study */}
        <div>
          <label className="block text-sm font-semibold mb-3 text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Duration of the Study
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-2 text-[#475569]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Start date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#3B82F6] focus:outline-none text-[#1E293B]"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2 text-[#475569]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                End date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#3B82F6] focus:outline-none text-[#1E293B]"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
                required
              />
            </div>
          </div>
        </div>

        {/* Number of Participants */}
        <TextInput
          label="No. of study participants"
          value={formData.numParticipants}
          onChange={(val) => setFormData({...formData, numParticipants: val})}
          type="number"
          required
        />

        {/* Technical Review */}
        <div>
          <RadioGroup
            label="Has the Research undergone a Technical Review?"
            options={[
              { value: 'yes', label: 'Yes (please attach technical review results)' },
              { value: 'no', label: 'No' }
            ]}
            selected={formData.technicalReview}
            onChange={(val) => setFormData({...formData, technicalReview: val})}
            required
          />
          
          {/* Show file upload if Yes is selected */}
          {formData.technicalReview === 'yes' && (
            <div className="mt-4 ml-8">
              <FileUpload
                label="Upload Technical Review Results"
                value={formData.technicalReviewFile}
                onChange={(file) => setFormData({...formData, technicalReviewFile: file})}
                accept=".pdf"
                helperText="PDF files only (max 10MB)"
                required
              />
            </div>
          )}
        </div>

        {/* Submitted to Another UMREC */}
        <RadioGroup
          label="Has the Research been submitted to another UMREC?"
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' }
          ]}
          selected={formData.submittedToOther}
          onChange={(val) => setFormData({...formData, submittedToOther: val})}
          required
        />

        {/* Section 2: Checklist of Documents */}
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-[#FFD700] p-6 rounded-lg">
          <h4 className="font-bold text-[#1E293B] text-lg mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            2. Checklist of Documents
          </h4>
          <p className="text-sm text-[#475569]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Select all documents that apply to your submission.
          </p>
        </div>

        {/* Basic Requirements */}
        <div className="space-y-4">
          <h5 className="font-semibold text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Basic Requirements:
          </h5>
          
          {/* Application Form - Always checked */}
          <label className="flex items-center cursor-not-allowed opacity-75">
            <input
              type="checkbox"
              checked={true}
              disabled
              className="w-5 h-5 text-[#3B82F6] border-2 border-gray-300 rounded cursor-not-allowed"
            />
            <span className="ml-3 text-sm text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Application for Ethics Review of A New Protocol
            </span>
          </label>

          {/* Research Protocol */}
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.hasResearchProtocol}
              onChange={(e) => setFormData({...formData, hasResearchProtocol: e.target.checked})}
              className="w-5 h-5 text-[#3B82F6] border-2 border-gray-300 rounded focus:ring-2 focus:ring-[#3B82F6] cursor-pointer"
            />
            <span className="ml-3 text-sm text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Research Protocol
            </span>
          </label>

          {/* Informed Consent Form */}
          <div className="ml-8 space-y-2">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.hasInformedConsentEnglish}
                onChange={(e) => setFormData({...formData, hasInformedConsentEnglish: e.target.checked})}
                className="w-5 h-5 text-[#3B82F6] border-2 border-gray-300 rounded focus:ring-2 focus:ring-[#3B82F6] cursor-pointer"
              />
              <span className="ml-3 text-sm text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Informed Consent Form - English version
              </span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.hasInformedConsentFilipino}
                onChange={(e) => setFormData({...formData, hasInformedConsentFilipino: e.target.checked})}
                className="w-5 h-5 text-[#3B82F6] border-2 border-gray-300 rounded focus:ring-2 focus:ring-[#3B82F6] cursor-pointer"
              />
              <span className="ml-3 text-sm text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Informed Consent Form - Filipino version
              </span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.hasInformedConsentOthers}
                onChange={(e) => setFormData({...formData, hasInformedConsentOthers: e.target.checked})}
                className="w-5 h-5 text-[#3B82F6] border-2 border-gray-300 rounded focus:ring-2 focus:ring-[#3B82F6] cursor-pointer"
              />
              <span className="ml-3 text-sm text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Informed Consent Form - Others (please specify)
              </span>
            </label>
            {formData.hasInformedConsentOthers && (
              <input
                type="text"
                placeholder="Specify other language"
                value={formData.informedConsentOthers}
                onChange={(e) => setFormData({...formData, informedConsentOthers: e.target.value})}
                className="ml-8 w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#3B82F6] focus:outline-none text-[#1E293B]"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              />
            )}
          </div>

          {/* Assent Form */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Assent Form (if applicable):
            </p>
            <div className="ml-8 space-y-2">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasAssentFormEnglish}
                  onChange={(e) => setFormData({...formData, hasAssentFormEnglish: e.target.checked})}
                  className="w-5 h-5 text-[#3B82F6] border-2 border-gray-300 rounded focus:ring-2 focus:ring-[#3B82F6] cursor-pointer"
                />
                <span className="ml-3 text-sm text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  English version
                </span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasAssentFormFilipino}
                  onChange={(e) => setFormData({...formData, hasAssentFormFilipino: e.target.checked})}
                  className="w-5 h-5 text-[#3B82F6] border-2 border-gray-300 rounded focus:ring-2 focus:ring-[#3B82F6] cursor-pointer"
                />
                <span className="ml-3 text-sm text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Filipino version
                </span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasAssentFormOthers}
                  onChange={(e) => setFormData({...formData, hasAssentFormOthers: e.target.checked})}
                  className="w-5 h-5 text-[#3B82F6] border-2 border-gray-300 rounded focus:ring-2 focus:ring-[#3B82F6] cursor-pointer"
                />
                <span className="ml-3 text-sm text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Others: (please specify)
                </span>
              </label>
              {formData.hasAssentFormOthers && (
                <input
                  type="text"
                  placeholder="Specify other language"
                  value={formData.assentFormOthers}
                  onChange={(e) => setFormData({...formData, assentFormOthers: e.target.value})}
                  className="ml-8 w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#3B82F6] focus:outline-none text-[#1E293B]"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                />
              )}
            </div>
          </div>

          {/* Endorsement Letter */}
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.hasEndorsementLetter}
              onChange={(e) => setFormData({...formData, hasEndorsementLetter: e.target.checked})}
              className="w-5 h-5 text-[#3B82F6] border-2 border-gray-300 rounded focus:ring-2 focus:ring-[#3B82F6] cursor-pointer"
            />
            <span className="ml-3 text-sm text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Endorsement Letter from Research Adviser
            </span>
          </label>
        </div>

        {/* Supplementary Documents */}
        <div className="space-y-4 mt-6">
          <h5 className="font-semibold text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Supplementary Documents:
          </h5>
          
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.hasQuestionnaire}
              onChange={(e) => setFormData({...formData, hasQuestionnaire: e.target.checked})}
              className="w-5 h-5 text-[#3B82F6] border-2 border-gray-300 rounded focus:ring-2 focus:ring-[#3B82F6] cursor-pointer"
            />
            <span className="ml-3 text-sm text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Questionnaire (if applicable)
            </span>
          </label>

          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.hasDataCollectionForms}
              onChange={(e) => setFormData({...formData, hasDataCollectionForms: e.target.checked})}
              className="w-5 h-5 text-[#3B82F6] border-2 border-gray-300 rounded focus:ring-2 focus:ring-[#3B82F6] cursor-pointer"
            />
            <span className="ml-3 text-sm text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Data Collection Forms (if applicable)
            </span>
          </label>

          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.hasProductBrochure}
              onChange={(e) => setFormData({...formData, hasProductBrochure: e.target.checked})}
              className="w-5 h-5 text-[#3B82F6] border-2 border-gray-300 rounded focus:ring-2 focus:ring-[#3B82F6] cursor-pointer"
            />
            <span className="ml-3 text-sm text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Product Brochure (if applicable)
            </span>
          </label>

          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.hasFDAAuthorization}
              onChange={(e) => setFormData({...formData, hasFDAAuthorization: e.target.checked})}
              className="w-5 h-5 text-[#3B82F6] border-2 border-gray-300 rounded focus:ring-2 focus:ring-[#3B82F6] cursor-pointer"
            />
            <span className="ml-3 text-sm text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Philippine FDA Marketing Authorization or Import License (if applicable)
            </span>
          </label>

          <div>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.hasSpecialPopulationPermit}
                onChange={(e) => setFormData({...formData, hasSpecialPopulationPermit: e.target.checked})}
                className="w-5 h-5 text-[#3B82F6] border-2 border-gray-300 rounded focus:ring-2 focus:ring-[#3B82F6] cursor-pointer"
              />
              <span className="ml-3 text-sm text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Permit/s for special populations (please specify)
              </span>
            </label>
            {formData.hasSpecialPopulationPermit && (
              <input
                type="text"
                placeholder="Specify details"
                value={formData.specialPopulationPermitDetails}
                onChange={(e) => setFormData({...formData, specialPopulationPermitDetails: e.target.value})}
                className="ml-8 mt-2 w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#3B82F6] focus:outline-none text-[#1E293B]"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              />
            )}
          </div>

          <div>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.hasOtherDocs}
                onChange={(e) => setFormData({...formData, hasOtherDocs: e.target.checked})}
                className="w-5 h-5 text-[#3B82F6] border-2 border-gray-300 rounded focus:ring-2 focus:ring-[#3B82F6] cursor-pointer"
              />
              <span className="ml-3 text-sm text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Others (please specify)
              </span>
            </label>
            {formData.hasOtherDocs && (
              <input
                type="text"
                placeholder="Specify other documents"
                value={formData.otherDocsDetails}
                onChange={(e) => setFormData({...formData, otherDocsDetails: e.target.value})}
                className="ml-8 mt-2 w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#3B82F6] focus:outline-none text-[#1E293B]"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              />
            )}
          </div>
        </div>
      </form>
    </SubmissionStepLayout>
  );
}
