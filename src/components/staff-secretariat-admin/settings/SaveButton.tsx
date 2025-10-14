// components/staff-secretariat-admin/settings/SaveButton.tsx
'use client';

interface SaveButtonProps {
  onClick: () => void;
}

export default function SaveButton({ onClick }: SaveButtonProps) {
  return (
    <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end">
      <button
        onClick={onClick}
        className="px-6 py-3 bg-[#003366] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity text-sm"
        style={{ fontFamily: 'Metropolis, sans-serif' }}
      >
        Save Changes
      </button>
    </div>
  );
}
