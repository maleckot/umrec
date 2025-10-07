// components/DashboardLayout.tsx
'use client';

import { ReactNode, useState, useRef, useEffect } from 'react';
import Sidebar from '@/components/staff-secretariat-admin/Sidebar';
import Footer from '@/components/researcher-reviewer/Footer';
import { Bell, X } from 'lucide-react';

interface DashboardLayoutProps {
  role: 'staff' | 'admin' | 'secretariat';
  roleTitle: string;
  pageTitle: string;
  children: ReactNode;
  activeNav?: 'dashboard' | 'submissions' | 'reviewers' | 'settings' | 'reports';
}

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'info' | 'warning' | 'success';
}

export default function DashboardLayout({ role, roleTitle, pageTitle, children, activeNav = 'dashboard' }: DashboardLayoutProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: 'New Submission Received',
      message: 'A new research paper has been submitted for review',
      time: '2 hours ago',
      isRead: false,
      type: 'info',
    },
    {
      id: 2,
      title: 'Review Deadline Approaching',
      message: '3 papers require review within the next 48 hours',
      time: '5 hours ago',
      isRead: false,
      type: 'warning',
    },
    {
      id: 3,
      title: 'Review Completed',
      message: 'Prof. Juan Dela Cruz completed a review',
      time: '1 day ago',
      isRead: true,
      type: 'success',
    },
    {
      id: 4,
      title: 'Document Verification Needed',
      message: '2 submissions need document verification',
      time: '1 day ago',
      isRead: true,
      type: 'warning',
    },
  ]);

  const notificationRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Fix hydration error
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };

    if (isNotificationOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationOpen]);

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return (
          <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'success':
        return (
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  // Prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className="flex" style={{ backgroundColor: '#DAE0E7', minHeight: '100vh' }}>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex" style={{ backgroundColor: '#DAE0E7', minHeight: '100vh' }}>
      <Sidebar role={role} roleTitle={roleTitle} activeNav={activeNav} />

      <div className="flex-1 lg:ml-80 flex flex-col" style={{ minHeight: '100vh' }}>
        <div className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-20">
          <h1 className="text-xl lg:text-2xl font-bold ml-12 lg:ml-0" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
            {pageTitle}
          </h1>
          
          {/* Notification Button */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer relative"
            >
              <Bell size={24} className="text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-96 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden z-50 max-h-[80vh] sm:max-h-none">
                {/* Header */}
                <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-[#101C50] sticky top-0 z-10">
                  <h3 className="text-base sm:text-lg font-bold text-white" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-[#FFD700] hover:text-[#FFC700] font-medium cursor-pointer"
                      style={{ fontFamily: 'Metropolis, sans-serif' }}
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                {/* Notifications List */}
                <div className="max-h-[60vh] sm:max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-3 sm:px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                          !notification.isRead ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start gap-2 sm:gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className={`text-xs sm:text-sm font-semibold ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                                {notification.title}
                              </p>
                              <button
                                onClick={() => deleteNotification(notification.id)}
                                className="flex-shrink-0 text-gray-400 hover:text-gray-600 cursor-pointer"
                              >
                                <X size={16} />
                              </button>
                            </div>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between mt-2 flex-wrap gap-1">
                              <p className="text-xs text-gray-500" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                                {notification.time}
                              </p>
                              {!notification.isRead && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer whitespace-nowrap"
                                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                                >
                                  Mark as read
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center">
                      <Bell size={48} className="text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-500" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        No notifications
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                  <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sticky bottom-0">
                    <button className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium w-full text-center cursor-pointer" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      View all notifications
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 p-4 lg:p-8">
          {children}
        </div>

        <Footer />
      </div>
    </div>
  );
}
