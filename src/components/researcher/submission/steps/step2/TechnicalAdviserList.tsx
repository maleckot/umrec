'use client';
import { Plus, Trash2, Users } from 'lucide-react';

interface Adviser {
  name: string;
  contact: string;
  email: string;
}

interface TechnicalAdviserListProps {
  advisers: Adviser[];
  setAdvisers: (val: Adviser[]) => void;
}

export default function TechnicalAdviserList({ advisers, setAdvisers }: TechnicalAdviserListProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="flex items-center gap-2 text-sm sm:text-base font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md">
            <Users size={16} className="text-[#F7D117]" />
          </div>
          Technical/Content Adviser/s
        </label>
        <button
          type="button"
          onClick={() => setAdvisers([...advisers, { name: '', contact: '', email: '' }])}
          className="flex items-center gap-1 px-3 py-2 bg-[#071139] text-white rounded-lg hover:bg-[#003366] transition-colors text-sm font-semibold"
          style={{ fontFamily: 'Metropolis, sans-serif' }}
          aria-label="Add new technical adviser"
        >
          <Plus size={16} /> Add
        </button>
      </div>
      {advisers.map((adviser, index) => (
        <div key={index} className="space-y-3 p-4 bg-gray-50 rounded-xl mb-3 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Adviser #{index + 1}
            </span>
            {advisers.length > 1 && (
              <button
                type="button"
                onClick={() => setAdvisers(advisers.filter((_, i) => i !== index))}
                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                aria-label={`Remove adviser ${index + 1}`}
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>

          <div>
            <label htmlFor={`adviserName-${index}`} className="block text-xs font-medium mb-1 text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Full Name
            </label>
            <input
              id={`adviserName-${index}`}
              type="text"
              placeholder="Dr. Maria Santos"
              value={adviser.name}
              onChange={(e) => {
                const updated = [...advisers];
                updated[index].name = e.target.value;
                setAdvisers(updated);
              }}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none text-[#071139]"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`adviserContact-${index}`} className="block text-xs font-medium mb-1 text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Contact Number
              </label>
              <input
                id={`adviserContact-${index}`}
                type="tel"
                placeholder="09123456789"
                maxLength={11}
                value={adviser.contact}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 11) {
                    const updated = [...advisers];
                    updated[index].contact = value;
                    setAdvisers(updated);
                  }
                }}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none text-[#071139]"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              />
            </div>
            <div>
              <label htmlFor={`adviserEmail-${index}`} className="block text-xs font-medium mb-1 text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Email Address
              </label>
              <input
                id={`adviserEmail-${index}`}
                type="email"
                placeholder="email@example.com"
                value={adviser.email}
                onChange={(e) => {
                  const updated = [...advisers];
                  updated[index].email = e.target.value;
                  setAdvisers(updated);
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
