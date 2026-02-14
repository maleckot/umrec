import { Mail } from 'lucide-react';
import PDFUploadValidator from '@/components/researcher/submission/PDFUploadValidator';

interface UploadFieldProps {
  file: File | null;
  setFile: (file: File | null) => void;
}

const UploadField: React.FC<UploadFieldProps> = ({ file, setFile }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
          <Mail className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="font-bold text-[#071139] text-base sm:text-lg" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Updated Endorsement Letter
          </h4>
          <p className="text-xs sm:text-sm text-gray-700 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Official letter from your research adviser endorsing your revised research protocol
          </p>
        </div>
      </div>

      <PDFUploadValidator
        label="Updated Endorsement Letter"
        description="Official letter from your research adviser endorsing your revised research protocol for ethics re-review. The letter should confirm adviser approval of all revisions made."
        value={file}
        onChange={setFile}
        validationKeywords={['endorsement', 'letter', 'adviser', 'recommendation', 'revision']}
        required
      />
    </div>
  );
};

export default UploadField;
