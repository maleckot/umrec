'use client';
import { CheckSquare, Info } from 'lucide-react';
import Tooltip from '@/components/researcher/submission/shared/Tooltip';

interface ChecklistProps {
  formData: any;
  setFormData: (val: any) => void;
  renderPDFUpload: (key: string, fileState: File | null, setFile: (f: File | null) => void) => React.ReactNode;
}

export default function ChecklistDocuments({ formData, setFormData, renderPDFUpload }: ChecklistProps) {
  
  const handleCheckAll = () => {
    setFormData((prev: any) => ({
      ...prev,
      hasResearchProtocol: true,
      hasInformedConsent: true,
      hasEndorsementLetter: true,
      hasQuestionnaire: true,
      hasTechnicalReview: true,
      hasDataCollectionForms: true,
      hasProductBrochure: true,
      hasFDAAuthorization: true,
      hasCompanyPermit: true,
      hasSpecialPopulationPermit: true,
      hasOtherDocs: true,
    }));
  };

  const handleUncheckAll = () => {
    setFormData((prev: any) => ({
      ...prev,
      hasResearchProtocol: false,
      hasInformedConsent: false,
      hasEndorsementLetter: false,
      hasQuestionnaire: false,
      hasTechnicalReview: false,
      hasDataCollectionForms: false,
      hasProductBrochure: false,
      hasFDAAuthorization: false,
      hasCompanyPermit: false,
      hasSpecialPopulationPermit: false,
      hasOtherDocs: false,
    }));
  };

  return (
    <div className="bg-gradient-to-r from-[#F7D117]/10 to-[#B8860B]/10 border-l-4 border-[#F7D117] p-6 rounded-xl mt-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <h3 className="font-bold text-[#071139] text-lg flex items-center gap-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          <CheckSquare size={20} /> 2. Checklist of Documents
        </h3>
        <div className="flex gap-2">
          <button type="button" onClick={handleCheckAll} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-semibold">Check All</button>
          <button type="button" onClick={handleUncheckAll} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-semibold">Uncheck All</button>
        </div>
      </div>

      <fieldset>
         <legend className="font-semibold text-[#071139] text-lg mb-4" style={{ fontFamily: 'Metropolis, sans-serif' }}>Basic Requirements:</legend>
         <div className="space-y-4">
            {/* Basic fixed item */}
            <label className="flex items-center gap-3 cursor-not-allowed opacity-75 p-3 bg-gray-50 rounded-lg"><input type="checkbox" checked={true} disabled className="w-5 h-5 rounded cursor-not-allowed" /><span className="text-sm text-[#071139] flex-1">Application for Ethics Review</span><Tooltip text="Included automatically"><Info size={18} className="text-gray-400" /></Tooltip></label>
            
            <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition-colors"><input type="checkbox" checked={formData.hasResearchProtocol} onChange={(e) => setFormData((p:any) => ({...p, hasResearchProtocol: e.target.checked}))} className="w-5 h-5 rounded" /><span className="text-sm text-[#071139] flex-1">Research Protocol</span></label>
            
            <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition-colors"><input type="checkbox" checked={formData.hasInformedConsent} onChange={(e) => setFormData((p:any) => ({...p, hasInformedConsent: e.target.checked}))} className="w-5 h-5 rounded" /><span className="text-sm text-[#071139] flex-1">Informed Consent Form</span></label>
            {formData.hasInformedConsent && (
               <div className="ml-8 sm:ml-11 space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors"><input type="checkbox" checked={formData.hasInformedConsentOthers} onChange={(e) => setFormData((p:any) => ({...p, hasInformedConsentOthers: e.target.checked}))} className="w-5 h-5 rounded" /><span className="text-sm text-[#071139]">Others (please specify)</span></label>
                  {formData.hasInformedConsentOthers && <input type="text" placeholder="Specify here" value={formData.informedConsentOthers} onChange={(e) => setFormData((p:any) => ({...p, informedConsentOthers: e.target.value}))} className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none" />}
               </div>
            )}
            
            <div className="space-y-2"><div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded-lg"><p className="text-sm font-semibold text-[#071139] mb-2">Assent Form (if applicable):</p><p className="text-xs text-gray-600">Required when research involves minors or vulnerable populations</p></div><div className="ml-4 sm:ml-6 space-y-2"><label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition-colors"><input type="checkbox" checked={formData.hasAssentForm} onChange={(e) => setFormData((p:any) => ({...p, hasAssentForm: e.target.checked}))} className="w-5 h-5 rounded" /><span className="text-sm text-[#071139] flex-1">Assent Form</span></label></div></div>

            <div>
                <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition-colors"><input type="checkbox" checked={formData.hasEndorsementLetter} onChange={(e) => setFormData((p:any) => ({...p, hasEndorsementLetter: e.target.checked}))} className="w-5 h-5 rounded" /><span className="text-sm text-[#071139] flex-1">Endorsement Letter</span></label>
                {formData.hasEndorsementLetter && renderPDFUpload('endorsement', formData.endorsementLetterFile, (f) => setFormData((p:any) => ({...p, endorsementLetterFile: f})))}
            </div>

            <div>
               <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition-colors"><input type="checkbox" checked={formData.hasQuestionnaire} onChange={(e) => setFormData((p:any) => ({...p, hasQuestionnaire: e.target.checked}))} className="w-5 h-5 rounded" /><span className="text-sm text-[#071139] flex-1">Questionnaire (if applicable)</span></label>
               {formData.hasQuestionnaire && renderPDFUpload('questionnaire', formData.questionnaireFile, (f) => setFormData((p:any) => ({...p, questionnaireFile: f})))}
            </div>
         </div>
      </fieldset>

      <div className="space-y-4 mt-6">
         <h5 className="font-semibold text-[#071139] text-lg">Supplementary Documents:</h5>
         
         <div>
            <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition-colors"><input type="checkbox" checked={formData.hasTechnicalReview} onChange={(e) => setFormData((p:any) => ({...p, hasTechnicalReview: e.target.checked}))} className="w-5 h-5 rounded" /><span className="text-sm text-[#071139] flex-1">Technical review/pre-oral defense (Any documentary proof)</span></label>
            {formData.hasTechnicalReview && renderPDFUpload('checklistTechnicalReview', formData.checklistTechnicalReviewFile, (f) => setFormData((p:any) => ({...p, checklistTechnicalReviewFile: f})))}
         </div>

         <div>
            <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition-colors"><input type="checkbox" checked={formData.hasDataCollectionForms} onChange={(e) => setFormData((p:any) => ({...p, hasDataCollectionForms: e.target.checked}))} className="w-5 h-5 rounded" /><span className="text-sm text-[#071139] flex-1">Data Collection Forms (if applicable)</span></label>
            {formData.hasDataCollectionForms && renderPDFUpload('dataCollection', formData.dataCollectionFormsFile, (f) => setFormData((p:any) => ({...p, dataCollectionFormsFile: f})))}
         </div>

         <div>
            <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition-colors"><input type="checkbox" checked={formData.hasProductBrochure} onChange={(e) => setFormData((p:any) => ({...p, hasProductBrochure: e.target.checked}))} className="w-5 h-5 rounded" /><span className="text-sm text-[#071139] flex-1">Product Brochure (if applicable)</span></label>
            {formData.hasProductBrochure && renderPDFUpload('productBrochure', formData.productBrochureFile, (f) => setFormData((p:any) => ({...p, productBrochureFile: f})))}
         </div>

         <div>
            <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition-colors"><input type="checkbox" checked={formData.hasFDAAuthorization} onChange={(e) => setFormData((p:any) => ({...p, hasFDAAuthorization: e.target.checked}))} className="w-5 h-5 rounded" /><span className="text-sm text-[#071139] flex-1">Philippine FDA Marketing Authorization or Import License (if applicable)</span></label>
            {formData.hasFDAAuthorization && renderPDFUpload('fdaAuthorization', formData.fdaAuthorizationFile, (f) => setFormData((p:any) => ({...p, fdaAuthorizationFile: f})))}
         </div>

         <div>
            <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition-colors"><input type="checkbox" checked={formData.hasCompanyPermit} onChange={(e) => setFormData((p:any) => ({...p, hasCompanyPermit: e.target.checked}))} className="w-5 h-5 rounded" /><span className="text-sm text-[#071139] flex-1">Permit/s for the use of company name</span></label>
            {formData.hasCompanyPermit && renderPDFUpload('companyPermit', formData.companyPermitFile, (f) => setFormData((p:any) => ({...p, companyPermitFile: f})))}
         </div>
         
         <div>
            <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition-colors"><input type="checkbox" checked={formData.hasSpecialPopulationPermit} onChange={(e) => setFormData((p:any) => ({...p, hasSpecialPopulationPermit: e.target.checked}))} className="w-5 h-5 rounded" /><span className="text-sm text-[#071139] flex-1">Permit/s for special populations</span></label>
            {formData.hasSpecialPopulationPermit && (
               <div className="animate-fade-in">
                  <input type="text" placeholder="Specify special population details" value={formData.specialPopulationPermitDetails} onChange={(e) => setFormData((p:any) => ({...p, specialPopulationPermitDetails: e.target.value}))} className="ml-11 w-[calc(100%-2.75rem)] px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none mb-2" />
                  {renderPDFUpload('specialPopulation', formData.specialPopulationPermitFile, (f) => setFormData((p:any) => ({...p, specialPopulationPermitFile: f})))}
               </div>
            )}
         </div>

         <div>
            <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition-colors"><input type="checkbox" checked={formData.hasOtherDocs} onChange={(e) => setFormData((p:any) => ({...p, hasOtherDocs: e.target.checked}))} className="w-5 h-5 rounded" /><span className="text-sm text-[#071139] flex-1">Others (please specify)</span></label>
            {formData.hasOtherDocs && (
               <div className="animate-fade-in">
                  <textarea placeholder="Specify other documents" value={formData.otherDocsDetails} onChange={(e) => setFormData((p:any) => ({...p, otherDocsDetails: e.target.value}))} rows={3} className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none text-[#071139] mb-2" />
                  {renderPDFUpload('otherDocs', formData.otherDocsFile, (f) => setFormData((p:any) => ({...p, otherDocsFile: f})))}
               </div>
            )}
         </div>
      </div>
    </div>
  );
}
