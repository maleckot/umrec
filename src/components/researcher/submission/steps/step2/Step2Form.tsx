'use client';
import { FileText, Building, User, Phone, Mail, Calendar, Users, Trash2, AlertCircle, Info, X } from 'lucide-react';
import CoResearcherList from './CoResearcherList';
import TechnicalAdviserList from './TechnicalAdviserList';
import ChecklistDocuments from './ChecklistDocuments';
import Tooltip from '@/components/researcher/submission/shared/Tooltip';

interface Step2FormProps {
  formData: any;
  errors: Record<string, string>;
  coResearchers: any[];
  setCoResearchers: (val: any[]) => void;
  technicalAdvisers: any[];
  setTechnicalAdvisers: (val: any[]) => void;
  handleInputChange: (field: string, value: any) => void;
  setFormData: (val: any) => void;
  renderPDFUpload: (key: string, fileState: File | null, setFile: (f: File | null) => void) => React.ReactNode;
  handleNext: () => void;
  handleBack: () => void;
}

export default function Step2Form({ 
  formData, 
  errors, 
  coResearchers, 
  setCoResearchers, 
  technicalAdvisers, 
  setTechnicalAdvisers, 
  handleInputChange,
  setFormData,
  renderPDFUpload,
  handleNext,
  handleBack
}: Step2FormProps) {
  
  const isUMak = formData.institution.toLowerCase().includes('umak') || formData.institution.toLowerCase().includes('university of makati');

  const umakColleges = [
    'College of Liberal Arts and Sciences (CLAS)', 'College of Human Kinetics (CHK)', 'College of Business and Financial Science (CBFS)',
    'College of Computing and Information Sciences (CCIS)', 'College of Construction Sciences and Engineering (CCSE)', 'College of Governance and Public Policy (CGPP)',
    'College of Engineering Technology (CET)', 'College of Tourism and Hospitality Management (CTHM)', 'College of Innovative Teacher Education (CITE)',
    'College of Continuing, Advanced and Professional Studies (CCAPS)', 'Institute of Arts and Design (IAD)', 'Institute of Accountancy (IOA)',
    'Institute of Pharmacy (IOP)', 'Institute of Nursing (ION)', 'Institute of Imaging Health Science (IIHS)', 'Institute of Technical Education and Skills Training (ITEST)',
    'Institute for Social Development and Nation Building (ISDNB)', 'Institute of Psychology (IOPsy)', 'Institute of Social Work (ISW)', 'Institute of Disaster and Emergency Management (IDEM)',
  ];

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

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-8 md:p-10 lg:p-12">
      <form className="space-y-6 sm:space-y-8" onSubmit={(e) => { e.preventDefault(); handleNext(); }}>

        {/* Section 1 Header */}
        <div className="bg-gradient-to-r from-[#071139]/10 to-[#003366]/10 border-l-4 border-[#071139] p-6 rounded-xl">
          <h4 className="font-bold text-[#071139] text-lg mb-2 flex items-center gap-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            <FileText size={20} /> 1. General Information
          </h4>
          <p className="text-sm text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Fields marked with <span className="text-red-500">*</span> are required. Some information pre-filled from Step 1.
          </p>
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md">
              <FileText size={16} className="text-[#F7D117]" />
            </div>
            Title of Study <span className="text-red-500">*</span>
          </label>
          <input id="title" type="text" value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)} className={`w-full px-4 sm:px-5 py-3 sm:py-4 border-2 rounded-xl focus:ring-2 focus:outline-none text-[#071139] transition-all duration-300 ${errors.title ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-[#071139] focus:ring-[#071139]/20 hover:border-gray-400'}`} style={{ fontFamily: 'Metropolis, sans-serif' }} required />
          {errors.title && <p className="text-red-500 text-sm mt-2 flex items-center gap-1" style={{ fontFamily: 'Metropolis, sans-serif' }}><AlertCircle size={16} /> {errors.title}</p>}
        </div>

        {/* Study Site */}
        <div>
           <label htmlFor="studySite" className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md">
                 <Building size={16} className="text-[#F7D117]" />
              </div>
              Study Site <span className="text-red-500">*</span>
           </label>
           <input id="studySite" type="text" value={formData.studySite} onChange={(e) => handleInputChange('studySite', e.target.value)} className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none text-[#071139] transition-all duration-300 hover:border-gray-400" style={{ fontFamily: 'Metropolis, sans-serif' }} required />
        </div>

        {/* Name of Researcher */}
        <div>
          <div className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md">
              <User size={16} className="text-[#F7D117]" />
            </div>
            <span>Name of Researcher <span className="text-red-500">*</span></span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
             <div><label className="block text-xs font-medium mb-1 text-gray-600">First Name</label><input type="text" placeholder="First Name" value={formData.researcherFirstName} onChange={(e) => handleInputChange('researcherFirstName', e.target.value)} className="w-full px-4 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none text-[#071139]" required /></div>
             <div><label className="block text-xs font-medium mb-1 text-gray-600">Middle Name</label><input type="text" placeholder="Middle Name" value={formData.researcherMiddleName} onChange={(e) => handleInputChange('researcherMiddleName', e.target.value)} className="w-full px-4 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none text-[#071139]" /></div>
             <div><label className="block text-xs font-medium mb-1 text-gray-600">Last Name</label><input type="text" placeholder="Last Name" value={formData.researcherLastName} onChange={(e) => handleInputChange('researcherLastName', e.target.value)} className="w-full px-4 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none text-[#071139]" required /></div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
              <label className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md"><Phone size={16} className="text-[#F7D117]" /></div>Mobile No <span className="text-red-500">*</span></label>
              <input type="tel" maxLength={11} value={formData.mobileNo} onChange={(e) => { const val = e.target.value.replace(/\D/g, ''); if(val.length <= 11) handleInputChange('mobileNo', val); }} className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none text-[#071139]" required />
           </div>
           <div>
              <label className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md"><Mail size={16} className="text-[#F7D117]" /></div>Email <span className="text-red-500">*</span></label>
              <input type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none text-[#071139]" required />
           </div>
        </div>

        {/* Co-Researchers & Technical Advisers */}
        <CoResearcherList coResearchers={coResearchers} setCoResearchers={setCoResearchers} />
        <TechnicalAdviserList advisers={technicalAdvisers} setAdvisers={setTechnicalAdvisers} />

        {/* Institution Fields */}
        <div>
           <label className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md"><Building size={16} className="text-[#F7D117]" /></div>Institution <span className="text-red-500">*</span></label>
           <input type="text" value={formData.institution} onChange={(e) => handleInputChange('institution', e.target.value)} placeholder="University of Makati" className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none text-[#071139]" required />
        </div>

        <div>
           <label className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md"><Building size={16} className="text-[#F7D117]" /></div>College/Department <span className="text-red-500">*</span></label>
           {isUMak ? (
              <select value={formData.college} onChange={(e) => handleInputChange('college', e.target.value)} className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none text-[#071139] cursor-pointer" required>
                 <option value="">Select College/Department</option>
                 {umakColleges.map((col) => <option key={col} value={col}>{col}</option>)}
              </select>
           ) : (
              <input type="text" value={formData.college} onChange={(e) => handleInputChange('college', e.target.value)} placeholder="Enter your college/department" className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none text-[#071139]" required />
           )}
        </div>
        
        <div>
            <label className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md"><Building size={16} className="text-[#F7D117]" /></div>Address of Institution <span className="text-red-500">*</span></label>
            <input type="text" value={formData.institutionAddress} onChange={(e) => handleInputChange('institutionAddress', e.target.value)} placeholder="J.P. Rizal Extension, West Rembo, Makati City" className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none text-[#071139]" required />
        </div>

        {/* Type of Study */}
        <div>
           <label className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md flex-shrink-0"><FileText size={16} className="text-[#F7D117]" /></div><span className="flex-1">Type of Study <span className="text-red-500">*</span></span><Tooltip text="Select all types that apply"><Info size={18} className="text-gray-400 cursor-help" /></Tooltip></label>
           <div className="space-y-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
              {studyTypes.map((option) => (
                 <div key={option.value}>
                    <label className="flex items-start gap-3 cursor-pointer p-3 hover:bg-white rounded-lg transition-colors group">
                       <input type="checkbox" checked={formData.typeOfStudy.includes(option.value)} onChange={(e) => {
                          const newTypes = e.target.checked ? [...formData.typeOfStudy, option.value] : formData.typeOfStudy.filter((v:string) => v !== option.value);
                          setFormData({...formData, typeOfStudy: newTypes});
                       }} className="w-5 h-5 min-w-[1.25rem] rounded mt-0.5 text-[#071139] focus:ring-2 focus:ring-[#071139] border-gray-300 cursor-pointer" />
                       <span className="text-sm text-[#071139] leading-snug flex-1">{option.label}</span>
                    </label>
                    {option.value === 'others' && formData.typeOfStudy.includes('others') && (
                       <div className="ml-11 mr-3 mb-2">
                          <input type="text" placeholder="Please specify other type of study" value={formData.typeOfStudyOthers} onChange={(e) => handleInputChange('typeOfStudyOthers', e.target.value)} className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none text-[#071139] bg-white" required />
                       </div>
                    )}
                 </div>
              ))}
           </div>
        </div>

        {/* Study Site Type & Source of Funding - Add similar blocks here */}
        
        {/* Duration */}
        <div>
           <div className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md"><Calendar size={16} className="text-[#F7D117]" /></div><span>Duration of the Study <span className="text-red-500">*</span></span></div>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="block text-xs font-medium mb-2 text-gray-600">Start date</label><div className="relative"><input type="date" value={formData.startDate} onChange={(e) => handleInputChange('startDate', e.target.value)} className="w-full pl-4 pr-10 py-3 border-2 border-gray-300 rounded-xl focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none text-[#071139]" required /><Calendar size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" /></div></div>
              <div><label className="block text-xs font-medium mb-2 text-gray-600">End date</label><div className="relative"><input type="date" value={formData.endDate} onChange={(e) => handleInputChange('endDate', e.target.value)} className="w-full pl-4 pr-10 py-3 border-2 border-gray-300 rounded-xl focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none text-[#071139]" required /><Calendar size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" /></div></div>
           </div>
        </div>

        {/* Participants */}
        <div>
            <label htmlFor="numParticipants" className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md"><Users size={16} className="text-[#F7D117]" /></div>No. of study participants <span className="text-red-500">*</span></label>
            <input id="numParticipants" type="number" value={formData.numParticipants} onChange={(e) => handleInputChange('numParticipants', e.target.value)} placeholder="e.g., 100" className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none text-[#071139]" required />
        </div>

        {/* Technical Review Radio + Upload */}
        <div>
           <label className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md"><FileText size={16} className="text-[#F7D117]" /></div>Has the Research undergone a Technical Review? <span className="text-red-500">*</span></label>
           <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
               <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white rounded-lg transition-colors"><input type="radio" name="technicalReview" value="yes" checked={formData.technicalReview === 'yes'} onChange={(e) => handleInputChange('technicalReview', e.target.value)} className="w-5 h-5" /><span className="text-sm text-[#071139]">Yes (please attach technical review results)</span></label>
               <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white rounded-lg transition-colors"><input type="radio" name="technicalReview" value="no" checked={formData.technicalReview === 'no'} onChange={(e) => handleInputChange('technicalReview', e.target.value)} className="w-5 h-5" /><span className="text-sm text-[#071139]">No</span></label>
           </div>
           {formData.technicalReview === 'yes' && (
              <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                 <label className="block text-sm font-semibold mb-3 text-[#071139]">Upload Technical Review Results <span className="text-red-500">*</span></label>
                 <div className="relative">
                    <input type="file" accept=".pdf" id="technicalReviewFile" className="hidden" onChange={(e) => {
                       const file = e.target.files?.[0];
                       if (file) { setFormData({...formData, technicalReviewFile: file, technicalReviewFileName: file.name, technicalReviewFileSize: file.size}); }
                    }} required />
                    <label htmlFor="technicalReviewFile" className="flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-dashed border-[#071139] rounded-xl cursor-pointer hover:bg-gray-50 transition-all duration-300 group">
                       <div className="text-center"><p className="text-sm font-semibold text-[#071139]">{formData.technicalReviewFile ? formData.technicalReviewFile.name : 'Click to upload file'}</p></div>
                    </label>
                 </div>
                 {formData.technicalReviewFile && <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between"><p className="text-sm font-semibold text-[#071139]">{formData.technicalReviewFile.name}</p><button type="button" onClick={() => setFormData({ ...formData, technicalReviewFile: null })} className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"><X size={18} /></button></div>}
              </div>
           )}
        </div>

        {/* Submitted to Another UMREC */}
        <div>
            <label className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md"><FileText size={16} className="text-[#F7D117]" /></div>Has the Research been submitted to another UMREC? <span className="text-red-500">*</span></label>
            <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
               <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white rounded-lg transition-colors"><input type="radio" name="submittedToOther" value="yes" checked={formData.submittedToOther === 'yes'} onChange={(e) => handleInputChange('submittedToOther', e.target.value)} className="w-5 h-5" /><span className="text-sm text-[#071139]">Yes</span></label>
               <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white rounded-lg transition-colors"><input type="radio" name="submittedToOther" value="no" checked={formData.submittedToOther === 'no'} onChange={(e) => handleInputChange('submittedToOther', e.target.value)} className="w-5 h-5" /><span className="text-sm text-[#071139]">No</span></label>
            </div>
        </div>

        {/* Full Checklist Component */}
        <ChecklistDocuments formData={formData} setFormData={setFormData} renderPDFUpload={renderPDFUpload} />

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 mt-8 border-t-2 border-gray-200">
          <button type="button" onClick={handleBack} className="w-full sm:w-auto px-10 sm:px-12 py-3 sm:py-4 bg-gray-200 text-[#071139] rounded-xl hover:bg-gray-300 transition-all duration-300 font-bold text-base sm:text-lg shadow-lg hover:shadow-xl hover:scale-105"><span className="flex items-center justify-center gap-2"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 17l-5-5m0 0l5-5m-5 5h12" /></svg> Previous Step</span></button>
          <button type="submit" className="group relative px-10 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-[#071139] to-[#003366] text-white rounded-xl hover:from-[#003366] hover:to-[#071139] transition-all duration-300 font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl hover:scale-105 overflow-hidden"><span className="absolute inset-0 bg-gradient-to-r from-[#F7D117] via-white/10 to-[#F7D117] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 opacity-20"></span><span className="relative z-10 flex items-center justify-center gap-2">Next Step <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></span></button>
        </div>

      </form>
    </div>
  );
}
