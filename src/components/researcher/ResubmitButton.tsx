'use client';

interface ResubmitButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const ResubmitButton: React.FC<ResubmitButtonProps> = ({ onClick, disabled = false }) => {
  return (
    <div className="flex justify-end">
      <button
        onClick={onClick}
        disabled={disabled}
        className="px-8 py-3 bg-[#8B0000] text-white text-base md:text-lg rounded-full hover:bg-[#6b0000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 600 }}
      >
        Resubmit
      </button>
    </div>
  );
};

export default ResubmitButton;
