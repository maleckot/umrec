'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  label: string;
  href?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ label, href }) => {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 text-[#101C50] hover:text-[#0d1640] transition-colors mb-6 cursor-pointer"
    >
      <ArrowLeft size={20} />
      <span className="text-lg font-semibold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        {label}
      </span>
    </button>
  );
};

export default BackButton;
