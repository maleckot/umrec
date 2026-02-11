'use client';

import { useEffect, useState } from 'react';
import NavbarRoles from '../components/researcher-reviewer/NavbarRoles';
import Footer from '../components/researcher-reviewer/Footer';
import { getPublicAnnouncements } from '@/app/actions/homepage/getPublicAnnouncements';
import { getHomepageData } from '@/app/actions/homepage/getHomepageData';

// Sub-components
import HeroSection from '../components/landing/HeroSection';
import AboutSection from '../components/landing/AboutSection';
import HistorySection from '../components/landing/HistorySection';
import MissionVisionSection from '../components/landing/MissionVisionSection';
import StatisticsSection from '../components/landing/StatisticsSection';
import AnnouncementsSection from '../components/landing/AnnouncementsSection';
import DownloadableFormsSection from '../components/landing/DownloadableFormsSection';

export default function Home() {
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

  return (
    <div className="overflow-x-hidden bg-[#050B24]">
      <NavbarRoles role="main" />
      
      <HeroSection title={textContent.hero_title} />
      <AboutSection text={textContent.about_text} />
      <HistorySection historyData={history} />
      <MissionVisionSection mission={textContent.mission_text} vision={textContent.vision_text} />
      <StatisticsSection />
      <AnnouncementsSection announcements={announcements} />
      <DownloadableFormsSection forms={homeForms} />

      <Footer />
    </div>
  );
}
