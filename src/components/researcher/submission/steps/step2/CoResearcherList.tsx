'use client';
import { Plus, Trash2, Users } from 'lucide-react';

interface CoResearcher {
  name: string;
  contact: string;
  email: string;
}

interface CoResearcherListProps {
  coResearchers: CoResearcher[];
  setCoResearchers: (val: CoResearcher[]) => void;
}

export default function CoResearcherList({ coResearchers, setCoResearchers }: CoResearcherListProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="flex items-center gap-2 text-sm sm:text-base font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md">
            <Users size={16} className="text-[#F7D117]" />
          </div>
          Co-Researchers
        </label>
        <button
          type="button"
          onClick={() => setCoResearchers([...coResearchers, { name: '', contact: '', email: '' }])}
          className="flex items-center gap-1 px-3 py-2 bg-[#071139] text-white rounded-lg hover:bg-[#003366] transition-colors text-sm font-semibold"
          style={{ fontFamily: 'Metropolis, sans-serif' }}
          aria-label="Add new co-researcher"
        >
          <Plus size={16} /> Add
        </button>
      </div>
      {coResearchers.map((coResearcher, index) => (
        <div key={index} className="space-y-3 p-4 bg-gray-50 rounded-xl mb-3 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Co-Researcher #{index + 1}
            </span>
            {coResearchers.length > 1 && (
              <button
                type="button"
                onClick={() => setCoResearchers(coResearchers.filter((_, i) => i !== index))}
                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                aria-label={`Remove co-researcher ${index + 1}`}
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
          <div>
            <label htmlFor={`coResearcherName-${index}`} className="block text-xs font-medium mb-1 text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Full Name
            </label>
            <input
              id={`coResearcherName-${index}`}
              type="text"
              placeholder="Juan A. Dela Cruz"
              value={coResearcher.name}
              onChange={(e) => {
                const updated = [...coResearchers];
                updated[index].name = e.target.value;
                setCoResearchers(updated);
              }}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none text-[#071139]"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`coResearcherContact-${index}`} className="block text-xs font-medium mb-1 text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Contact Number
              </label>
              <input
                id={`coResearcherContact-${index}`}
                type="tel"
                placeholder="09123456789"
                maxLength={11}
                value={coResearcher.contact}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 11) {
                    const updated = [...coResearchers];
                    updated[index].contact = value;
                    setCoResearchers(updated);
                  }
                }}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none text-[#071139]"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              />
            </div>
            <div>
              <label htmlFor={`coResearcherEmail-${index}`} className="block text-xs font-medium mb-1 text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Email Address
              </label>
              <input
                id={`coResearcherEmail-${index}`}
                type="email"
                placeholder="email@example.com"
                value={coResearcher.email}
                onChange={(e) => {
                  const updated = [...coResearchers];
                  updated[index].email = e.target.value;
                  setCoResearchers(updated);
                }}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none text-[#071139]"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
