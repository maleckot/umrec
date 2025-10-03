'use client';

import Image from "next/image";
import NavbarRoles from '../components/NavbarRoles';
import Footer from '../components/Footer';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';

export default function Home() {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          
          // Animate first counter to 1,234 (slower)
          let current1 = 0;
          const target1 = 1234;
          const increment1 = target1 / 130; // Increased from 100 to 200
          const timer1 = setInterval(() => {
            current1 += increment1;
            if (current1 >= target1) {
              setCount1(target1);
              clearInterval(timer1);
            } else {
              setCount1(Math.floor(current1));
            }
          }, 25); // Increased from 20ms to 30ms

          // Animate second counter to 20 (slower)
          let current2 = 0;
          const target2 = 20;
          const increment2 = target2 / 120; // Increased from 100 to 200
          const timer2 = setInterval(() => {
            current2 += increment2;
            if (current2 >= target2) {
              setCount2(target2);
              clearInterval(timer2);
            } else {
              setCount2(Math.floor(current2));
            }
          }, 25); // Increased from 20ms to 30ms
        }
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, [hasAnimated]);

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <div>
      <NavbarRoles role="main" />
      
      {/* Hero Section with Background Image */}
      <div className="relative min-h-screen flex flex-col justify-start pt-65 px-10">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/img/landingimg.png"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 "></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center space-y-6 max-w-4xl mx-auto">
          {/* UMREConnect Title with per-letter glow effect */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold" style={{ fontFamily: 'Marcellus, serif' }}>
            <span className="inline-flex bg-gradient-to-r from-[#FFFFFF] to-[#F0E847] bg-clip-text text-transparent">
              {'UMRE'.split('').map((letter, index) => (
                <span 
                  key={index}
                  className="animate-letter-glow-white"
                  style={{
                    animationDelay: `${index * 0.15}s`
                  }}
                >
                  {letter}
                </span>
              ))}
              {'Connect'.split('').map((letter, index) => (
                <span 
                  key={index + 4}
                  className="animate-letter-glow-yellow"
                  style={{
                    animationDelay: `${(index + 4) * 0.15}s`
                  }}
                >
                  {letter}
                </span>
              ))}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-[#FFFFFF]" style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 500 }}>
            SAFEGUARDING RESEARCH INTEGRITY, PROTECTING HUMAN DIGNITY
          </p>
        </div>

        {/* Separator Line at bottom of image */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="w-full h-1 bg-[#D3CC50]"></div>
        </div>
      </div>

      {/* About UMREC Section */}
      <div className="py-16 px-20 md:px-32 lg:px-30" style={{ backgroundColor: '#DAE0E7' }}>
        <div className="max-w-10xl mx-auto">
          <div className="text-left px-8">
            <h2 className="text-3xl md:text-3xl mb-6" style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 500, color: '#101C50' }}>
              <span className="font-bold">ABOUT UMREC</span>
            </h2>
            <p className="text-lg md:text-xl leading-relaxed" style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 400, color: '#101C50' }}>
              The <span className="font-bold">University of Makati Research Ethics Committee (UMREC)</span> is an independent body that makes decisions regarding the review, approval, and implementation of research protocols. Its purpose is to promote the integrity of research data and protect the rights, safety, and well-being of human participants.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full h-1 bg-[#D3CC50]"></div>
      
      {/* Statistics Section with Background Image */}
      <div className="relative py-16 px-20 md:px-32 lg:px-40" ref={statsRef}>
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/img/landingimg1.png"
            alt="Statistics Background"
            fill
            className="object-cover"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-16">
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Stat 1 */}
            <div className="text-center">
              <h3 className="text-6xl md:text-7xl text-white mb-4" style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 800 }}>
                {formatNumber(count1)}
              </h3>
              <p className="text-xl text-white" style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 400 }}>
                papers are reviewed for<br />academic year 2025-2026
              </p>
            </div>

            {/* Stat 2 */}
            <div className="text-center">
              <h3 className="text-6xl md:text-7xl text-white mb-4" style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 800 }}>
                {count2}
              </h3>
              <p className="text-xl text-white" style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 400 }}>
                colleges/institutes<br />participated
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Submission Information Section with Background Color Only */}
      <div className="py-16 px-20 md:px-32 lg:px-30" style={{ backgroundColor: '#050B24' }}>
        <div className="max-w-10xl mx-auto px-8">
          <div className="text-left text-white space-y-6">
            <h2 className="text-3xl md:text-3xl mb-6" style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 800 }}>
              SUBMITTING YOUR RESEARCH ETHICS APPLICATION
            </h2><br />

            <p className="text-lg md:text-xl leading-[2.5]" style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 400 }}>
              To ensure your research aligns with ethical standards, you'll need to submit a set of required documents for review. These include essential forms, your research protocol, consent forms, and other supporting materials.
            </p><br />

            <p className="text-lg md:text-xl leading-[2.5]" style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 400 }}>
              To access the specific forms, detailed requirements, and the complete submission process, please{' '}
              <Link href="/login" className="hover:underline" style={{ fontWeight: 800 }}>
                log in to your account
              </Link>
              . Once logged in, you'll find all the necessary instructions for both online submission and hard copy submission.
            </p><br />

            <p className="text-lg md:text-xl leading-[2.5]" style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 400 }}>
              Processing of your application will commence upon receipt of your consolidated files, uploaded online and submitted in hard copy to the UMREC office. You can find us at <span style={{ fontWeight: 800 }}>Room 9020, 9th floor HPSB Bldg., University of Makati</span>. Our office hours are <span style={{ fontWeight: 800 }}>Monday to Friday, 8 AM to 5 PM</span>.
            </p><br />
          </div>
        </div>
      </div>
      
      <Footer />

      {/* Per-Letter Glow Animation */}
      <style jsx>{`
        @keyframes letter-glow-white {
          0%, 100% {
            text-shadow: 0 0 0px rgba(255, 255, 255, 0);
          }
          50% {
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.9), 0 0 25px rgba(255, 255, 255, 0.6);
          }
        }
        
        @keyframes letter-glow-yellow {
          0%, 100% {
            text-shadow: 0 0 0px rgba(240, 232, 71, 0);
          }
          50% {
            text-shadow: 0 0 20px rgba(240, 232, 71, 0.9), 0 0 25px rgba(240, 232, 71, 0.6);
          }
        }
        
        .animate-letter-glow-white {
          animation: letter-glow-white 4s ease-in-out infinite;
          display: inline-block;
        }
        
        .animate-letter-glow-yellow {
          animation: letter-glow-yellow 4s ease-in-out infinite;
          display: inline-block;
        }
      `}</style>
    </div>
  );
}
