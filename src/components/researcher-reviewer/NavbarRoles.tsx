// components/NavbarRoles.tsx
'use client';

import Link from 'next/link';
import { Bell, User, Menu, X, LogOut, UserCircle } from 'lucide-react';
import Image from 'next/image';
import { marcellus, metropolis } from '@/app/fonts';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { updateReviewerAvailability, getReviewerAvailability } from '@/app/actions/reviewer/updateAvailability';
import { createPortal } from 'react-dom';
import { createClient } from '@/utils/supabase/client'; // ✅ ADDED

// ... (all your interfaces stay the same)
interface NavLinkProps {
  href: string;
  text: string;
  icon?: 'user' | 'bell';
  showLine?: boolean;
}

interface IconLinkProps {
  href: string;
  icon: 'bell' | 'user';
  ariaLabel: string;
}

const NAV_LINKS = {
  main: {
    mainLinks: [
      { href: '/login', text: 'Login', icon: 'user' },
    ] as NavLinkProps[],
    iconLinks: [] as IconLinkProps[],
  },

  researcher: {
    mainLinks: [
      { href: '/researchermodule', text: 'Dashboard' },
      { href: '/researchermodule/submissions/new', text: 'Submission' },
      { href: '/help-center', text: 'Help Center' },
    ] as NavLinkProps[],
    iconLinks: [
      { href: '/researchermodule/notifications', icon: 'bell', ariaLabel: 'Notifications' },
      { href: '/researchermodule/profile', icon: 'user', ariaLabel: 'Account' },
    ] as IconLinkProps[],
  },

  reviewer: {
    mainLinks: [
      { href: '/reviewermodule', text: 'Dashboard' },
      { href: '/reviewermodule/reviews', text: 'Reviews' },
      { href: '/help-center', text: 'Help Center' },
    ] as NavLinkProps[],
    iconLinks: [
      { href: '/reviewermodule/notifications', icon: 'bell', ariaLabel: 'Notifications' },
      { href: '/reviewermodule/profile', icon: 'user', ariaLabel: 'Account' },
    ] as IconLinkProps[],
  },
};

const NavButton: React.FC<NavLinkProps & { isActive: boolean; onClick?: () => void; showLine?: boolean }> = ({ href, text, icon, isActive, onClick, showLine = true }) => {
  const IconComponent = icon === 'bell' ? Bell : icon === 'user' ? User : null;
  
  return (
    <Link 
      href={href}
      onClick={onClick}
      className="inline-block relative group"
    >
      <div className={`px-2 md:px-3 py-2 md:py-2 transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
        isActive ? 'text-[#F0E847]' : 'text-white hover:text-[#F0E847]'
      }`}
      style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 500, fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
        {IconComponent && <IconComponent className="w-5 h-5 md:w-5 md:h-5" />}
        {text}
      </div>
      {showLine && (
        <div className={`absolute bottom-[-16px] md:bottom-[-21px] left-0 right-0 h-[3px] md:h-[4px] bg-gradient-to-r from-[#D3CC50] to-[#F0E847] transition-all duration-300 ${
          isActive ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100'
        }`} style={{ boxShadow: '0 0 10px rgba(240, 232, 71, 0.5)' }}></div>
      )}
    </Link>
  );
};

