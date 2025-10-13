// components/staff-secretariat-admin/reports/ReportHeader.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface ReportHeaderProps {
  dateRange: string;
  onDateRangeChange: (range: string) => void;
}

export default function ReportHeader({ dateRange, onDateRangeChange }: ReportHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const dateRanges = [
    'Last 7 Days',
    'Last Month',
    'Last Quarter',
    'Last Year',
    'Custom'
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <h1 
        className="text-2xl sm:text-3xl font-bold text-[#003366]" 
        style={{ fontFamily: 'Metropolis, sans-serif' }}
      >
        Reports
      </h1>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 bg-white hover:bg-gray-50 transition-colors text-sm w-full sm:w-auto justify-between"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            <span className="text-gray-700">Date Range: {dateRange}</span>
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <div className="absolute top-full mt-2 w-full sm:w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              {dateRanges.map((range) => (
                <button
                  key={range}
                  onClick={() => {
                    onDateRangeChange(range);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                    dateRange === range ? 'bg-[#87CEEB] text-[#003366] font-semibold' : 'text-gray-700'
                  }`}
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  {range}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <button 
          className="px-4 py-2 bg-[#003366] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
          style={{ fontFamily: 'Metropolis, sans-serif' }}
        >
          Export Data
        </button>
        
        <button 
          className="px-4 py-2 bg-[#003366] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
          style={{ fontFamily: 'Metropolis, sans-serif' }}
        >
          Print Report
        </button>
      </div>
    </div>
  );
}
