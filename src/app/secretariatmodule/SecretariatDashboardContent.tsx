'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import { getSecretariatDashboardData } from '@/app/actions/secretariat-staff/secretariat/getSecretariatDashboardData';
import { createAnnouncement } from '@/app/actions/secretariat-staff/secretariat/createAnnouncement';
import { updateAnnouncement } from '@/app/actions/secretariat-staff/secretariat/updateAnnouncement';
import { deleteAnnouncement } from '@/app/actions/secretariat-staff/secretariat/deleteAnnouncement';

import DashboardStats from '@/components/secretariat/dashboard/DashboardStats';
import DeadlineCards from '@/components/secretariat/dashboard/DeadlineCards';
import RecentSubmissionsCard from '@/components/secretariat/dashboard/RecentSubmissionsCard';
import NeedsAttentionCard from '@/components/secretariat/dashboard/NeedsAttentionCard';
import AnnouncementsCard from '@/components/secretariat/dashboard/AnnouncementsCard';
import AnnouncementModal from '@/components/secretariat/dashboard/AnnouncementModal';
import DeleteModal from '@/components/secretariat/dashboard/DeleteModal';

export interface Announcement {
  id: string;
  title: string;
  type: 'Seminar' | 'Announcement';
  date: string;
  excerpt: string;
  mode: 'Onsite' | 'Virtual';
  location?: string;
  link?: string;
}

