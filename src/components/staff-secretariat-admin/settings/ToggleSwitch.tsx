// components/staff-secretariat-admin/settings/ToggleSwitch.tsx
'use client';

interface ToggleSwitchProps {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}

export default function ToggleSwitch({ title, description, enabled, onToggle }: ToggleSwitchProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
      <div className="flex-1 mb-3 sm:mb-0">
        <p 
          className="text-sm font-semibold text-[#003366]" 
          style={{ fontFamily: 'Metropolis, sans-serif' }}
        >
          {title}
        </p>
        <p 
          className="text-xs text-gray-600 mt-1" 
          style={{ fontFamily: 'Metropolis, sans-serif' }}
        >
          {description}
        </p>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#003366] focus:ring-offset-2 ${
          enabled ? 'bg-[#003366]' : 'bg-gray-200'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            enabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
