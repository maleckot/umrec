'use client';

import { Edit2, X, Save, Award } from 'lucide-react';

interface Props {
  expertiseAreas: string[];
  setExpertiseAreas: (areas: string[]) => void;
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  expertiseInput: string;
  setExpertiseInput: (val: string) => void;
  onSave: () => void;
  originalData: any;
}

const ExpertiseTab = ({ expertiseAreas, setExpertiseAreas, isEditing, setIsEditing, expertiseInput, setExpertiseInput, onSave, originalData }: Props) => {
  
  const handleAddExpertise = () => {
    const trimmed = expertiseInput.trim();
    if (trimmed && !expertiseAreas.includes(trimmed)) {
      setExpertiseAreas([...expertiseAreas, trimmed]);
      setExpertiseInput('');
    }
  };

  const handleRemoveExpertise = (index: number) => {
    setExpertiseAreas(expertiseAreas.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-[#101C50] mb-1">Areas of Expertise</h3>
          <p className="text-sm text-gray-500 font-medium">Manage the specialized fields for this reviewer.</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-[#101C50] text-xs font-bold uppercase tracking-wide rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Edit2 size={14} /> Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="bg-gray-50 p-4 md:p-6 rounded-xl border border-gray-200 max-w-3xl">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <input
              type="text"
              value={expertiseInput}
              onChange={(e) => setExpertiseInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddExpertise()}
              placeholder="Type a skill and press Enter..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101C50]/20 focus:border-[#101C50] outline-none text-sm font-bold text-[#101C50]"
            />
            <button
              onClick={handleAddExpertise}
              className="px-6 py-3 bg-[#101C50] text-white text-sm font-bold rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-6 min-h-[100px] bg-white p-4 rounded-lg border border-gray-200">
            {expertiseAreas.length === 0 && <p className="text-gray-400 text-sm italic font-medium">No expertise areas added yet.</p>}
            {expertiseAreas.map((area, index) => (
              <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-800 rounded-md border border-blue-100">
                <span className="text-sm font-bold">{area}</span>
                <button onClick={() => handleRemoveExpertise(index)} className="text-blue-400 hover:text-blue-700">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onSave}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#101C50] text-white text-sm font-bold rounded-lg hover:bg-opacity-90 shadow-sm transition-all"
            >
              <Save size={16} /> Save Changes
            </button>
            <button
              onClick={() => {
                 const reviewerAny = originalData as any;
                 const areasString = reviewerAny?.areasOfExpertise || reviewerAny?.expertiseAreas || '';
                 const areasArray = areasString ? (typeof areasString === 'string' ? areasString.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0) : areasString) : [];
                 setExpertiseAreas(areasArray);
                 setIsEditing(false);
                 setExpertiseInput('');
              }}
              className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50/30 p-4 md:p-6 rounded-xl border border-gray-100">
          {expertiseAreas.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {expertiseAreas.map((area, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-white text-[#101C50] rounded-lg border border-gray-200 shadow-sm text-sm font-bold"
                >
                  {area}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 opacity-50">
              <Award size={48} className="mx-auto mb-3 text-gray-300" />
              <p className="text-sm font-medium text-gray-500">No expertise areas listed.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExpertiseTab;
