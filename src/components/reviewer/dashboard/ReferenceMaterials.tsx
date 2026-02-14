'use client';

import { BookOpen, FileText, Download, Eye, FileCheck, Scale, Clock, Shield, Book, Briefcase } from 'lucide-react';

interface Props {
  onViewDocument: (name: string, url: string) => void;
}

const ReferenceMaterials = ({ onViewDocument }: Props) => {
  
  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url; 
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div>
         <h3 className="text-xl font-bold text-[#101C50] mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
           Reference Materials
         </h3>
         <p className="text-sm text-gray-600 font-medium">
           Access standard guidelines and procedures.
         </p>
      </div>

      {/* SOP Card */}
      <div className="group bg-white rounded-2xl p-7 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 relative overflow-hidden flex-1 flex flex-col">
         <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
           <BookOpen size={120} className="text-[#101C50]" />
         </div>
         
         <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 shadow-inner flex-shrink-0">
               <FileText size={24} />
            </div>
            <div>
               <h4 className="text-lg font-bold text-[#101C50] leading-tight">Standard Operating Procedures</h4>
               <p className="text-xs text-gray-500 mt-1 font-bold">Version 2025 • 33 Chapters</p>
            </div>
         </div>
         
         <div className="space-y-4 mb-6 flex-grow">
            <p className="text-sm text-gray-700 font-medium leading-relaxed">
               Complete guide on review classifications, ethical standards, and committee protocols.
            </p>
            <ul className="space-y-3 mt-4">
               <li className="flex items-center gap-3 text-xs text-gray-600 font-bold">
                  <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><FileCheck size={12} /></div>
                  Review Classifications & Criteria
               </li>
               <li className="flex items-center gap-3 text-xs text-gray-600 font-bold">
                  <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><Scale size={12} /></div>
                  Ethical Review Standards
               </li>
               <li className="flex items-center gap-3 text-xs text-gray-600 font-bold">
                  <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><Clock size={12} /></div>
                  Turnaround Time & Deadlines
               </li>
            </ul>
         </div>

         <div className="flex gap-3 mt-auto pt-4 border-t border-gray-100">
            <button 
              onClick={() => handleDownload('/resources/sop.pdf', 'Standard_Operating_Procedures_2025.pdf')}
              className="flex-1 flex items-center justify-center gap-2 text-sm font-bold bg-[#101C50] text-white py-3 rounded-xl hover:bg-blue-900 transition-colors shadow-sm"
            >
               <Download size={16} /> Download
            </button>
            <button 
              onClick={() => onViewDocument('Standard Operating Procedures 2025', '/resources/sop.pdf')}
              className="flex items-center justify-center w-14 bg-white text-gray-600 rounded-xl hover:bg-gray-50 border border-gray-200 transition-colors"
              title="View SOP"
            >
               <Eye size={20} />
            </button>
         </div>
      </div>

      {/* PHREB Card */}
      <div className="group bg-gradient-to-br from-[#101C50] to-[#1a2d70] rounded-2xl p-7 shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden text-white flex-1 flex flex-col">
         <div className="absolute -bottom-6 -right-6 p-4 opacity-10">
            <Briefcase size={160} className="text-white" />
         </div>

         <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white border border-white/20 shadow-inner flex-shrink-0">
               <Shield size={24} />
            </div>
            <div>
               <h4 className="text-lg font-bold leading-tight">PHREB Guidelines</h4>
               <p className="text-xs text-blue-200 mt-1 font-bold">National Ethical Standards</p>
            </div>
         </div>

         <div className="space-y-4 mb-6 relative z-10 flex-grow">
            <p className="text-sm text-blue-100 font-medium leading-relaxed">
               The official national guidelines and workbook for health research ethics.
            </p>
            
            <div className="space-y-3 mt-4">
               {/* File 1 */}
               <div className="bg-white/10 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-white/10 hover:bg-white/20 transition-colors">
                  <div className="flex items-center gap-3">
                     <div className="bg-white/20 p-2 rounded-lg flex-shrink-0">
                        <Book size={16} className="text-white" />
                     </div>
                     <div>
                        <p className="text-sm font-bold text-white leading-tight">National Guidelines (2022)</p>
                        <p className="text-[10px] text-blue-200 font-bold">Ethical Standards</p>
                     </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                     <button 
                        onClick={() => onViewDocument('National Ethical Guidelines (2022)', '/resources/NEGRIHP.pdf')}
                        className="p-2 bg-white/10 hover:bg-white/30 rounded-lg transition-colors flex-1 sm:flex-none flex justify-center"
                     >
                        <Eye size={16} />
                     </button>
                     <button 
                        onClick={() => handleDownload('/resources/NEGRIHP.pdf', 'NEGRIHP_2022.pdf')}
                        className="p-2 bg-white text-[#101C50] hover:bg-blue-50 rounded-lg transition-colors flex-1 sm:flex-none flex justify-center"
                     >
                        <Download size={16} />
                     </button>
                  </div>
               </div>

               {/* File 2 */}
               <div className="bg-white/10 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-white/10 hover:bg-white/20 transition-colors">
                  <div className="flex items-center gap-3">
                     <div className="bg-white/20 p-2 rounded-lg flex-shrink-0">
                        <FileCheck size={16} className="text-white" />
                     </div>
                     <div>
                        <p className="text-sm font-bold text-white leading-tight">PHREB SOP (2020)</p>
                        <p className="text-[10px] text-blue-200 font-bold">Practical Guide</p>
                     </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                     <button 
                        onClick={() => onViewDocument('PHREB Standard Operating Procedures (2020)', '/resources/phreb.pdf')}
                        className="p-2 bg-white/10 hover:bg-white/30 rounded-lg transition-colors flex-1 sm:flex-none flex justify-center"
                     >
                        <Eye size={16} />
                     </button>
                     <button 
                        onClick={() => handleDownload('/resources/phreb.pdf', 'PHREB_2020.pdf')}
                        className="p-2 bg-white text-[#101C50] hover:bg-blue-50 rounded-lg transition-colors flex-1 sm:flex-none flex justify-center"
                     >
                        <Download size={16} />
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </>
  );
};

export default ReferenceMaterials;
