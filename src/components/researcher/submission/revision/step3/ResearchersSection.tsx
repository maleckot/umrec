import { User, PenTool, Plus, Trash2, AlertCircle } from 'lucide-react';
import { FileUpload } from '@/components/researcher/submission/FormComponents';

interface Researcher {
  id: string;
  name: string;
  signature: File | string | null;
}

interface ResearchersProps {
  researchers: Researcher[];
  errors: Record<string, string>;
  addResearcher: () => void;
  removeResearcher: (id: string) => void;
  updateResearcher: (id: string, field: 'name' | 'signature', value: string | File | null) => void;
}

export default function ResearchersSection({
  researchers,
  errors,
  addResearcher,
  removeResearcher,
  updateResearcher,
}: ResearchersProps) {
  
  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 p-6 sm:p-8 rounded-xl shadow-sm mt-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
            <User size={20} className="text-white" />
          </div>
          <div>
            <h4 className="font-bold text-[#071139] text-base sm:text-lg mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Accomplished By (Research Team Members)
            </h4>
            <p className="text-xs sm:text-sm text-gray-700 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              All research team members must provide their printed name and signature below.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={addResearcher}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-[#003366] hover:to-[#071139] transition-all duration-300 font-bold shadow-lg hover:shadow-xl hover:scale-105 w-full sm:w-auto"
          style={{ fontFamily: 'Metropolis, sans-serif' }}
        >
          <Plus size={18} /> Add Member
        </button>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {researchers.map((researcher, index) => (
          <div key={researcher.id} className="bg-white p-6 sm:p-8 rounded-xl border-2 border-gray-200 relative shadow-sm hover:shadow-md transition-shadow duration-300">
            {researchers.length > 1 && (
              <button
                type="button"
                onClick={() => removeResearcher(researcher.id)}
                className="absolute top-4 right-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors z-10"
                title="Remove member"
              >
                <Trash2 size={20} />
              </button>
            )}

            <div className="flex items-center gap-3 mb-6 pr-10">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg flex items-center justify-center font-bold shadow-md">
                <span style={{ fontFamily: 'Metropolis, sans-serif' }}>{index + 1}</span>
              </div>
              <h5 className="font-bold text-[#071139] text-base sm:text-lg" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Member {index + 1}
              </h5>
            </div>

            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-bold mb-3 text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
                    <User size={14} className="text-[#F7D117]" />
                  </div>
                  Printed Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={researcher.name}
                  onChange={(e) => updateResearcher(researcher.id, 'name', e.target.value)}
                  placeholder="Enter full name"
                  className={`w-full px-4 py-3 sm:py-4 border-2 rounded-xl focus:ring-2 focus:outline-none text-[#071139] font-medium transition-all duration-300 ${errors[`researcher_name_${researcher.id}`] ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-[#071139] focus:ring-[#071139]/20 hover:border-gray-400'}`}
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                  required
                />
                {errors[`researcher_name_${researcher.id}`] && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1 font-bold">
                    <AlertCircle size={16} /> {errors[`researcher_name_${researcher.id}`]}
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold mb-3 text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
                    <PenTool size={14} className="text-[#F7D117]" />
                  </div>
                  Signature <span className="text-red-500">*</span>
                </label>
                <p className="text-xs sm:text-sm text-gray-700 font-medium mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Upload a scanned copy or digital signature (PNG, JPG, or PDF format, max 5MB)
                </p>

                <div className={errors[`researcher_signature_${researcher.id}`] ? 'border-2 border-red-500 rounded-xl p-2' : ''}>
                  <FileUpload
                    label=""
                    value={researcher.signature}
                    onChange={(file) => updateResearcher(researcher.id, 'signature', file)}
                    accept="image/*,.pdf"
                    helperText=""
                    required
                  />
                </div>

                {researcher.signature && typeof researcher.signature === 'string' && !String(researcher.signature).startsWith('data:') && (
                  <div className="mt-3 p-3 bg-emerald-50 border border-emerald-300 rounded-lg flex items-center gap-2">
                    <span className="text-emerald-700 font-bold text-sm">✓ Signature loaded from database</span>
                  </div>
                )}
                
                {errors[`researcher_signature_${researcher.id}`] && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1 font-bold">
                    <AlertCircle size={16} /> {errors[`researcher_signature_${researcher.id}`]}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
