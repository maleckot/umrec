import { BookOpen, Download, Eye } from 'lucide-react';

interface Props {
  onViewDocument: (name: string, url: string) => void;
}

export default function ReferenceMaterials({ onViewDocument }: Props) {
  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url; link.download = filename;
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  return (
    <div className="mb-8 rounded-2xl bg-[#101C50] text-white p-5 sm:p-8 relative overflow-hidden shadow-xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#F0E847]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
          <div className="p-2 bg-white/10 rounded-lg"><BookOpen className="text-[#F0E847] w-6 h-6" /></div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold" style={{ fontFamily: 'Metropolis, sans-serif' }}>Reference Materials</h2>
            <p className="text-xs text-white/60 font-medium">Essential guidelines and procedures for your research</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <ReferenceCard 
            year="2022" 
            title="National Ethical Guidelines" 
            subtitle="PHREB 2022 Edition"
            onView={() => onViewDocument('National Ethical Guidelines (2022)', '/resources/NEGRIHP.pdf')}
            onDownload={() => handleDownload('/resources/NEGRIHP.pdf', 'NEGRIHP_2022.pdf')}
          />
          <ReferenceCard 
            year="2020" 
            title="Standard Operating Procedures" 
            subtitle="PHREB Manual (SOP)"
            onView={() => onViewDocument('PHREB Standard Operating Procedures (2020)', '/resources/phreb.pdf')}
            onDownload={() => handleDownload('/resources/phreb.pdf', 'PHREB_2020.pdf')}
          />
        </div>
      </div>
    </div>
  );
}

const ReferenceCard = ({ year, title, subtitle, onView, onDownload }: any) => (
  <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all flex flex-col sm:flex-row items-start sm:items-center gap-4 group">
    <div className="w-12 h-12 rounded-lg bg-[#F0E847]/10 flex items-center justify-center flex-shrink-0 text-[#F0E847] group-hover:scale-110 transition-transform">
      <span className="text-xs font-bold">{year}</span>
    </div>
    <div className="flex-1 min-w-0">
      <h3 className="text-sm sm:text-base font-bold text-white leading-tight mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>{title}</h3>
      <p className="text-xs text-white/60 mb-3 sm:mb-0">{subtitle}</p>
    </div>
    <div className="flex items-center gap-2 w-full sm:w-auto">
      <button onClick={onView} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-[#F0E847] text-white hover:text-[#101C50] font-bold text-xs transition-colors"><Eye size={16} /> <span className="sm:hidden">View</span></button>
      <button onClick={onDownload} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#F0E847] hover:bg-[#d9d240] text-[#101C50] font-bold text-xs transition-colors shadow-sm"><Download size={16} /> <span className="sm:hidden">Download</span></button>
    </div>
  </div>
);
