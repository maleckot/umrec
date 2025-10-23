'use client';

import Image from "next/image";
import NavbarRoles from '../components/researcher-reviewer/NavbarRoles';
import Footer from '../components/researcher-reviewer/Footer';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';

export default function Home() {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [activeTab, setActiveTab] = useState('mission');
  const statsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          
          // Animate first counter to 628 (slower)
          let current1 = 0;
          const target1 = 628;
          const increment1 = target1 / 130;
          const timer1 = setInterval(() => {
            current1 += increment1;
            if (current1 >= target1) {
              setCount1(target1);
              clearInterval(timer1);
            } else {
              setCount1(Math.floor(current1));
            }
          }, 25);

          // Animate second counter to 20 (slower)
          let current2 = 0;
          const target2 = 20;
          const increment2 = target2 / 120;
          const timer2 = setInterval(() => {
            current2 += increment2;
            if (current2 >= target2) {
              setCount2(target2);
              clearInterval(timer2);
            } else {
              setCount2(Math.floor(current2));
            }
          }, 25);
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

  const downloadableFiles = [
    {
      title: "Application Form Ethics Review",
      formNumber: "UMREC Form No. 0013-1",
      icon: (
        <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: "Research Protocol",
      formNumber: "UMREC Form No. 0033",
      icon: (
        <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    },
    {
      title: "Informed Consent Form",
      formNumber: "Sample for legal-age respondents",
      icon: (
        <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "Informed Consent Form",
      formNumber: "Sample for minor respondents",
      icon: (
        <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    }
  ];

  return (
    <div className="overflow-x-hidden">
      <NavbarRoles role="main" />
      
      {/* Hero Section with Background Image */}
      <div className="relative h-[60vh] sm:h-[70vh] md:min-h-screen flex flex-col justify-center px-4 sm:px-6 md:px-10">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/img/landingimg.png"
            alt="Background"
            fill
            style={{
              objectFit: 'cover',
              objectPosition: 'center',
            }}
            priority
            sizes="100vw"
            quality={90}
          />
          {/* Elegant gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center space-y-4 sm:space-y-5 md:space-y-6 max-w-5xl mx-auto w-full px-4 fade-in-up">
          {/* UMREConnect Title with per-letter glow effect */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold" style={{ fontFamily: 'Marcellus, serif' }}>
            <span className="inline-flex flex-wrap justify-center bg-gradient-to-r from-[#FFFFFF] to-[#F0E847] bg-clip-text text-transparent drop-shadow-elegant">
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

          {/* UMREC Acronym - Always One Line, Extra Small on Mobile */}
<div className="flex flex-nowrap justify-center items-center gap-x-0.5 sm:gap-x-1.5 md:gap-x-3 px-1 py-3 overflow-x-auto scrollbar-hide" style={{ fontFamily: 'Metropolis, sans-serif' }}>
  <span className="text-[7px] xs:text-[8px] sm:text-xs md:text-sm lg:text-base text-white/90 font-light tracking-tight whitespace-nowrap">
    <span className="font-bold text-[#F0E847] text-[8px] xs:text-[9px] sm:text-sm md:text-base lg:text-lg">U</span>nbiased
  </span>
  <span className="text-white/30 text-[7px] xs:text-[8px] sm:text-xs">•</span>
  <span className="text-[7px] xs:text-[8px] sm:text-xs md:text-sm lg:text-base text-white/90 font-light tracking-tight whitespace-nowrap">
    <span className="font-bold text-[#F0E847] text-[8px] xs:text-[9px] sm:text-sm md:text-base lg:text-lg">M</span>orally Responsible
  </span>
  <span className="text-white/30 text-[7px] xs:text-[8px] sm:text-xs">•</span>
  <span className="text-[7px] xs:text-[8px] sm:text-xs md:text-sm lg:text-base text-white/90 font-light tracking-tight whitespace-nowrap">
    <span className="font-bold text-[#F0E847] text-[8px] xs:text-[9px] sm:text-sm md:text-base lg:text-lg">R</span>espect For Human Rights
  </span>
  <span className="text-white/30 text-[7px] xs:text-[8px] sm:text-xs">•</span>
  <span className="text-[7px] xs:text-[8px] sm:text-xs md:text-sm lg:text-base text-white/90 font-light tracking-tight whitespace-nowrap">
    <span className="font-bold text-[#F0E847] text-[8px] xs:text-[9px] sm:text-sm md:text-base lg:text-lg">E</span>quitable
  </span>
  <span className="text-white/30 text-[7px] xs:text-[8px] sm:text-xs">•</span>
  <span className="text-[7px] xs:text-[8px] sm:text-xs md:text-sm lg:text-base text-white/90 font-light tracking-tight whitespace-nowrap">
    <span className="font-bold text-[#F0E847] text-[8px] xs:text-[9px] sm:text-sm md:text-base lg:text-lg">C</span>redible
  </span>
</div>
        </div>
        {/* Elegant Separator Line at bottom of image */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#D3CC50] to-transparent shadow-glow-yellow"></div>
        </div>
      </div>

      {/* About UMREC Section with Elegant Entry Animation */}
      <div className="py-12 sm:py-16 md:py-20 px-4 sm:px-8 md:px-20 lg:px-32 transition-all duration-700" style={{ backgroundColor: '#E8EEF3' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-left px-4 sm:px-6 md:px-8 fade-in-section">
            <div className="mb-6 sm:mb-8 md:mb-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl mb-2 relative inline-block" style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 700, color: '#101C50' }}>
                ABOUT UMREC
                <div className="absolute bottom-0 left-0 w-16 sm:w-20 h-1 bg-[#D3CC50]"></div>
              </h2>
            </div>
            <p className="text-base sm:text-lg md:text-xl leading-relaxed text-justify hover-lift" style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 400, color: '#101C50', lineHeight: '1.8' }}>
              The <span className="font-bold">University of Makati Research Ethics Committee (UMREC)</span> is an independent body that makes decisions regarding the review, approval, and implementation of research protocols. Its purpose is to promote the integrity of research data and protect the rights, safety, and well-being of human participants.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#D3CC50] to-transparent shadow-glow-yellow"></div>

      {/* Mission and Vision Section - Fully Responsive */}
      <div className="py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-12 lg:px-32" style={{ backgroundColor: '#050B24' }}>
        <div className="max-w-6xl mx-auto">
          <div className="px-2 sm:px-4 md:px-8">
            {/* Tab Navigation - Fully Responsive */}
            <div className="flex justify-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
              <div className="inline-flex w-full sm:w-auto rounded-lg bg-white/5 p-1 backdrop-blur-sm border border-white/10">
                <button
                  onClick={() => setActiveTab('mission')}
                  className={`flex-1 sm:flex-none px-3 sm:px-6 md:px-8 lg:px-12 py-2 sm:py-3 md:py-4 rounded-lg text-xs sm:text-sm md:text-base lg:text-xl font-semibold transition-all duration-300 whitespace-nowrap ${
                    activeTab === 'mission'
                      ? 'bg-gradient-to-r from-[#D3CC50] to-[#F0E847] text-[#050B24] shadow-lg shadow-yellow-500/50 scale-105'
                      : 'text-white hover:bg-white/10'
                  }`}
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  Mission
                </button>
                <button
                  onClick={() => setActiveTab('vision')}
                  className={`flex-1 sm:flex-none px-3 sm:px-6 md:px-8 lg:px-12 py-2 sm:py-3 md:py-4 rounded-lg text-xs sm:text-sm md:text-base lg:text-xl font-semibold transition-all duration-300 whitespace-nowrap ${
                    activeTab === 'vision'
                      ? 'bg-gradient-to-r from-[#D3CC50] to-[#F0E847] text-[#050B24] shadow-lg shadow-yellow-500/50 scale-105'
                      : 'text-white hover:bg-white/10'
                  }`}
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  Vision
                </button>
              </div>
            </div>

            {/* Tab Content - Fully Responsive with Fixed Heights */}
            <div className="relative" style={{ minHeight: '280px' }}>
              {/* Mission Content */}
              <div
                className={`absolute inset-0 transition-all duration-500 ${
                  activeTab === 'mission'
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 -translate-x-full pointer-events-none'
                }`}
              >
                <div className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 lg:p-10 border border-white/10 shadow-2xl hover-lift">
                  <div className="flex items-start gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-3 md:mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 rounded-full bg-gradient-to-br from-[#D3CC50] to-[#F0E847] flex items-center justify-center flex-shrink-0 shadow-lg">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-[#050B24]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-base sm:text-lg md:text-2xl lg:text-4xl font-bold text-[#F0E847]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Our Mission
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm md:text-base lg:text-xl leading-relaxed text-justify text-white/90" style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 400, lineHeight: '1.7' }}>
                    The University of Makati Research Ethics Committee commits to an organized, transparent, impartial, collaborative, and quality-driven research ethics review system by producing ethical researches that contribute to societal progress and development.
                  </p>
                </div>
              </div>

              {/* Vision Content */}
              <div
                className={`absolute inset-0 transition-all duration-500 ${
                  activeTab === 'vision'
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 translate-x-full pointer-events-none'
                }`}
              >
                <div className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 lg:p-10 border border-white/10 shadow-2xl hover-lift">
                  <div className="flex items-start gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-3 md:mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 rounded-full bg-gradient-to-br from-[#D3CC50] to-[#F0E847] flex items-center justify-center flex-shrink-0 shadow-lg">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-[#050B24]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <h3 className="text-base sm:text-lg md:text-2xl lg:text-4xl font-bold text-[#F0E847]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Our Vision
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm md:text-base lg:text-xl leading-relaxed text-justify text-white/90" style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 400, lineHeight: '1.7' }}>
                    The University of Makati Research Ethics Committee is a PHREB Level 2 Accredited research ethics board in 2030 and the leading advocate for ethical, inclusive, and socially responsible research, fostering resilience and excellence in national and international scholarly endeavors.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#D3CC50] to-transparent shadow-glow-yellow"></div>
      
      {/* Statistics Section - Transparent Cards with Hover */}
      <div className="relative h-[50vh] sm:h-[60vh] md:h-auto md:py-20 flex items-center px-4 sm:px-8 md:px-20 lg:px-40" ref={statsRef}>
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/img/landingimg1.png"
            alt="Statistics Background"
            fill
            style={{
              objectFit: 'cover',
              objectPosition: 'center',
            }}
            sizes="100vw"
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-8 lg:px-16 py-8 sm:py-10 md:py-0">
          {/* Statistics - Transparent Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 md:gap-20">
            {/* Stat 1 */}
            <div className="text-center stat-card-transparent p-6 sm:p-8 md:p-10 rounded-2xl">
              <h3 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white mb-3 sm:mb-4 md:mb-5 font-extrabold stat-number" style={{ fontFamily: 'Metropolis, sans-serif', textShadow: '0 0 30px rgba(211, 204, 80, 0.5)' }}>
                {formatNumber(count1)}
              </h3>
              <p className="text-sm sm:text-base md:text-xl lg:text-2xl text-white/90 font-medium" style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 500 }}>
                papers are reviewed for<br />academic year 2024-2025
              </p>
            </div>

            {/* Stat 2 */}
            <div className="text-center stat-card-transparent p-6 sm:p-8 md:p-10 rounded-2xl">
              <h3 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white mb-3 sm:mb-4 md:mb-5 font-extrabold stat-number" style={{ fontFamily: 'Metropolis, sans-serif', textShadow: '0 0 30px rgba(211, 204, 80, 0.5)' }}>
                {count2}
              </h3>
              <p className="text-sm sm:text-base md:text-xl lg:text-2xl text-white/90 font-medium" style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 500 }}>
                colleges/institutes<br />participated
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#D3CC50] to-transparent shadow-glow-yellow"></div>

      {/* Submission Information Section - Enhanced Elegance */}
      <div className="py-12 sm:py-16 md:py-20 px-4 sm:px-8 md:px-20 lg:px-32" style={{ backgroundColor: '#050B24' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-left text-white space-y-6 sm:space-y-8 md:space-y-10">
            <div className="mb-6 sm:mb-8 md:mb-10">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-2 relative inline-block" style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 800 }}>
                SUBMITTING YOUR RESEARCH ETHICS APPLICATION
                <div className="absolute bottom-0 left-0 w-20 sm:w-24 h-1 bg-[#D3CC50]"></div>
              </h2>
            </div>

            <div className="space-y-6 sm:space-y-7 md:space-y-8">
              <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-justify hover-lift" style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 400, lineHeight: '1.8' }}>
                To ensure your research aligns with ethical standards, you'll need to submit a set of required documents for review. These include essential forms, your research protocol, consent forms, and other supporting materials.
              </p>

              <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-justify hover-lift" style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 400, lineHeight: '1.8' }}>
                To access the specific forms, detailed requirements, and the complete submission process, please{' '}
                <Link 
                  href="/login" 
                  className="inline-flex items-center gap-2 font-bold hover:underline transition-all duration-300 hover:gap-3 group" 
                  style={{ color: '#F0E847' }}
                >
                  log in to your account
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                . Once logged in, you'll find all the necessary instructions for both online submission and hard copy submission.
              </p>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 sm:p-5 md:p-6 lg:p-8 border border-white/10 hover-lift">
                <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-justify" style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 400, lineHeight: '1.8' }}>
                  Processing of your application will commence upon receipt of your consolidated files, uploaded online and submitted in hard copy to the UMREC office. You can find us at <span className="font-bold text-[#F0E847]">Room 9020, 9th floor HPSB Bldg., University of Makati</span>. Our office hours are <span className="font-bold text-[#F0E847]">Monday to Friday, 8 AM to 5 PM</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#D3CC50] to-transparent shadow-glow-yellow"></div>

      {/* Downloadable Files Section - Uniform Design */}
      <div className="py-12 sm:py-16 md:py-20 px-4 sm:px-8 md:px-20 lg:px-32" style={{ backgroundColor: '#E8EEF3' }}>
        <div className="max-w-6xl mx-auto">
          <div className="px-4 sm:px-6 md:px-8">
            <div className="mb-8 sm:mb-10 md:mb-12">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-2 relative inline-block" style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 800, color: '#101C50' }}>
                DOWNLOADABLE FORMS
                <div className="absolute bottom-0 left-0 w-20 sm:w-24 h-1 bg-[#D3CC50]"></div>
              </h2>
              <p className="text-sm sm:text-base md:text-lg mt-4 text-[#101C50]" style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 400 }}>
                Download the required forms for your research ethics application
              </p>
            </div>

            {/* Download Cards Grid - Uniform Sizing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
              {downloadableFiles.map((file, index) => (
                <div 
                  key={index}
                  className="download-card bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 border-2 border-[#101C50]/10 shadow-lg hover-lift group flex flex-col"
                >
                  {/* Icon - Uniform Circle Size */}
                  <div className="w-16 h-16 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-[#101C50] to-[#050B24] flex items-center justify-center mx-auto mb-4 sm:mb-5 text-[#F0E847] shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {file.icon}
                  </div>

                  {/* Title - Fixed Height */}
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-[#101C50] mb-2 text-center min-h-[2.5rem] sm:min-h-[3rem] flex items-center justify-center" style={{ fontFamily: 'Metropolis, sans-serif', lineHeight: '1.3' }}>
                    {file.title}
                  </h3>

                  {/* Form Number - Fixed Height */}
                  <p className="text-xs sm:text-sm text-[#101C50]/70 mb-4 sm:mb-5 text-center min-h-[2rem] flex items-center justify-center" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {file.formNumber}
                  </p>

                  {/* Download Button - Uniform Size */}
                  <button className="download-btn w-full bg-gradient-to-r from-[#101C50] to-[#050B24] text-white py-3 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-xl transition-all duration-300 group-hover:from-[#D3CC50] group-hover:to-[#F0E847] group-hover:text-[#050B24] mt-auto" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download
                  </button>
                </div>
              ))}
            </div>

            {/* Additional Note */}
            <div className="mt-8 sm:mt-10 md:mt-12 bg-[#101C50]/5 backdrop-blur-sm rounded-xl p-4 sm:p-5 md:p-6 border border-[#101C50]/10">
              <p className="text-xs sm:text-sm md:text-base text-[#101C50] text-center" style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 400, lineHeight: '1.7' }}>
                <span className="font-bold">Note:</span> All forms must be completed and submitted along with your research protocol. For questions regarding form completion, please contact the UMREC office during office hours.
              </p>
            </div>
          </div>
        </div>
      </div>

     
      <Footer />

      {/* Elegant Animations and Effects */}
      <style jsx>{`
        @keyframes letter-glow-white {
          0%, 100% {
            text-shadow: 0 0 0px rgba(255, 255, 255, 0);
          }
          50% {
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.9), 0 0 30px rgba(255, 255, 255, 0.6), 0 0 40px rgba(255, 255, 255, 0.3);
          }
        }
        
        @keyframes letter-glow-yellow {
          0%, 100% {
            text-shadow: 0 0 0px rgba(240, 232, 71, 0);
          }
          50% {
            text-shadow: 0 0 20px rgba(240, 232, 71, 0.9), 0 0 30px rgba(240, 232, 71, 0.6), 0 0 40px rgba(240, 232, 71, 0.3);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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

        .fade-in-up {
          animation: fade-in-up 1s ease-out;
        }

        .fade-in-section {
          animation: fade-in-up 0.8s ease-out 0.2s both;
        }

        .hover-lift {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hover-lift:hover {
          transform: translateY(-5px);
        }

        .stat-card-transparent {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          background: transparent;
          border: 2px solid transparent;
        }

        .stat-card-transparent:hover {
          transform: translateY(-15px) scale(1.05);
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(12px);
          border: 2px solid rgba(211, 204, 80, 0.3);
          box-shadow: 0 25px 70px rgba(211, 204, 80, 0.5);
        }

        .download-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .download-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 50px rgba(16, 28, 80, 0.15);
          border-color: rgba(211, 204, 80, 0.5);
        }

        .download-btn {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .download-btn:active {
          transform: scale(0.95);
        }

        .stat-number {
          background: linear-gradient(180deg, #FFFFFF 0%, #F0E847 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .shadow-glow-yellow {
          box-shadow: 0 0 20px rgba(211, 204, 80, 0.5), 0 0 40px rgba(211, 204, 80, 0.3);
        }

        .drop-shadow-elegant {
          filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.5));
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        @media (max-width: 768px) {
          .hover-lift:hover {
            transform: translateY(-3px);
          }
          
          .stat-card-transparent:hover {
            transform: translateY(-8px);
          }

          .download-card:hover {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </div>
  );
}
