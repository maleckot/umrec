'use client';

import { useState } from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

export default function Tooltip({ text, children }: TooltipProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)}
        className="p-1 focus:outline-none"
        aria-label="Show information tooltip"
      >
        {children}
      </button>
      {show && (
        <>
          <div className="fixed inset-0 z-40 md:hidden" onClick={() => setShow(false)} />
          <div className="absolute z-50 right-0 top-full mt-2 md:right-auto md:top-auto md:bottom-full md:left-1/2 md:-translate-x-1/2 md:mb-2 w-56 sm:w-64 p-2.5 bg-[#071139] text-white text-xs rounded-lg shadow-2xl" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {text}
            <button onClick={() => setShow(false)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full font-bold md:hidden" aria-label="Close tooltip">×</button>
            <div className="hidden md:block absolute w-2 h-2 bg-[#071139] rotate-45 left-1/2 -translate-x-1/2 -bottom-1"></div>
            <div className="md:hidden absolute w-2 h-2 bg-[#071139] rotate-45 right-4 -top-1"></div>
          </div>
        </>
      )}
    </div>
  );
}
