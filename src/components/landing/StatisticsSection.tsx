'use client';
import { useEffect, useRef, useState } from 'react';
import Image from "next/image";

export default function StatisticsSection() {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const statsRef = useRef(null);

  const formatNumber = (num: number) => num.toLocaleString();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let current1 = 0; const target1 = 628; const increment1 = target1 / 130;
          const timer1 = setInterval(() => { current1 += increment1; if (current1 >= target1) { setCount1(target1); clearInterval(timer1); } else { setCount1(Math.floor(current1)); } }, 25);
          let current2 = 0; const target2 = 20; const increment2 = target2 / 120;
          const timer2 = setInterval(() => { current2 += increment2; if (current2 >= target2) { setCount2(target2); clearInterval(timer2); } else { setCount2(Math.floor(current2)); } }, 25);
        }
      }, { threshold: 0.5 });
    if (statsRef.current) observer.observe(statsRef.current);
    return () => { if (statsRef.current) observer.unobserve(statsRef.current); };
  }, [hasAnimated]);

  return (
    <>
      <div className="relative h-[50vh] sm:h-[60vh] md:h-auto md:py-20 flex items-center px-4 sm:px-8 md:px-20 lg:px-40" ref={statsRef}>
        <div className="absolute inset-0 z-0">
          <Image src="/img/landingimg1.png" alt="Statistics Background" fill style={{ objectFit: 'cover', objectPosition: 'center' }} sizes="100vw" quality={90} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-16 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 md:gap-20">
            <div className="text-center stat-card-transparent p-6 rounded-2xl">
              <h3 className="text-5xl lg:text-8xl text-white mb-3 font-extrabold stat-number">{formatNumber(count1)}</h3>
              <p className="text-sm lg:text-2xl text-white/90 font-medium">papers reviewed 2024-2025</p>
            </div>
            <div className="text-center stat-card-transparent p-6 rounded-2xl">
              <h3 className="text-5xl lg:text-8xl text-white mb-3 font-extrabold stat-number">{count2}</h3>
              <p className="text-sm lg:text-2xl text-white/90 font-medium">colleges/institutes participated</p>
            </div>
          </div>
        </div>
        <style jsx>{`
         .stat-card-transparent { transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); background: transparent; border: 2px solid transparent; }
         .stat-card-transparent:hover { transform: translateY(-15px) scale(1.05); background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(12px); border: 2px solid rgba(211, 204, 80, 0.3); box-shadow: 0 25px 70px rgba(211, 204, 80, 0.5); }
         .stat-number { background: linear-gradient(180deg, #FFFFFF 0%, #F0E847 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        `}</style>
      </div>
      <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#D3CC50] to-transparent shadow-glow-yellow"></div>
    </>
  );
}
