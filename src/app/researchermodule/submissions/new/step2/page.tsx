// app/researchermodule/submissions/new/step2/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import SubmissionStepLayout from '@/components/researcher/submission/SubmissionStepLayout';
import { TextInput, TextArea, Select, CheckboxGroup, RadioGroup, FileUpload } from '@/components/researcher/submission/FormComponents';

export default function Step2ApplicationForm() {
  const router = useRouter();
  const isInitialMount = useRef(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isClient, setIsClient] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    studySiteType: '',
    studySite:'',
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
    sourceOfFunding: [] as string[],
    pharmaceuticalSponsor: '',
    fundingOthers: '',
    startDate: '',
    endDate: '',
    numParticipants: '',
    technicalReview: '',
    technicalReviewFile: null as File | null,
    submittedToOther: '',
    hasApplicationForm: true,
    hasResearchProtocol: false,
    hasInformedConsent: false,
    hasInformedConsentOthers: false,
    informedConsentOthers: '',
    hasAssentForm: false,
    hasAssentFormOthers: false,
    assentFormOthers: '',
    hasEndorsementLetter: false,
    hasQuestionnaire: false,
    hasDataCollectionForms: false,
    hasProductBrochure: false,
    hasFDAAuthorization: false,
    hasSpecialPopulationPermit: false,
    specialPopulationPermitDetails: '',
    hasOtherDocs: false,
    otherDocsDetails: '',
  });

  // UMak Colleges/Departments
  const umakColleges = [
    'College of Liberal Arts and Sciences (CLAS)',
    'College of Human Kinetics (CHK)',
    'College of Business and Financial Science (CBFS)',
    'College of Computing and Information Sciences (CCIS)',
    'College of Construction Sciences and Engineering (CCSE)',
    'College of Governance and Public Policy (CGPP)',
    'College of Engineering Technology (CET)',
    'College of Tourism and Hospitality Management (CTHM)',
    'College of Innovative Teacher Education (CITE)',
    'College of Continuing, Advanced and Professional Studies (CCAPS)',
    'Institute of Arts and Design (IAD)',
    'Institute of Accountancy (IOA)',
    'Institute of Pharmacy (IOP)',
    'Institute of Nursing (ION)',
    'Institute of Imaging Health Science (IIHS)',
    'Institute of Technical Education and Skills Training (ITEST)',
    'Institute for Social Development and Nation Building (ISDNB)',
    'Institute of Psychology (IOPsy)',
    'Institute of Social Work (ISW)',
    'Institute of Disaster and Emergency Management (IDEM)',
  ];

  // Check if institution is UMak
  const isUMak = formData.institution.toLowerCase().includes('umak') || 
                 formData.institution.toLowerCase().includes('university of makati');

  useEffect(() => {
    console.log('🔍 Step 2 useEffect triggered');
    setIsClient(true);
    
    const saved = localStorage.getItem('step2Data');
    const step1Raw = localStorage.getItem('step1Data');
    
    console.log('📦 Raw localStorage step1Data:', step1Raw);
    console.log('📦 Raw localStorage step2Data:', saved);
    
    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        
        const isEmpty = !parsedData.title && !parsedData.email && !parsedData.mobileNo;
        
        if (isEmpty && step1Raw) {
          console.log('ℹ️ Step 2 data exists but is empty, pre-filling from Step 1...');
          const step1Data = JSON.parse(step1Raw);
          
          setFormData({
            ...parsedData,
            title: step1Data.title || parsedData.title,
            researcherFirstName: step1Data.projectLeaderFirstName || parsedData.researcherFirstName,
            researcherMiddleName: step1Data.projectLeaderMiddleName || parsedData.researcherMiddleName,
            researcherLastName: step1Data.projectLeaderLastName || parsedData.researcherLastName,
            mobileNo: step1Data.projectLeaderContact || parsedData.mobileNo,
            email: step1Data.projectLeaderEmail || parsedData.email,
            coResearcher: step1Data.coAuthors || parsedData.coResearcher,
            institution: step1Data.organization === 'internal' ? 'University of Makati' : (step1Data.organization || parsedData.institution),
            technicalReviewFile: null,
          });
        } else {
          setFormData({ ...parsedData, technicalReviewFile: null });
          console.log('Loaded existing Step 2 data');
        }
      } catch (error) {
        console.error('Error loading step2 data:', error);
      }
    } else {
      console.log('No Step 2 data found, checking Step 1...');
      
      if (step1Raw) {
        try {
          const step1Data = JSON.parse(step1Raw);
          console.log('📥 Step 1 data parsed:', step1Data);
          
          setFormData(prev => ({
            ...prev,
            title: step1Data.title || '',
            researcherFirstName: step1Data.projectLeaderFirstName || '',
            researcherMiddleName: step1Data.projectLeaderMiddleName || '',
            researcherLastName: step1Data.projectLeaderLastName || '',
            mobileNo: step1Data.projectLeaderContact || '',
            email: step1Data.projectLeaderEmail || '',
            coResearcher: step1Data.coAuthors || '',
            institution: step1Data.organization === 'internal' ? 'University of Makati' : step1Data.organization || 'University of Makati',
          }));
          console.log('Pre-filled from Step 1');
        } catch (error) {
          console.error('Error loading step1 data:', error);
        }
      } else {
        console.log('No Step 1 data found in localStorage');
      }
    }
    
    isInitialMount.current = false;
  }, []);

  // Auto-save on data change
  useEffect(() => {
    if (isInitialMount.current) {
      return;
    }

    if (!isClient) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      const dataToSave = { ...formData };
      delete (dataToSave as any).technicalReviewFile;
      localStorage.setItem('step2Data', JSON.stringify(dataToSave));
      console.log('💾 Step 2 data auto-saved');
    }, 1000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [formData, isClient]);

  const handleNext = () => {
    const dataToSave = { ...formData };
    delete (dataToSave as any).technicalReviewFile;
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

  if (!isClient) {
    return (
      <SubmissionStepLayout
        stepNumber={2}
        title="Application for Ethics Review"
        description="Please accomplish this form and ensure accuracy of information."
        onBack={handleBack}
        onNext={handleNext}
        totalSteps={8}
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading form...</p>
          </div>
        </div>
      </SubmissionStepLayout>
    );
  }

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
          onChange={(val) => setFormData({ ...formData, title: val })}
          required
        />
        <TextInput
          label="Study Site"
          value={formData.studySite}
          onChange={(val) => setFormData({ ...formData, studySite: val })}
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
              onChange={(e) => setFormData({ ...formData, researcherFirstName: e.target.value })}
              className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#3B82F6] focus:outline-none text-[#1E293B]"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
              required
            />
            <input
              type="text"
              placeholder="Middle Initial"
              value={formData.researcherMiddleName}
              onChange={(e) => setFormData({ ...formData, researcherMiddleName: e.target.value })}
              className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#3B82F6] focus:outline-none text-[#1E293B]"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={formData.researcherLastName}
              onChange={(e) => setFormData({ ...formData, researcherLastName: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, telNo: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, mobileNo: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, faxNo: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
          onChange={(val) => setFormData({ ...formData, coResearcher: val })}
          placeholder="First Name MI, Last name (if multiple, separate with commas)"
          rows={2}
          helperText="If there are none, please write N/A"
        />

        {/* Institution */}
        <TextInput
          label="Institution"
          value={formData.institution}
          onChange={(val) => setFormData({ ...formData, institution: val })}
          required
        />

        {/* College/Department - Conditional Dropdown for UMak */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            College/Department <span className="text-red-600">*</span>
          </label>
          {isUMak ? (
            <select
              value={formData.college}
              onChange={(e) => setFormData({ ...formData, college: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#3B82F6] focus:outline-none text-[#1E293B]"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
              required
            >
              <option value="">Select College/Department</option>
              {umakColleges.map((college) => (
                <option key={college} value={college}>
                  {college}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={formData.college}
              onChange={(e) => setFormData({ ...formData, college: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#3B82F6] focus:outline-none text-[#1E293B]"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
              placeholder="Enter your college/department"
              required
            />
          )}
          {isUMak && (
            <p className="text-xs text-[#64748B] mt-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Select from UMak colleges and institutes
            </p>
          )}
        </div>

        {/* Address of Institution */}
        <TextInput
          label="Address of Institution"
          value={formData.institutionAddress}
          onChange={(val) => setFormData({ ...formData, institutionAddress: val })}
          required
        />

        {/* Type of Study */}
        <CheckboxGroup
          label="Type of Study"
          options={typeOfStudyOptions}
          selected={formData.typeOfStudy}
          onChange={(val) => setFormData({ ...formData, typeOfStudy: val })}
          required
        />

        {formData.typeOfStudy.includes('others') && (
          <TextInput
            label="Please specify other type of study"
            value={formData.typeOfStudyOthers}
            onChange={(val) => setFormData({ ...formData, typeOfStudyOthers: val })}
            required
          />
        )}

        {/* Study Site Type */}
        <RadioGroup
          label="Study Site Type"
          options={[
            { value: 'Multicenter (International)', label: 'Multicenter (International)' },
            { value: 'Multicenter (National)', label: 'Multicenter (National)' },
            { value: 'Single Site', label: 'Single Site' }
          ]}
          selected={formData.studySiteType}
          onChange={(val) => setFormData({ ...formData, studySiteType: val })}
          required
        />

        {/* Source of Funding */}
        <CheckboxGroup
          label="Source of Funding"
          options={fundingOptions}
          selected={formData.sourceOfFunding}
          onChange={(val) => setFormData({ ...formData, sourceOfFunding: val })}
          required
        />

        {formData.sourceOfFunding.includes('pharmaceutical') && (
          <TextInput
            label="Specify Pharmaceutical Company"
            value={formData.pharmaceuticalSponsor}
            onChange={(val) => setFormData({ ...formData, pharmaceuticalSponsor: val })}
            placeholder="Company name"
            required
          />
        )}

        {formData.sourceOfFunding.includes('others') && (
          <TextInput
            label="Specify Other Funding Source"
            value={formData.fundingOthers}
            onChange={(val) => setFormData({ ...formData, fundingOthers: val })}
            required
          />
        )}

       {/* Duration of the Study - With Calendar Icons */}
        <div>
          <label className="block text-sm font-semibold mb-3 text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Duration of the Study <span className="text-red-600">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Start Date */}
            <div>
              <label className="block text-xs font-medium mb-2 text-[#475569]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Start date
              </label>
              <div className="relative">
                <input  
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  className="w-full pl-4 pr-10 py-3 border-2 border-gray-300 rounded-lg focus:border-[#3B82F6] focus:outline-none text-[#1E293B]"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                  required
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* End Date */}
            <div>
              <label className="block text-xs font-medium mb-2 text-[#475569]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                End date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  className="w-full pl-4 pr-10 py-3 border-2 border-gray-300 rounded-lg focus:border-[#3B82F6] focus:outline-none text-[#1E293B]"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                  required
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Number of Participants */}
        <TextInput
          label="No. of study participants"
          value={formData.numParticipants}
          onChange={(val) => setFormData({ ...formData, numParticipants: val })}
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
            onChange={(val) => setFormData({ ...formData, technicalReview: val })}
            required
          />

          {formData.technicalReview === 'yes' && (
            <div className="mt-4 ml-8">
              <FileUpload
                label="Upload Technical Review Results"
                value={formData.technicalReviewFile}
                onChange={(file) => setFormData({ ...formData, technicalReviewFile: file })}
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
          onChange={(val) => setFormData({ ...formData, submittedToOther: val })}
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

          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.hasResearchProtocol}
              onChange={(e) => setFormData({ ...formData, hasResearchProtocol: e.target.checked })}
              className="w-5 h-5 text-[#3B82F6] border-2 border-gray-300 rounded focus:ring-2 focus:ring-[#3B82F6] cursor-pointer"
            />
            <span className="ml-3 text-sm text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Research Protocol
            </span>
          </label>
          {/* Informed Consent Form - Responsive nested checkbox */}
          <div className="space-y-2">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.hasInformedConsent}
                onChange={(e) => setFormData({ ...formData, hasInformedConsent: e.target.checked })}
                className="w-5 h-5 text-[#3B82F6] border-2 border-gray-300 rounded focus:ring-2 focus:ring-[#3B82F6] cursor-pointer flex-shrink-0"
              />
              <span className="ml-3 text-sm text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Informed Consent Form
              </span>
            </label>
            
            {formData.hasInformedConsent && (
              <div className="ml-6 sm:ml-8 space-y-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hasInformedConsentOthers}
                    onChange={(e) => setFormData({ ...formData, hasInformedConsentOthers: e.target.checked })}
                    className="w-5 h-5 text-[#3B82F6] border-2 border-gray-300 rounded focus:ring-2 focus:ring-[#3B82F6] cursor-pointer flex-shrink-0"
                  />
                  <span className="ml-3 text-sm text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Others (please specify)
                  </span>
                </label>
                {formData.hasInformedConsentOthers && (
                  <input
                    type="text"
                    placeholder="Specify here"
                    value={formData.informedConsentOthers}
                    onChange={(e) => setFormData({ ...formData, informedConsentOthers: e.target.value })}
                    className="ml-6 sm:ml-8 w-[calc(100%-1.5rem)] sm:w-[calc(100%-2rem)] px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#3B82F6] focus:outline-none text-[#1E293B] text-sm"
                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                  />
                )}
              </div>
            )}
          </div>

          {/* Assent Form - Responsive nested checkbox */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Assent Form (if applicable):
            </p>
            <div className="ml-6 sm:ml-8 space-y-2">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasAssentForm}
                  onChange={(e) => setFormData({ ...formData, hasAssentForm: e.target.checked })}
                  className="w-5 h-5 text-[#3B82F6] border-2 border-gray-300 rounded focus:ring-2 focus:ring-[#3B82F6] cursor-pointer flex-shrink-0"
                />
                <span className="ml-3 text-sm text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Assent Form
                </span>
              </label>
              
              {formData.hasAssentForm && (
                <div className="ml-6 sm:ml-8 space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hasAssentFormOthers}
                      onChange={(e) => setFormData({ ...formData, hasAssentFormOthers: e.target.checked })}
                      className="w-5 h-5 text-[#3B82F6] border-2 border-gray-300 rounded focus:ring-2 focus:ring-[#3B82F6] cursor-pointer flex-shrink-0"
                    />
                    <span className="ml-3 text-sm text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Others (please specify)
                    </span>
                  </label>
                  {formData.hasAssentFormOthers && (
                    <input
                      type="text"
                      placeholder="Specify here"
                      value={formData.assentFormOthers}
                      onChange={(e) => setFormData({ ...formData, assentFormOthers: e.target.value })}
                      className="ml-6 sm:ml-8 w-[calc(100%-1.5rem)] sm:w-[calc(100%-2rem)] px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#3B82F6] focus:outline-none text-[#1E293B] text-sm"
                      style={{ fontFamily: 'Metropolis, sans-serif' }}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
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
              onChange={(e) => setFormData({ ...formData, hasQuestionnaire: e.target.checked })}
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
              onChange={(e) => setFormData({ ...formData, hasDataCollectionForms: e.target.checked })}
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
              onChange={(e) => setFormData({ ...formData, hasProductBrochure: e.target.checked })}
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
              onChange={(e) => setFormData({ ...formData, hasFDAAuthorization: e.target.checked })}
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
                onChange={(e) => setFormData({ ...formData, hasSpecialPopulationPermit: e.target.checked })}
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
                onChange={(e) => setFormData({ ...formData, specialPopulationPermitDetails: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, hasOtherDocs: e.target.checked })}
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
                onChange={(e) => setFormData({ ...formData, otherDocsDetails: e.target.value })}
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
