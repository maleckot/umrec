import { CheckCircle, AlertCircle, Edit, FileText } from 'lucide-react';

interface FileReviewProps {
  title: string;
  fileName?: string;
  stepNumber: number;
  onEdit: () => void;
}

export default function FileReviewSection({ title, fileName, stepNumber, onEdit }: FileReviewProps) {
  const isUploaded = !!fileName;

  return (
    <div className="bg-gradient-to-r from-[#071139]/5 to-[#003366]/5 rounded-xl p-4 sm:p-6 border-l-4 border-[#071139]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Step Icon */}
          <div className="w-10 h-10 bg-gradient-to-br from-[#071139] to-[#003366] rounded-lg flex items-center justify-center flex-shrink-0">
             <FileText size={20} className="text-[#F7D117]" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {title}
          </h2>
        </div>
        <button
          onClick={onEdit}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#071139] text-white rounded-lg hover:bg-[#003366] transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg hover:scale-105"
          style={{ fontFamily: 'Metropolis, sans-serif' }}
        >
          <Edit size={16} />
          <span className="hidden sm:inline">Edit</span>
        </button>
      </div>

      <div className="bg-white/60 p-4 rounded-lg border border-gray-200">
        <div className="flex items-center gap-3">
            {isUploaded ? (
                <CheckCircle size={24} className="text-green-600 flex-shrink-0" />
            ) : (
                <AlertCircle size={24} className="text-red-500 flex-shrink-0" />
            )}
            <div>
                <p className={`text-sm font-bold ${isUploaded ? 'text-green-700' : 'text-red-700'}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {isUploaded ? 'File Uploaded Successfully' : 'No File Uploaded'}
                </p>
                {isUploaded && (
                    <p className="text-xs sm:text-sm text-[#071139] mt-1 font-semibold truncate max-w-[200px] sm:max-w-md">
                        {fileName}
                    </p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
