import { Upload, FileText, AlertCircle, X } from 'lucide-react';
import { useRef } from 'react';

interface FormProps {
  formData: {
    recType: 'own' | 'not-own' | 'phreb' | '';
    isAccredited: 'yes' | 'no' | '';
    uploadedFile: File | null;
  };
  setFormData: (data: any) => void;
  fileName: string;
  setFileName: (name: string) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveFile: () => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export default function Step3ExternalForm({
  formData,
  setFormData,
  fileName,
  fileInputRef,
  handleFileChange,
  handleRemoveFile,
  handleSubmit,
}: FormProps) {

  const formatFileSize = (bytes: number): string => {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const RadioOption = ({ 
    label, 
    value, 
    group, 
    currentValue, 
    onChange 
  }: { 
    label: string; 
    value: string; 
    group: string; 
    currentValue: string; 
    onChange: (val: string) => void 
  }) => (
    <label className="flex items-start gap-3 cursor-pointer group p-3 sm:p-4 rounded-xl hover:bg-orange-50 transition-colors border-2 border-transparent hover:border-orange-200 bg-gray-50/50">
      <input
        type="radio"
        name={group}
        value={value}
        checked={currentValue === value}
        onChange={(e) => onChange(e.target.value)}
        className="w-5 h-5 text-orange-600 focus:ring-2 focus:ring-orange-500/20 cursor-pointer flex-shrink-0 mt-0.5"
        required
      />
      <span className="text-sm sm:text-base text-[#071139] group-hover:text-orange-700 transition-colors flex-1 font-bold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        {label}
      </span>
    </label>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
      
      {/* Type of REC */}
      <div>
        <label className="block text-sm sm:text-base font-bold mb-4 text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Type of Research Ethics Committee/Board <span className="text-red-500">*</span>
        </label>
        <div className="space-y-3">
          <RadioOption 
            label="Under our own organization" 
            value="own" 
            group="recType" 
            currentValue={formData.recType} 
            onChange={(val) => setFormData({ ...formData, recType: val })} 
          />
          <RadioOption 
            label="Not under own organization" 
            value="not-own" 
            group="recType" 
            currentValue={formData.recType} 
            onChange={(val) => setFormData({ ...formData, recType: val })} 
          />
          <RadioOption 
            label="Philippine Research Ethics Board (PHREB) itself" 
            value="phreb" 
            group="recType" 
            currentValue={formData.recType} 
            onChange={(val) => setFormData({ ...formData, recType: val })} 
          />
        </div>
      </div>

      {/* Is Accredited */}
      <div>
        <label className="block text-sm sm:text-base font-bold mb-4 text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Certifying Research Ethics Committee/Board is accredited by PHREB? <span className="text-red-500">*</span>
        </label>
        <div className="space-y-3">
          <RadioOption 
            label="Yes" 
            value="yes" 
            group="isAccredited" 
            currentValue={formData.isAccredited} 
            onChange={(val) => setFormData({ ...formData, isAccredited: val })} 
          />
          <RadioOption 
            label="No" 
            value="no" 
            group="isAccredited" 
            currentValue={formData.isAccredited} 
            onChange={(val) => setFormData({ ...formData, isAccredited: val })} 
          />
        </div>
      </div>

      {/* File Upload */}
      <div>
        <label className="block text-sm sm:text-base font-bold mb-3 text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Upload the <span className="font-extrabold underline decoration-orange-400">Consolidated Files for Research Request</span> (Should include Decision Letter or Research Ethics Clearance). <span className="text-red-500">*</span>
        </label>

        <div className="mb-3 space-y-1">
          <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-700 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            <AlertCircle size={16} className="text-orange-600 flex-shrink-0 mt-0.5" />
            <span>PDF only • Max 10 MB</span>
          </div>
          <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-700 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            <AlertCircle size={16} className="text-orange-600 flex-shrink-0 mt-0.5" />
            <span>Filename must contain: "Consolidated Files" or "Research Request"</span>
          </div>
        </div>

        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            id="fileUpload"
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf"
            required={!formData.uploadedFile}
          />
          
          {!fileName ? (
            <label
              htmlFor="fileUpload"
              className="flex flex-col items-center justify-center w-full border-2 border-dashed border-orange-300 rounded-xl p-6 sm:p-8 cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-all duration-300 bg-white"
            >
              <Upload size={40} className="text-orange-400 mb-3 sm:mb-4" />
              <div className="text-center">
                <p className="text-sm sm:text-base text-gray-800 font-bold mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-600 mb-1 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  PDF file up to 10 MB
                </p>
                <p className="text-xs text-gray-600 mt-2 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Example: "Consolidated Files.pdf" or "Research Request.pdf"
                </p>
              </div>
            </label>
          ) : (
            <div className="border-2 border-orange-500 rounded-xl p-4 bg-gradient-to-r from-orange-50 to-orange-100/50">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                    <FileText size={20} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base text-[#071139] font-bold truncate" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      {fileName}
                    </p>
                    {formData.uploadedFile && (
                      <p className="text-xs text-gray-700 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {formatFileSize(formData.uploadedFile.size)}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="ml-3 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors flex-shrink-0 shadow-md"
                  aria-label="Remove file"
                >
                  <X size={16} className="text-white" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-8 mt-8 border-t-2 border-gray-200">
        <button
          type="submit"
          className="group relative px-10 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl hover:scale-105 overflow-hidden"
          style={{ fontFamily: 'Metropolis, sans-serif' }}
          aria-label="Save changes"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 opacity-50"></span>
          <span className="relative z-10 flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            Save Changes
          </span>
        </button>
      </div>
    </form>
  );
}