const NotificationDropdown: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  if (!isOpen) return null;
  
  const notifications = [
    { id: 1, message: 'Your consent form requires revision.', time: '2 hours ago', type: 'revision' },
    { id: 2, message: 'Your research protocol has been approved.', time: '5 hours ago', type: 'approved' },
    { id: 3, message: 'Your submission is currently under review.', time: '1 day ago', type: 'review' },
  ];
  
  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-[#050B24]/95 backdrop-blur-xl rounded-xl shadow-2xl border border-[#F0E847]/20 overflow-hidden z-50 animate-dropdown">
      <div className="p-4 border-b border-[#F0E847]/10 bg-gradient-to-r from-[#071139] to-[#050B24]">
        <h3 className="text-white font-bold text-lg" style={{ fontFamily: 'Metropolis, sans-serif' }}>Notifications</h3>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.map((notif) => (
          <div 
            key={notif.id} 
            className="p-4 border-b border-[#F0E847]/5 hover:bg-[#F0E847]/5 transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#D3CC50] to-[#F0E847] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Bell size={16} className="text-[#050B24]" />
              </div>
              <div className="flex-1">
                <p className="text-white text-sm" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  {notif.message}
                </p>
                <p className="text-gray-400 text-xs mt-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  {notif.time}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const LogoutModal: React.FC<{ isOpen: boolean; onClose: () => void; onConfirm: () => void; isLoading?: boolean }> = ({ isOpen, onClose, onConfirm, isLoading = false }) => {
  if (!isOpen) return null;

  return createPortal(
    <>
      <div 
        className="fixed top-0 left-0 right-0 bottom-0 z-[99999] flex items-center justify-center p-4 animate-fade-in"
        style={{ 
          backgroundColor: 'rgba(3, 2, 17, 0.91)',
          backdropFilter: 'blur(8px)'
        }}
        onClick={onClose}
      >
        <div 
          className="relative w-full max-w-md mx-auto my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative rounded-2xl p-1 sm:p-1.5 overflow-hidden">
            <div className="absolute inset-0 rounded-2xl animate-spin-slow" style={{
              background: 'conic-gradient(from 0deg, transparent 0deg, transparent 240deg, #AFA127 280deg, #F0E847 320deg, #AFA127 360deg)',
              filter: 'blur(20px)'
            }}></div>
            
            <div className="absolute inset-0 rounded-2xl" style={{
              boxShadow: '0 0 40px rgba(240, 232, 71, 0.4), inset 0 0 20px rgba(240, 232, 71, 0.2)'
            }}></div>

            <div className="relative rounded-2xl overflow-hidden" style={{ backgroundColor: '#050C2D' }}>
              <div className="py-6 flex justify-center">
                <Image 
                  src="/img/umreclogonobg.png" 
                  alt="UMRec Logo" 
                  width={80} 
                  height={80}
                  className="w-16 h-16 sm:w-20 sm:h-20 animate-pulse-subtle"
                />
              </div>

              <div className="px-6 sm:px-8 pb-6 sm:pb-8">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 text-center" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Confirm Logout
                </h3>
                <p className="text-gray-300 text-sm sm:text-base mb-6 text-center" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Are you sure you want to log out of your account?
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={onConfirm}
                    disabled={isLoading}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:from-red-700 hover:to-red-800 hover:scale-105 transition-all duration-300 text-sm sm:text-base shadow-lg shadow-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Logging Out...
                      </>
                    ) : (
                      'Logout'
                    )}
                  </button>
                  <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="flex-1 px-4 py-3 bg-gray-600/80 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-gray-700 hover:scale-105 transition-all duration-300 text-sm sm:text-base shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes pulse-subtle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-pulse-subtle {
          animation: pulse-subtle 3s ease-in-out infinite;
        }
      `}</style>
    </>,
    document.body
  );
};

const AccountDropdown: React.FC<{ isOpen: boolean; onClose: () => void; role: keyof typeof NAV_LINKS }> = ({ isOpen, onClose, role }) => {
  const [availability, setAvailability] = useState<'available' | 'unavailable'>('available');
  const [loading, setLoading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // ✅ ADDED
  const supabase = createClient(); // ✅ ADDED
  
  useEffect(() => {
    if (isOpen && role === 'reviewer') {
      loadAvailability();
    }
  }, [isOpen, role]);

  const loadAvailability = async () => {
    const result = await getReviewerAvailability();
    if (result.success && result.availability) {
      const status = result.availability;
      if (status === 'available' || status === 'unavailable') {
        setAvailability(status);
      }
    }
  };
  
  if (!isOpen) return null;
  
  const isReviewer = role === 'reviewer';
  const isAvailable = availability === 'available';
  
  const toggleAvailability = async () => {
    if (loading) return;
    
    const newStatus = availability === 'available' ? 'unavailable' : 'available';
    setLoading(true);
    setAvailability(newStatus);
    
    const result = await updateReviewerAvailability(newStatus);
    
    if (result.success) {
      console.log('✅ Availability changed to:', newStatus);
    } else {
      setAvailability(availability);
      console.error('❌ Failed to update availability:', result.error);
      alert('Failed to update availability. Please try again.');
    }
    
    setLoading(false);
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  // ✅ UPDATED: Actually sign out from Supabase
  const handleLogoutConfirm = async () => {
    try {
      setIsLoggingOut(true);
      
      // ✅ Sign out from Supabase (destroys session)
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
      }
      
      setShowLogoutModal(false);
      onClose();
      
      // ✅ Redirect to login page
      window.location.href = '/login';
      
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
      // Still try to redirect
      window.location.href = '/login';
    }
  };
  
  return (
    <>
      <div className="absolute right-0 top-full mt-2 w-56 bg-[#050B24]/95 backdrop-blur-xl rounded-xl shadow-2xl border border-[#F0E847]/20 overflow-hidden z-50 animate-dropdown">
        {isReviewer && (
          <>
            <div className="p-4 bg-gradient-to-r from-[#071139] to-[#050B24]">
              <p className="text-gray-400 text-xs mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Availability Status
              </p>
              <div className="flex items-center justify-between">
                <span className="text-white text-sm font-semibold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  {isAvailable ? 'Available' : 'Unavailable'}
                </span>
                
                <button
                  onClick={toggleAvailability}
                  disabled={loading}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none shadow-lg ${
                    isAvailable ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gray-600'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}`}
                  role="switch"
                  aria-checked={isAvailable}
                  style={{ boxShadow: isAvailable ? '0 0 15px rgba(34, 197, 94, 0.5)' : 'none' }}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 shadow-md ${
                      isAvailable ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-[#F0E847]/20 to-transparent" />
          </>
        )}
        
        <Link 
          href={role === 'reviewer' ? '/reviewermodule/profile' : '/researchermodule/profile'}
          className="flex items-center gap-3 p-4 hover:bg-[#F0E847]/10 transition-all duration-300 group"
          onClick={onClose}
        >
          <UserCircle size={20} className="text-white group-hover:text-[#F0E847] transition-colors duration-300" />
          <span className="text-white group-hover:text-[#F0E847] transition-colors duration-300" style={{ fontFamily: 'Metropolis, sans-serif' }}>Profile</span>
        </Link>
        <div className="h-px bg-gradient-to-r from-transparent via-[#F0E847]/20 to-transparent" />
        <button 
          className="flex items-center gap-3 p-4 hover:bg-red-500/10 transition-all duration-300 w-full text-left group"
          onClick={handleLogoutClick}
        >
          <LogOut size={20} className="text-red-500 group-hover:scale-110 transition-transform duration-300" />
          <span className="text-red-500 group-hover:text-red-400 transition-colors duration-300" style={{ fontFamily: 'Metropolis, sans-serif' }}>Logout</span>
        </button>
      </div>

      <LogoutModal 
        isOpen={showLogoutModal} 
        onClose={() => setShowLogoutModal(false)} 
        onConfirm={handleLogoutConfirm}
        isLoading={isLoggingOut}
      />

      <style jsx>{`
        @keyframes dropdown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-dropdown {
          animation: dropdown 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

interface NavbarProps {
  role: keyof typeof NAV_LINKS;
}

const NavbarRoles: React.FC<NavbarProps> = ({ role }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  const { mainLinks, iconLinks } = NAV_LINKS[role] || NAV_LINKS.main;
  const isMainRole = role === 'main';
  
  const isLinkActive = (href: string) => {
    if (href.includes('/submissions')) {
      return pathname?.startsWith('/researchermodule/submissions');
    }
    
    if (href.includes('/reviews')) {
      return pathname?.startsWith('/reviewermodule/reviews') || pathname?.startsWith('/reviewermodule/review-submission');
    }
    
    return pathname === href;
  };
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const getBackgroundClass = () => {
    if (isMainRole) {
      return isScrolled ? 'bg-[#071139]/95 backdrop-blur-xl border-b border-[#F0E847]/10' : 'bg-transparent';
    }
    return 'bg-[#071139]/95 backdrop-blur-xl border-b border-[#F0E847]/10';
  };
  
  return (
    <>
      <nav className={`${getBackgroundClass()} py-3 md:py-4 px-4 md:px-4 flex justify-between items-center shadow-lg fixed top-0 left-0 right-0 z-50 transition-all duration-300`}>
        <div className="flex items-center gap-3 md:gap-4">
          {!isMainRole && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden relative group"
              aria-label="Toggle menu"
            >
              <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-[#F0E847]/10 to-transparent border border-[#F0E847]/30 flex items-center justify-center hover:bg-[#F0E847]/20 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[#F0E847]/30">
                <Menu size={22} className="text-[#F0E847] group-hover:scale-110 transition-transform duration-300" />
              </div>
            </button>
          )}

          <div className="text-white text-xl font-extrabold">
            <a href="/" className="hover:opacity-80 transition-opacity duration-300">
              <Image 
                src="/img/logonavbar.png" 
                alt="Logo" 
                width={350} 
                height={350}
                className="w-44 md:w-[350px] h-auto"
              />
            </a>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <div className="flex space-x-4">
            {mainLinks.map((link) => (
              <NavButton 
                key={link.href} 
                href={link.href} 
                text={link.text} 
                icon={link.icon}
                isActive={isLinkActive(link.href)}
                showLine={true}
              />
            ))}
          </div>
          
          {iconLinks.length > 0 && (
            <>
              <div className="h-6 w-px bg-gradient-to-b from-transparent via-[#F0E847]/30 to-transparent" />
              <div className="flex space-x-2 relative">
                <button
                  onClick={() => {
                    setNotificationOpen(!notificationOpen);
                    setAccountOpen(false);
                  }}
                  className="text-white hover:text-[#F0E847] hover:bg-[#F0E847]/10 p-2 rounded-lg transition-all duration-300 relative group"
                  aria-label="Notifications"
                >
                  <Bell size={20} className="group-hover:scale-110 transition-transform duration-300" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#F0E847] rounded-full shadow-lg shadow-[#F0E847]/50 animate-pulse"></span>
                </button>
                
                <NotificationDropdown isOpen={notificationOpen} />
                
                <div className="relative">
                  <button
                    onClick={() => {
                      setAccountOpen(!accountOpen);
                      setNotificationOpen(false);
                    }}
                    className="text-white hover:text-[#F0E847] hover:bg-[#F0E847]/10 p-2 rounded-lg transition-all duration-300 group"
                    aria-label="Account"
                  >
                    <User size={20} className="group-hover:scale-110 transition-transform duration-300" />
                  </button>
                  
                  <AccountDropdown isOpen={accountOpen} onClose={() => setAccountOpen(false)} role={role} />
                </div>
              </div>
            </>
          )}
        </div>

        {isMainRole && (
          <div className="md:hidden flex items-center">
            {mainLinks.map((link) => (
              <NavButton 
                key={link.href} 
                href={link.href} 
                text={link.text} 
                icon={link.icon}
                isActive={isLinkActive(link.href)}
                showLine={false}
              />
            ))}
          </div>
        )}

        {!isMainRole && (
          <div className="md:hidden flex items-center space-x-2">
            {iconLinks.length > 0 && (
              <>
                <div className="relative">
                  <button
                    onClick={() => {
                      setNotificationOpen(!notificationOpen);
                      setAccountOpen(false);
                    }}
                    className="text-white hover:text-[#F0E847] hover:bg-[#F0E847]/10 p-2 rounded-lg transition-all duration-300 relative"
                    aria-label="Notifications"
                  >
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#F0E847] rounded-full animate-pulse"></span>
                  </button>
                  
                  <NotificationDropdown isOpen={notificationOpen} />
                </div>
                
                <div className="relative">
                  <button
                    onClick={() => {
                      setAccountOpen(!accountOpen);
                      setNotificationOpen(false);
                    }}
                    className="text-white hover:text-[#F0E847] hover:bg-[#F0E847]/10 p-2 rounded-lg transition-all duration-300"
                    aria-label="Account"
                  >
                    <User size={20} />
                  </button>
                  
                  <AccountDropdown isOpen={accountOpen} onClose={() => setAccountOpen(false)} role={role} />
                </div>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Mobile Sidebar */}
      {!isMainRole && (
        <div 
          className={`md:hidden fixed left-0 top-0 bottom-0 w-80 bg-gradient-to-b from-[#071139] to-[#050B24] shadow-2xl z-40 overflow-y-auto transition-transform duration-300 border-r border-[#F0E847]/20 ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex justify-between items-center p-4 border-b border-[#F0E847]/10 bg-[#050B24]/50 backdrop-blur-sm">
            <Image 
              src="/img/logonavbar.png" 
              alt="Logo" 
              width={200} 
              height={50} 
            />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-white p-2 hover:bg-[#F0E847]/10 rounded-lg transition-all duration-300"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex flex-col pt-8 px-6 space-y-6">
            {mainLinks.map((link) => (
              <div key={link.href} className="group">
                <Link
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-xl transition-all duration-300 block relative ${
                    isLinkActive(link.href) ? 'text-[#F0E847]' : 'text-white hover:text-[#F0E847]'
                  }`}
                  style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 500 }}
                >
                  {link.text}
                  <span className={`absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-[#D3CC50] to-[#F0E847] transition-all duration-300 ${
                    isLinkActive(link.href) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`} style={{ boxShadow: '0 0 10px rgba(240, 232, 71, 0.5)' }}></span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default NavbarRoles;
