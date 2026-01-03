'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Calendar, Download, Printer } from 'lucide-react';

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
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#101C50]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Analytics & Reports
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Track system performance and submission statistics over time.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
        {/* Date Range Dropdown */}
        <div className="relative w-full sm:w-auto" ref={dropdownRef}>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="w-full sm:w-[220px] px-4 py-2.5 border border-gray-200 rounded-xl flex items-center justify-between bg-white hover:border-blue-300 hover:shadow-sm transition-all text-sm font-medium text-gray-700"
          >
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-400" />
              <span>{dateRange}</span>
            </div>
            <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <div className="absolute top-full right-0 mt-2 w-full sm:w-[220px] bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="py-1">
                {dateRanges.map((range) => (
                  <button
                    key={range}
                    onClick={() => {
                      onDateRangeChange(range);
                      setIsOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                      dateRange === range 
                        ? 'bg-blue-50 text-blue-700 font-bold' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3 w-full sm:w-auto">
          <button 
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all text-sm font-bold shadow-sm"
          >
            <Printer size={16} />
            <span className="hidden sm:inline">Print</span>
          </button>
          
          <button 
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-[#101C50] text-white rounded-xl hover:bg-opacity-90 hover:shadow-md transition-all text-sm font-bold shadow-sm"
          >
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>
    </div>
  );
}