export default function SecretariatDashboardContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);

  // --- Announcement State ---
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [currentAnnouncement, setCurrentAnnouncement] = useState<Partial<Announcement>>({
    type: 'Announcement', title: '', date: '', excerpt: '', mode: 'Onsite', location: '', link: ''
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const result = await getSecretariatDashboardData();
      if (result.success) {
        setDashboardData(result);
        if (result.announcements) setAnnouncements(result.announcements);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- Logic Helpers ---
  const DEFAULT_DUE_DAYS = 7;
  const DUE_SOON_DAYS = 2;
  const toDateSafe = (value: any) => {
    if (!value) return null;
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  };
  const addDays = (d: Date, days: number) => new Date(d.getTime() + days * 24 * 60 * 60 * 1000);

  const getDueMeta = (submission: any) => {
    const baseDate = toDateSafe(submission.dueDate) ?? toDateSafe(submission.submittedAt) ?? toDateSafe(submission.date);
    if (!baseDate) return { due: null, overdue: false, dueSoon: false };

    const due = submission.dueDate ? baseDate : addDays(baseDate, DEFAULT_DUE_DAYS);
    const now = new Date();
    now.setHours(0,0,0,0);
    const dueTime = new Date(due);
    dueTime.setHours(0,0,0,0);
    const msLeft = dueTime.getTime() - now.getTime();
    return { due, overdue: msLeft < 0, dueSoon: msLeft >= 0 && msLeft <= DUE_SOON_DAYS * 86400000 };
  };

  const handleSubmissionClick = (submission: any) => {
    router.push(`/secretariatmodule/submissions/details?id=${submission.id}`);
  };

  // --- Announcement Handlers ---
  const handleOpenCreate = () => {
    setIsEditing(false);
    setCurrentAnnouncement({ type: 'Announcement', title: '', date: '', excerpt: '', mode: 'Onsite', location: '', link: '' });
    setShowAnnouncementModal(true);
  };

  const handleOpenEdit = (announcement: Announcement) => {
    setIsEditing(true);
    setCurrentAnnouncement({ ...announcement });
    setShowAnnouncementModal(true);
  };

  const handleSaveAnnouncement = async () => {
    if (!currentAnnouncement.title || !currentAnnouncement.date || !currentAnnouncement.excerpt) {
      alert("Please fill in all required fields.");
      return;
    }
    try {
      const result = isEditing && currentAnnouncement.id 
        ? await updateAnnouncement(currentAnnouncement as Announcement)
        : await createAnnouncement(currentAnnouncement);
      
      if (result.success) {
        setShowAnnouncementModal(false);
        window.location.reload(); 
      } else alert(`Failed to save: ${result.error}`);
    } catch (error) { console.error(error); alert("An unexpected error occurred."); }
  };

  const confirmDelete = async () => {
    if (showDeleteModal) {
      try {
        const result = await deleteAnnouncement(showDeleteModal);
        if (result.success) {
            setAnnouncements(prev => prev.filter(a => a.id !== showDeleteModal));
            setShowDeleteModal(null);
        } else alert(`Failed to delete: ${result.error}`);
      } catch (error) { console.error("Error deleting:", error); }
    }
  };

  // Prepare Data
  const stats = dashboardData?.stats ? [
    { label: 'Total Submissions', value: (dashboardData.stats.totalSubmissions || 0).toString() },
    { label: 'Pending Classification', value: (dashboardData.stats.pendingClassification || 0).toString() },
    { label: 'Active Reviewers', value: (dashboardData.stats.activeReviewers || 0).toString() },
    { label: 'Completed Classifications', value: (dashboardData.stats.completedClassifications || 0).toString() },
  ] : [];

  const dueStats = (() => {
    if (!dashboardData) return { overdueItems: [], dueSoonItems: [] };
    const all = [...(dashboardData.pendingClassification || []), ...(dashboardData.recentSubmissions || [])];
    const overdueItems: any[] = [];
    const dueSoonItems: any[] = [];
    for (const s of all) {
      const meta = getDueMeta(s);
      if (meta.overdue) overdueItems.push({ ...s, due: meta.due });
      else if (meta.dueSoon) dueSoonItems.push({ ...s, due: meta.due });
    }
    return { overdueItems, dueSoonItems };
  })();

  const needsAttention = [
    { id: 1, count: dashboardData?.attention?.needsClassification || 0, message: 'new submissions need document classification', subtext: 'These submissions need to be classified before assigning reviewers', action: 'Classify Submissions', route: '/secretariatmodule/submissions' },
    { id: 2, count: dashboardData?.attention?.overdueReviews || 0, message: 'reviewers have overdue reviews', subtext: 'Some reviewers are late by more than 7 days', action: 'View Reviewers', route: '/secretariatmodule/reviewers' },
  ];

  if (loading) {
     return (
        <DashboardLayout role={"secretariat" as any} roleTitle="Secretariat" pageTitle="Dashboard">
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#101C50]"></div>
            </div>
        </DashboardLayout>
     );
  }

  return (
    <DashboardLayout role={"secretariat" as any} roleTitle="Secretariat" pageTitle="Dashboard">
        
        {/* 1. Stats Grid (Top) */}
        <DashboardStats stats={stats} />

        {/* 2. Overdue / Due Soon Cards (Middle) */}
        <DeadlineCards 
            overdueItems={dueStats.overdueItems} 
            dueSoonItems={dueStats.dueSoonItems}
            onItemClick={handleSubmissionClick}
        />

        {/* 3. Recent Submissions Card (Full Width) */}
        <div className="mb-8">
            <RecentSubmissionsCard 
                submissions={dashboardData?.recentSubmissions || []}
                onSubmissionClick={handleSubmissionClick}
            />
        </div>

        {/* 4. Needs Attention Card (Full Width) */}
        <div className="mb-8">
             <NeedsAttentionCard 
                items={needsAttention}
                onActionClick={(route) => router.push(route)}
             />
        </div>

                {/* 5. Announcements Card (Bottom) */}
        <div className="mb-8">
             <AnnouncementsCard 
                announcements={announcements} 
                onAddClick={handleOpenCreate}
                onEditClick={handleOpenEdit} 
                onDeleteClick={(id) => setShowDeleteModal(id)}
            />
        </div>


        {/* Modals */}
        <AnnouncementModal 
            isOpen={showAnnouncementModal}
            onClose={() => setShowAnnouncementModal(false)}
            data={currentAnnouncement}
            setData={setCurrentAnnouncement}
            onSave={handleSaveAnnouncement}
            isEditing={isEditing}
        />

        <DeleteModal 
            isOpen={!!showDeleteModal}
            onClose={() => setShowDeleteModal(null)}
            onConfirm={confirmDelete}
        />

    </DashboardLayout>
  );
}
