'use client';
import Image from "next/image";

interface HeroProps {
  title: string;
}

export default function HeroSection({ title }: HeroProps) {
  const getHeroTitleParts = () => {
    const text = title || 'UMREConnect';
    if (text === 'UMREConnect') return { first: 'UMRE', second: 'Connect' };
    const mid = Math.ceil(text.length / 2);
    return { first: text.slice(0, mid), second: text.slice(mid) };
  };
  const heroParts = getHeroTitleParts();

  return (
    <div className="relative h-[60vh] sm:h-[70vh] md:min-h-screen flex flex-col justify-center px-4 sm:px-6 md:px-10">
        <div className="absolute inset-0 z-0">
          <Image src="/img/landingimg.png" alt="Background" fill style={{ objectFit: 'cover', objectPosition: 'center' }} priority quality={90} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50"></div>
        </div>
        <div className="relative z-10 text-center space-y-4 max-w-5xl mx-auto w-full px-4 fade-in-up">
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold" style={{ fontFamily: 'Marcellus, serif' }}>
            <span className="inline-flex flex-wrap justify-center bg-gradient-to-r from-[#FFFFFF] to-[#F0E847] bg-clip-text text-transparent drop-shadow-elegant">
              {heroParts.first.split('').map((letter, index) => (
                <span key={index} className="animate-letter-glow-white" style={{ animationDelay: `${index * 0.15}s` }}>{letter}</span>
              ))}
              {heroParts.second.split('').map((letter, index) => (
                <span key={index + heroParts.first.length} className="animate-letter-glow-yellow" style={{ animationDelay: `${(index + 4) * 0.15}s` }}>{letter}</span>
              ))}
            </span>
          </h1>
          <div className="flex flex-nowrap justify-center items-center gap-x-0.5 sm:gap-x-1.5 md:gap-x-3 px-1 py-3 overflow-x-auto scrollbar-hide" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            <span className="text-[7px] xs:text-[8px] sm:text-xs md:text-sm lg:text-base text-white/90 font-light tracking-tight whitespace-nowrap"><span className="font-bold text-[#F0E847]">U</span>nbiased</span><span className="text-white/30">•</span>
            <span className="text-[7px] xs:text-[8px] sm:text-xs md:text-sm lg:text-base text-white/90 font-light tracking-tight whitespace-nowrap"><span className="font-bold text-[#F0E847]">M</span>orally Responsible</span><span className="text-white/30">•</span>
            <span className="text-[7px] xs:text-[8px] sm:text-xs md:text-sm lg:text-base text-white/90 font-light tracking-tight whitespace-nowrap"><span className="font-bold text-[#F0E847]">R</span>espect For Human Rights</span><span className="text-white/30">•</span>
            <span className="text-[7px] xs:text-[8px] sm:text-xs md:text-sm lg:text-base text-white/90 font-light tracking-tight whitespace-nowrap"><span className="font-bold text-[#F0E847]">E</span>quitable</span><span className="text-white/30">•</span>
            <span className="text-[7px] xs:text-[8px] sm:text-xs md:text-sm lg:text-base text-white/90 font-light tracking-tight whitespace-nowrap"><span className="font-bold text-[#F0E847]">C</span>redible</span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-10"><div className="w-full h-1 bg-gradient-to-r from-transparent via-[#D3CC50] to-transparent shadow-glow-yellow"></div></div>
        
        {/* CSS for animations can be kept here or moved to global css */}
        <style jsx>{`
        @keyframes letter-glow-white { 0%, 100% { text-shadow: 0 0 0px rgba(255, 255, 255, 0); } 50% { text-shadow: 0 0 20px rgba(255, 255, 255, 0.9), 0 0 30px rgba(255, 255, 255, 0.6), 0 0 40px rgba(255, 255, 255, 0.3); } }
        @keyframes letter-glow-yellow { 0%, 100% { text-shadow: 0 0 0px rgba(240, 232, 71, 0); } 50% { text-shadow: 0 0 20px rgba(240, 232, 71, 0.9), 0 0 30px rgba(240, 232, 71, 0.6), 0 0 40px rgba(240, 232, 71, 0.3); } }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-letter-glow-white { animation: letter-glow-white 4s ease-in-out infinite; display: inline-block; }
        .animate-letter-glow-yellow { animation: letter-glow-yellow 4s ease-in-out infinite; display: inline-block; }
        .fade-in-up { animation: fade-in-up 1s ease-out; }
        .shadow-glow-yellow { box-shadow: 0 0 20px rgba(211, 204, 80, 0.5), 0 0 40px rgba(211, 204, 80, 0.3); }
        .drop-shadow-elegant { filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.5)); }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
      </div>
  );
}
