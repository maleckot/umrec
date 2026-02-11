import { BookOpen, Users, Megaphone, Award, Clock } from 'lucide-react';

interface HistoryItem {
  id: string;
  year: string;
  title: string;
  description: string;
}

export default function HistorySection({ historyData }: { historyData: HistoryItem[] }) {
  const historyIcons = [BookOpen, Users, Megaphone, Award];

  // Helper component
  const HistoryItemContent = ({ item, isSpecial }: { item: HistoryItem, isSpecial: boolean }) => {
    if (isSpecial) {
      return (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 shadow-xl hover:shadow-[#F0E847]/10 hover:-translate-y-1">
          <h3 className="text-2xl sm:text-3xl font-bold text-[#F0E847] mb-2" style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 700 }}>{item.year}</h3>
          <h4 className="text-lg sm:text-xl font-bold text-white mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>{item.title}</h4>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4" style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 400 }}>{item.description}</p>
          <div className="inline-block px-3 py-1 bg-[#F0E847] text-[#050B24] text-xs font-bold rounded uppercase tracking-wider" style={{ fontFamily: 'Metropolis, sans-serif' }}>Current Era</div>
        </div>
      );
    }
    return (
      <>
        <h3 className="text-2xl sm:text-3xl font-bold text-[#F0E847] mb-2" style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 700 }}>{item.year}</h3>
        <h4 className="text-lg sm:text-xl font-bold text-white mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>{item.title}</h4>
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed" style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 400 }}>{item.description}</p>
      </>
    );
  };

  return (
    <>
      <div className="py-20 sm:py-24 px-4 sm:px-8 bg-[#050B24] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-[#F0E847] rounded-full blur-[120px]"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-500 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
             <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-md rounded-full text-[#F0E847] mb-4 border border-white/10"><Clock size={28} /></div>
             <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontWeight: 800 }}>Our Legacy & History</h2>
             <div className="w-24 h-1.5 bg-gradient-to-r from-[#F0E847] to-[#D3CC50] mx-auto rounded-full"></div>
          </div>

          <div className="relative">
            <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-1 bg-white/10 sm:-translate-x-1/2 rounded-full"></div>
            
            <div className="space-y-12 sm:space-y-24">
              {historyData.map((item, index) => {
                const Icon = historyIcons[index % historyIcons.length];
                const isEven = index % 2 === 0;
                const isSpecial = index === historyData.length - 1; 

                return (
                  <div key={item.id} className="relative flex flex-col sm:flex-row items-center justify-between group">
                    {/* LEFT COLUMN */}
                    {isEven ? (
                        <div className="order-1 w-full sm:w-5/12 pl-16 sm:pl-0 sm:pr-8 text-left sm:text-right">
                           <HistoryItemContent item={item} isSpecial={isSpecial} />
                        </div>
                    ) : (
                        <div className="order-1 w-full sm:w-5/12"></div>
                    )}

                    {/* CENTER ICON */}
                    <div className="z-20 flex items-center justify-center order-1 w-12 h-12 bg-[#050B24] border-4 border-[#F0E847] rounded-full shadow-[0_0_20px_rgba(240,232,71,0.4)] absolute left-0 sm:left-1/2 sm:-translate-x-1/2 top-0 sm:top-auto">
                      <Icon size={18} className="text-white" />
                    </div>

                    {/* RIGHT COLUMN */}
                    {!isEven ? (
                        <div className="order-1 w-full sm:w-5/12 pl-16 sm:pl-8 text-left">
                           <HistoryItemContent item={item} isSpecial={isSpecial} />
                        </div>
                    ) : (
                        <div className="order-1 w-full sm:w-5/12"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#D3CC50] to-transparent shadow-glow-yellow"></div>
    </>
  );
}
