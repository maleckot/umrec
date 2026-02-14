import { FileText, X } from 'lucide-react';

interface TechnicalReviewProps {
  formData: any;
  setFormData: (val: any) => void;
  handleInputChange: (field: string, value: string) => void;
}

export default function TechnicalReviewSection({ formData, setFormData, handleInputChange }: TechnicalReviewProps) {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Technical Review Question */}
      <div>
        <label className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
            <FileText size={16} className="text-[#F7D117]" />
          </div>
          Has the Research undergone a Technical Review? <span className="text-red-500">*</span>
        </label>
        <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white rounded-lg transition-colors">
            <input
              type="radio"
              name="technicalReview"
              value="yes"
              checked={formData.technicalReview === 'yes'}
              onChange={(e) => handleInputChange('technicalReview', e.target.value)}
              className="w-5 h-5"
            />
            <span className="text-sm text-[#071139] font-medium">Yes (please attach technical review results)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white rounded-lg transition-colors">
            <input
              type="radio"
              name="technicalReview"
              value="no"
              checked={formData.technicalReview === 'no'}
              onChange={(e) => handleInputChange('technicalReview', e.target.value)}
              className="w-5 h-5"
            />
            <span className="text-sm text-[#071139] font-medium">No</span>
          </label>
        </div>

        {/* File Upload */}
        {formData.technicalReview === 'yes' && (
          <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
            <label className="block text-sm font-bold mb-4 text-[#071139]">
              Upload Technical Review Results <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="file"
                accept=".pdf"
                id="technicalReviewFile"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                     if (file.type !== "application/pdf") { alert("Only PDF files allowed."); return; }
                     if (file.size > 10 * 1024 * 1024) { alert('File size must be < 10MB'); return; }
                     setFormData({ ...formData, technicalReviewFile: file });
                  }
                }}
              />
              <label
                htmlFor="technicalReviewFile"
                className="flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-all duration-300"
              >
                <div className="text-center">
                  <p className="text-sm font-bold text-[#071139]">
                    {formData.technicalReviewFile instanceof File
                      ? formData.technicalReviewFile.name
                      : (formData.technicalReviewFile?.name || 'Click to upload PDF')}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 font-medium">PDF ONLY (max 10MB)</p>
                </div>
              </label>
            </div>
            
            {formData.technicalReviewFile && (
               <div className="mt-3 p-3 bg-green-50 border-2 border-green-200 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <FileText size={20} className="text-green-600" />
                     <p className="text-sm font-bold text-[#071139]">{formData.technicalReviewFile.name}</p>
                  </div>
                  <button type="button" onClick={() => setFormData({...formData, technicalReviewFile: null})} className="p-2 text-red-500">
                     <X size={20} />
                  </button>
               </div>
            )}
          </div>
        )}
      </div>

      {/* Submitted to Another UMREC */}
      <div>
        <label className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
            <FileText size={16} className="text-[#F7D117]" />
          </div>
          Has the Research been submitted to another UMREC? <span className="text-red-500">*</span>
        </label>
        <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
           {['yes', 'no'].map(val => (
             <label key={val} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white rounded-lg transition-colors">
                <input
                    type="radio" name="submittedToOther" value={val}
                    checked={formData.submittedToOther === val}
                    onChange={(e) => handleInputChange('submittedToOther', e.target.value)}
                    className="w-5 h-5"
                />
                <span className="text-sm text-[#071139] font-medium capitalize">{val}</span>
             </label>
           ))}
        </div>
      </div>
    </div>
  );
}
