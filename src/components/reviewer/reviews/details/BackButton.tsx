'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

const BackButton = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/reviewermodule')}
      className="flex items-center gap-2.5 mb-8 px-5 py-3 bg-white/80 backdrop-blur-sm text-[#101C50] hover:bg-white rounded-2xl transition-all shadow-md font-bold"
      style={{ fontFamily: 'Metropolis, sans-serif' }}
    >
      <ArrowLeft size={20} />
      Back to Reviews
    </button>
  );
};

export default BackButton;
