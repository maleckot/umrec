// components/staff-secretariat-admin/settings/SettingsInput.tsx
'use client';

interface SettingsInputProps {
  label: string;
  type: 'text' | 'number' | 'email';
  value: string | number;
  onChange: (value: any) => void;
  description?: string;
  placeholder?: string;
}

export default function SettingsInput({ 
  label, 
  type, 
  value, 
  onChange, 
  description,
  placeholder 
}: SettingsInputProps) {
  return (
    <div>
      <label className="block">
        <p 
          className="text-sm font-semibold text-[#003366] mb-2" 
          style={{ fontFamily: 'Metropolis, sans-serif' }}
        >
          {label}
        </p>
        {description && (
          <p 
            className="text-xs text-gray-600 mb-2" 
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            {description}
          </p>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-transparent text-sm text-gray-900"
          style={{ fontFamily: 'Metropolis, sans-serif' }}
        />
      </label>
    </div>
  );
}
