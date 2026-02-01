'use client';

import Image from "next/image";
import NavbarRoles from '../components/researcher-reviewer/NavbarRoles';
import Footer from '../components/researcher-reviewer/Footer';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { Megaphone, Calendar, ArrowRight, BookOpen, Clock, Award, Users, Repeat, MapPin, Video } from 'lucide-react';
import { getPublicAnnouncements } from '@/app/actions/homepage/getPublicAnnouncements';
import { getHomepageData } from '@/app/actions/homepage/getHomepageData';

export default function Home() {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [activeTab, setActiveTab] = useState('mission');
  const statsRef = useRef(null);
  
  // --- Data State ---
  const [announcements, setAnnouncements] = useState<any[]>([]);
  
  const [textContent, setTextContent] = useState({
    hero_title: 'UMREConnect',
    about_text: 'The University of Makati Research Ethics Committee (UMREC) is an independent body that makes decisions regarding the review, approval, and implementation of research protocols.',
    mission_text: 'The University of Makati Research Ethics Committee commits to an organized, transparent, impartial, collaborative, and quality-driven research ethics review system.',
    vision_text: 'The University of Makati Research Ethics Committee is a PHREB Level 2 Accredited research ethics board in 2030.'
  });

  const [history, setHistory] = useState<any[]>([
    { id: '1', year: '2018', title: 'The Inception', description: 'It began when the College of Allied Health Studies (COAHS) recognized the need for an internal ethics review board.' },
    { id: '2', year: '2019', title: 'PHREB Partnership', description: 'COAHS engaged the Philippine Health Research Ethics Board (PHREB) for the Basic Research Ethics Training (BRET).' },
    { id: '3', year: '2021 - 2022', title: 'University-wide Expansion', description: 'Endorsed by VP for Planning and Research, Dr. Ederson DT Tapia...' },
    { id: '4', year: '2023', title: 'Official Establishment', description: 'The Interim Committee successfully reviewed over 100 protocols...' },
  ]);

  const [homeForms, setHomeForms] = useState<any[]>([
    { id: '1', title: 'Application Form', form_number: 'UMREC Form No. 0013-1', file_url: '#' },
    { id: '2', title: 'Research Protocol', form_number: 'UMREC Form No. 0033', file_url: '#' },
  ]);

  // --- Fetch Data ---
  useEffect(() => {
    const fetchData = async () => {
      const annData = await getPublicAnnouncements();
      setAnnouncements(annData);

      const cmsData = await getHomepageData();
      if (cmsData.textContent?.hero_title) setTextContent(cmsData.textContent);
      if (cmsData.history?.length > 0) setHistory(cmsData.history);
      if (cmsData.forms?.length > 0) setHomeForms(cmsData.forms);
    };
    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const formatNumber = (num: number) => num.toLocaleString();

  const getHeroTitleParts = () => {
    const title = textContent.hero_title || 'UMREConnect';
    if (title === 'UMREConnect') return { first: 'UMRE', second: 'Connect' };
    const mid = Math.ceil(title.length / 2);
    return { first: title.slice(0, mid), second: title.slice(mid) };
  };
  const heroParts = getHeroTitleParts();

  const historyIcons = [BookOpen, Users, Megaphone, Award];
  const formIcons = [
    <Repeat key="rep" className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />,
    <BookOpen key="book" className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />,
    <svg key="1" className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    <svg key="2" className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
  ];

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

  // Helper component to display content (Normal vs Special Card)
  const HistoryItemContent = ({ item, isSpecial }: { item: any, isSpecial: boolean }) => {
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
    <div className="overflow-x-hidden bg-[#050B24]">
      <NavbarRoles role="main" />

      {/* Hero Section */}
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
      </div>

      {/* About Section */}
      <div className="py-12 sm:py-16 md:py-20 px-4 sm:px-8 md:px-20 lg:px-32 bg-[#E8EEF3]">
        <div className="max-w-6xl mx-auto text-left fade-in-section">
          <h2 className="text-2xl sm:text-3xl md:text-4xl mb-2 relative inline-block text-[#101C50]" style={{ fontWeight: 700 }}>ABOUT UMREC<div className="absolute bottom-0 left-0 w-16 sm:w-20 h-1 bg-[#D3CC50]"></div></h2>
          <p className="mt-6 text-base sm:text-lg md:text-xl leading-relaxed text-justify whitespace-pre-line text-[#101C50]">{textContent.about_text}</p>
        </div>
      </div>
      <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#D3CC50] to-transparent shadow-glow-yellow"></div>

      {/* --- HISTORY SECTION (FULLY RESTORED) --- */}
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
            {/* Vertical Line */}
            <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-1 bg-white/10 sm:-translate-x-1/2 rounded-full"></div>
            
            <div className="space-y-12 sm:space-y-24">
              
              {/* Loop through History */}
              {history.map((item, index) => {
                const Icon = historyIcons[index % historyIcons.length];
                const isEven = index % 2 === 0;
                // ✅ Restore "Current Era" logic for the last item
                const isSpecial = index === history.length - 1; 

                return (
                  <div key={item.id} className="relative flex flex-col sm:flex-row items-center justify-between group">
                    
                    {/* LEFT COLUMN: Contains Item 1, 3, 5... (Even Indices) */}
                    {isEven ? (
                        <div className="order-1 w-full sm:w-5/12 pl-16 sm:pl-0 sm:pr-8 text-left sm:text-right">
                           <HistoryItemContent item={item} isSpecial={isSpecial} />
                        </div>
                    ) : (
                        <div className="order-1 w-full sm:w-5/12"></div> // Empty Spacer for Odd Items
                    )}

                    {/* CENTER ICON */}
                    <div className="z-20 flex items-center justify-center order-1 w-12 h-12 bg-[#050B24] border-4 border-[#F0E847] rounded-full shadow-[0_0_20px_rgba(240,232,71,0.4)] absolute left-0 sm:left-1/2 sm:-translate-x-1/2 top-0 sm:top-auto">
                      <Icon size={18} className="text-white" />
                    </div>

                    {/* RIGHT COLUMN: Contains Item 2, 4, 6... (Odd Indices) */}
                    {!isEven ? (
                        <div className="order-1 w-full sm:w-5/12 pl-16 sm:pl-8 text-left">
                           <HistoryItemContent item={item} isSpecial={isSpecial} />
                        </div>
                    ) : (
                        <div className="order-1 w-full sm:w-5/12"></div> // Empty Spacer for Even Items
                    )}

                  </div>
                );
              })}

            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#D3CC50] to-transparent shadow-glow-yellow"></div>

      {/* Mission/Vision Section */}
      <div className="py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-12 lg:px-32 bg-[#050B24]">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 md:px-8">
            <div className="flex justify-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
              <div className="inline-flex w-full sm:w-auto rounded-lg bg-white/5 p-1 backdrop-blur-sm border border-white/10">
                <button onClick={() => setActiveTab('mission')} className={`flex-1 sm:flex-none px-3 sm:px-6 md:px-8 lg:px-12 py-2 sm:py-3 md:py-4 rounded-lg text-xs sm:text-sm md:text-base lg:text-xl font-semibold transition-all duration-300 ${activeTab === 'mission' ? 'bg-gradient-to-r from-[#D3CC50] to-[#F0E847] text-[#050B24] shadow-lg' : 'text-white hover:bg-white/10'}`}>Mission</button>
                <button onClick={() => setActiveTab('vision')} className={`flex-1 sm:flex-none px-3 sm:px-6 md:px-8 lg:px-12 py-2 sm:py-3 md:py-4 rounded-lg text-xs sm:text-sm md:text-base lg:text-xl font-semibold transition-all duration-300 ${activeTab === 'vision' ? 'bg-gradient-to-r from-[#D3CC50] to-[#F0E847] text-[#050B24] shadow-lg' : 'text-white hover:bg-white/10'}`}>Vision</button>
              </div>
            </div>
            <div className="relative" style={{ minHeight: '280px' }}>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 lg:p-10 border border-white/10 shadow-2xl hover-lift animate-in fade-in duration-500">
                <div className="flex items-start gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D3CC50] to-[#F0E847] flex items-center justify-center shadow-lg">
                    <svg className="w-4 h-4 text-[#050B24]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <h3 className="text-base sm:text-lg md:text-2xl lg:text-4xl font-bold text-[#F0E847]" style={{ fontFamily: 'Metropolis, sans-serif' }}>{activeTab === 'mission' ? 'Our Mission' : 'Our Vision'}</h3>
                </div>
                <p className="text-xs sm:text-sm md:text-base lg:text-xl leading-relaxed text-justify text-white/90 whitespace-pre-line">
                  {activeTab === 'mission' ? textContent.mission_text : textContent.vision_text}
                </p>
              </div>
            </div>
        </div>
      </div>
      <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#D3CC50] to-transparent shadow-glow-yellow"></div>

      {/* Statistics Section */}
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
      </div>
      <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#D3CC50] to-transparent shadow-glow-yellow"></div>

      {/* Announcements */}
      <div className="py-12 px-4 sm:px-8 bg-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl md:text-4xl text-[#101C50]" style={{ fontWeight: 800 }}>ANNOUNCEMENTS<div className="w-20 h-1 bg-[#D3CC50]"></div></h2>
            <Link href="/announcements" className="hidden md:flex items-center gap-2 text-[#101C50] font-bold hover:text-blue-700">View All <ArrowRight size={20}/></Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {announcements.length === 0 && <div className="col-span-full text-center py-10 bg-gray-50 rounded-2xl border border-dashed text-gray-500">No active announcements.</div>}
            {announcements.map((item) => (
              <div key={item.id} className="group bg-white rounded-2xl p-6 border shadow-sm hover:shadow-xl transition-all relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#101C50] group-hover:bg-[#D3CC50] transition-colors"></div>
                <div className="flex justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${item.type === 'Seminar' ? 'bg-blue-50 text-blue-700' : 'bg-yellow-50 text-yellow-700'}`}>{item.type}</span>
                  <span className="text-gray-400 text-xs font-medium flex gap-1"><Calendar size={14} /> {formatDate(item.event_date)}</span>
                </div>
                <h3 className="text-xl font-bold text-[#101C50] mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">{item.content}</p>
                <div className="flex justify-between items-center">
                   <span className="text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1 rounded-lg border flex gap-2">{item.mode === 'Onsite' ? <><MapPin size={12}/> {item.location}</> : <><Video size={12}/> Online</>}</span>
                   <span className="text-sm font-bold text-[#D3CC50] flex items-center cursor-pointer">Read More <ArrowRight size={16} className="ml-1"/></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#D3CC50] to-transparent shadow-glow-yellow"></div>

      {/* Downloadable Forms */}
      <div className="py-12 px-4 sm:px-8 bg-[#E8EEF3]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <h2 className="text-xl md:text-4xl text-[#101C50]" style={{ fontWeight: 800 }}>DOWNLOADABLE FORMS<div className="w-20 h-1 bg-[#D3CC50]"></div></h2>
            <p className="text-sm md:text-lg mt-4 text-[#101C50]">Download the required forms for your research ethics application</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {homeForms.map((file, index) => (
              <div key={file.id || index} className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1.5rem)] bg-white rounded-xl p-6 border-2 border-[#101C50]/10 shadow-lg hover:-translate-y-2 transition-transform flex flex-col group">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#101C50] to-[#050B24] flex items-center justify-center mx-auto mb-4 text-[#F0E847] shadow-lg group-hover:scale-110 transition-transform">
                  {formIcons[index % formIcons.length]}
                </div>
                <h3 className="text-sm md:text-lg font-bold text-[#101C50] mb-2 text-center">{file.title}</h3>
                <p className="text-xs text-[#101C50]/70 mb-4 text-center">{file.form_number}</p>
                <a href={file.file_url} download className="mt-auto w-full bg-gradient-to-r from-[#101C50] to-[#050B24] text-white py-3 rounded-lg font-semibold text-sm flex justify-center gap-2 hover:shadow-xl transition-all">
                  Download
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
      <style jsx>{`
        /* ... (Paste your existing CSS animations here) ... */
        @keyframes letter-glow-white { 0%, 100% { text-shadow: 0 0 0px rgba(255, 255, 255, 0); } 50% { text-shadow: 0 0 20px rgba(255, 255, 255, 0.9), 0 0 30px rgba(255, 255, 255, 0.6), 0 0 40px rgba(255, 255, 255, 0.3); } }
        @keyframes letter-glow-yellow { 0%, 100% { text-shadow: 0 0 0px rgba(240, 232, 71, 0); } 50% { text-shadow: 0 0 20px rgba(240, 232, 71, 0.9), 0 0 30px rgba(240, 232, 71, 0.6), 0 0 40px rgba(240, 232, 71, 0.3); } }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-letter-glow-white { animation: letter-glow-white 4s ease-in-out infinite; display: inline-block; }
        .animate-letter-glow-yellow { animation: letter-glow-yellow 4s ease-in-out infinite; display: inline-block; }
        .fade-in-up { animation: fade-in-up 1s ease-out; }
        .fade-in-section { animation: fade-in-up 0.8s ease-out 0.2s both; }
        .hover-lift { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .hover-lift:hover { transform: translateY(-5px); }
        .stat-card-transparent { transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); background: transparent; border: 2px solid transparent; }
        .stat-card-transparent:hover { transform: translateY(-15px) scale(1.05); background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(12px); border: 2px solid rgba(211, 204, 80, 0.3); box-shadow: 0 25px 70px rgba(211, 204, 80, 0.5); }
        .download-card { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .download-card:hover { transform: translateY(-8px); box-shadow: 0 20px 50px rgba(16, 28, 80, 0.15); border-color: rgba(211, 204, 80, 0.5); }
        .download-btn { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .download-btn:active { transform: scale(0.95); }
        .stat-number { background: linear-gradient(180deg, #FFFFFF 0%, #F0E847 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .shadow-glow-yellow { box-shadow: 0 0 20px rgba(211, 204, 80, 0.5), 0 0 40px rgba(211, 204, 80, 0.3); }
        .drop-shadow-elegant { filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.5)); }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        @media (max-width: 768px) {
          .hover-lift:hover { transform: translateY(-3px); }
          .stat-card-transparent:hover { transform: translateY(-8px); }
          .download-card:hover { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
}