import { UploadCloud, X } from 'lucide-react';
import { useRef } from 'react';

interface SignatureProps {
  signatureImage: string | null;
  handleSignatureUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeSignature: () => void;
}

export default function SignatureSection({ signatureImage, handleSignatureUpload, removeSignature }: SignatureProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const labelClass = "block text-sm font-bold text-[#071139] mb-2 uppercase tracking-wide";

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const clearSignature = () => {
    removeSignature();
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border-t-4 border-orange-500 overflow-hidden p-6 md:p-8">
      <h2 className="text-xl font-bold text-[#071139] mb-6" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        Authorization
      </h2>
      
      <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
        {/* Signature Upload */}
        <div className="flex-1 w-full">
          <label className={labelClass}>Signature of Researcher</label>
          
          {!signatureImage ? (
            <div 
              className="border-2 border-dashed border-gray-300 rounded-xl p-6 md:p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-orange-50 hover:border-orange-300 transition-colors cursor-pointer group"
              onClick={triggerUpload}
            >
              <UploadCloud className="w-10 h-10 text-gray-400 group-hover:text-orange-500 mb-3 transition-colors" />
              <p className="text-sm font-medium text-[#071139] group-hover:text-orange-700 text-center">Click to upload signature image</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleSignatureUpload} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
          ) : (
            <div className="relative border border-gray-200 rounded-xl p-4 bg-white inline-block max-w-full">
              <img src={signatureImage} alt="Signature" className="h-24 object-contain" />
              <button 
                onClick={clearSignature}
                className="absolute -top-3 -right-3 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Date */}
        <div className="w-full md:w-1/3">
          <label className={labelClass}>Date</label>
          <div className="bg-gray-100 px-4 py-3 rounded-xl border border-gray-200 text-[#071139] font-bold">
            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      </div>
    </div>
  );
}
