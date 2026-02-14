import { CheckSquare, Info } from 'lucide-react';
import Tooltip from './Tooltip';

interface ChecklistProps {
  formData: any;
  setFormData: (val: any) => void;
  handleCheckAll: () => void;
  handleUncheckAll: () => void;
}

export default function DocumentChecklistSection({ formData, setFormData, handleCheckAll, handleUncheckAll }: ChecklistProps) {
  
  const checkboxClass = "w-5 h-5 rounded cursor-pointer";
  const labelTextClass = "text-sm text-[#071139] flex-1 font-medium";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#F7D117]/10 to-[#B8860B]/10 border-l-4 border-[#F7D117] p-6 rounded-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <h3 className="font-bold text-[#071139] text-lg flex items-center gap-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            <CheckSquare size={20} />
            2. Checklist of Documents
          </h3>
          <div className="flex gap-2">
            <button type="button" onClick={handleCheckAll} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm font-bold">Check All</button>
            <button type="button" onClick={handleUncheckAll} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm font-bold">Uncheck All</button>
          </div>
        </div>
      </div>

      <fieldset>
        <legend className="font-bold text-[#071139] text-lg mb-4">Basic Requirements:</legend>
        <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-not-allowed opacity-75 p-3 bg-gray-50 rounded-lg">
                <input type="checkbox" checked={true} disabled className="w-5 h-5 rounded cursor-not-allowed" />
                <span className={labelTextClass}>Application for Ethics Review</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <input type="checkbox" checked={formData.hasResearchProtocol} onChange={(e) => setFormData({ ...formData, hasResearchProtocol: e.target.checked })} className={checkboxClass} />
                <span className={labelTextClass}>Research Protocol</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <input type="checkbox" checked={formData.hasInformedConsent} onChange={(e) => setFormData({ ...formData, hasInformedConsent: e.target.checked })} className={checkboxClass} />
                <span className={labelTextClass}>Informed Consent Form</span>
            </label>
            {formData.hasInformedConsent && (
                 <div className="ml-11 space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer p-2">
                        <input type="checkbox" checked={formData.hasInformedConsentOthers} onChange={(e) => setFormData({ ...formData, hasInformedConsentOthers: e.target.checked })} className={checkboxClass} />
                        <span className={labelTextClass}>Others (please specify)</span>
                    </label>
                    {formData.hasInformedConsentOthers && (
                        <input type="text" placeholder="Specify here" value={formData.informedConsentOthers} onChange={(e) => setFormData({ ...formData, informedConsentOthers: e.target.value })} className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl font-medium text-[#071139]" />
                    )}
                 </div>
            )}

            <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
               <p className="text-sm font-bold text-[#071139]">Assent Form (if applicable)</p>
            </div>
            <div className="ml-6 space-y-2">
                 <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <input type="checkbox" checked={formData.hasAssentForm} onChange={(e) => setFormData({ ...formData, hasAssentForm: e.target.checked })} className={checkboxClass} />
                    <span className={labelTextClass}>Assent Form</span>
                 </label>
                 {formData.hasAssentForm && (
                     <div className="ml-11 space-y-2">
                        <label className="flex items-center gap-3 cursor-pointer p-2">
                            <input type="checkbox" checked={formData.hasAssentFormOthers} onChange={(e) => setFormData({ ...formData, hasAssentFormOthers: e.target.checked })} className={checkboxClass} />
                            <span className={labelTextClass}>Others (please specify)</span>
                        </label>
                        {formData.hasAssentFormOthers && (
                            <input type="text" placeholder="Specify here" value={formData.assentFormOthers} onChange={(e) => setFormData({ ...formData, assentFormOthers: e.target.value })} className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl font-medium text-[#071139]" />
                        )}
                     </div>
                 )}
            </div>
            
            <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <input type="checkbox" checked={formData.hasEndorsementLetter} onChange={(e) => setFormData({ ...formData, hasEndorsementLetter: e.target.checked })} className={checkboxClass} />
                <span className={labelTextClass}>Endorsement Letter</span>
            </label>
             <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <input type="checkbox" checked={formData.hasQuestionnaire} onChange={(e) => setFormData({ ...formData, hasQuestionnaire: e.target.checked })} className={checkboxClass} />
                <span className={labelTextClass}>Questionnaire (if applicable)</span>
            </label>
        </div>
      </fieldset>

      <div className="space-y-4">
         <h5 className="font-bold text-[#071139] text-lg">Supplementary Documents:</h5>
         {['hasTechnicalReview', 'hasDataCollectionForms', 'hasProductBrochure', 'hasFDAAuthorization', 'hasCompanyPermit'].map((key) => (
             <label key={key} className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <input type="checkbox" checked={formData[key]} onChange={(e) => setFormData({ ...formData, [key]: e.target.checked })} className={checkboxClass} />
                <span className={labelTextClass}>{key.replace('has', '').replace(/([A-Z])/g, ' $1').trim()}</span>
             </label>
         ))}

         <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition-colors">
             <input type="checkbox" checked={formData.hasSpecialPopulationPermit} onChange={(e) => setFormData({ ...formData, hasSpecialPopulationPermit: e.target.checked })} className={checkboxClass} />
             <span className={labelTextClass}>Permit/s for special populations</span>
         </label>
         {formData.hasSpecialPopulationPermit && (
             <input type="text" placeholder="Specify details" value={formData.specialPopulationPermitDetails} onChange={(e) => setFormData({ ...formData, specialPopulationPermitDetails: e.target.value })} className="ml-11 w-[calc(100%-2.75rem)] px-4 py-2 border-2 border-gray-300 rounded-xl font-medium text-[#071139]" />
         )}

         <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition-colors">
             <input type="checkbox" checked={formData.hasOtherDocs} onChange={(e) => setFormData({ ...formData, hasOtherDocs: e.target.checked })} className={checkboxClass} />
             <span className={labelTextClass}>Others (please specify)</span>
         </label>
         {formData.hasOtherDocs && (
             <textarea placeholder="Specify other documents" value={formData.otherDocsDetails} onChange={(e) => setFormData({ ...formData, otherDocsDetails: e.target.value })} rows={3} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl font-medium text-[#071139]" />
         )}
      </div>
    </div>
  );
}
