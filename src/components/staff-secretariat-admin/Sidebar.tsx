// components/Sidebar.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  BarChart3, 
  LogOut,
  UserCog,
  GraduationCap,
  Menu,
  X
} from 'lucide-react';

interface MenuItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  key: string;
}

interface SidebarProps {
  role: 'staff' | 'secretariat' | 'admin';
  roleTitle: string;
  activeNav?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ role, roleTitle, activeNav }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Define menu items based on role
  const getMenuItems = (): MenuItem[] => {
    const baseItems: MenuItem[] = [
      {
        label: 'Dashboard',
        href: `/${role}module`,
        icon: <LayoutDashboard size={22} />,
        key: 'dashboard',
      },
      {
        label: 'Submissions',
        href: `/${role}module/submissions`,
        icon: <FileText size={22} />,
        key: 'submissions',
      },
    ];

    const roleSpecificItems: Record<string, MenuItem[]> = {
      staff: [
        {
          label: 'Reviewers',
          href: '/staffmodule/reviewers',
          icon: <Users size={22} />,
          key: 'reviewers',
        },
        {
          label: 'Reports',
          href: '/staffmodule/reports',
          icon: <BarChart3 size={22} />,
          key: 'reports',
        },
        {
          label: 'Settings',
          href: '/staffmodule/settings',
          icon: <Settings size={22} />,
          key: 'settings',
        },
      ],
      secretariat: [
        {
          label: 'Reviewers',
          href: '/secretariatmodule/reviewers',
          icon: <Users size={22} />,
          key: 'reviewers',
        },
        {
          label: 'Reports',
          href: '/secretariatmodule/reports',
          icon: <BarChart3 size={22} />,
          key: 'reports',
        },
        {
          label: 'Settings',
          href: '/secretariatmodule/settings',
          icon: <Settings size={22} />,
          key: 'settings',
        },
      ],
      admin: [
        {
          label: 'Researcher Management',
          href: '/adminmodule/researchers',
          icon: <GraduationCap size={22} />,
          key: 'researchers',
        },
        {
          label: 'Reviewer Management',
          href: '/adminmodule/reviewers',
          icon: <UserCog size={22} />,
          key: 'reviewers',
        },
        {
          label: 'Reports',
          href: '/adminmodule/reports',
          icon: <BarChart3 size={22} />,
          key: 'reports',
        },
        {
          label: 'Settings',
          href: '/adminmodule/settings',
          icon: <Settings size={22} />,
          key: 'settings',
        },
      ],
    };

    return [...baseItems, ...roleSpecificItems[role]];
  };

  const menuItems = getMenuItems();

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    router.push('/login');
    setShowLogoutModal(false);
    closeMobileMenu();
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      {/* Mobile Menu Button - Enhanced Design */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-gradient-to-br from-[#050C2D] to-[#071139] text-white rounded-xl shadow-2xl hover:scale-110 transition-all duration-300 border border-[#F0E847]/20"
      >
        {isMobileMenuOpen ? <X size={24} className="text-[#F0E847]" /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay - Elegant backdrop blur */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 backdrop-blur-sm transition-opacity duration-300"
          style={{ backgroundColor: 'rgba(5, 12, 45, 0.6)' }}
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar - Enhanced Glassmorphism Design */}
      <aside
        className={`
          w-72 sm:w-80 bg-gradient-to-b from-[#050C2D] to-[#071139] h-screen flex flex-col fixed left-0 top-0 shadow-2xl overflow-y-auto
          transition-all duration-300 ease-in-out
          lg:z-30 z-50 border-r border-[#F0E847]/10
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo and Role Title - Enhanced */}
        <div className="px-5 sm:px-6 py-6 border-b border-[#F0E847]/10 flex-shrink-0 bg-[#050C2D]/50">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 bg-white/5 p-2 border border-[#F0E847]/20 hover:scale-105 transition-transform duration-300">
              <Image
                src="/img/umreclogonobg.png"
                alt="UMREC Logo"
                width={80}
                height={80}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-xl sm:text-2xl leading-tight truncate" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                UMREC
              </p>
              <p className="text-[#F0E847] text-base sm:text-lg font-bold truncate" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {roleTitle}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu - Enhanced with animations */}
        <nav className="flex-1 py-6 sm:py-8 space-y-1.5 overflow-y-auto px-3 sm:px-4">
          {menuItems.map((item, index) => {
            const isActive = activeNav 
              ? activeNav === item.key
              : pathname === item.href || pathname?.startsWith(item.href + '/');
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobileMenu}
                className={`
                  flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-4 rounded-xl
                  transition-all duration-300 group relative overflow-hidden
                  ${isActive 
                    ? 'bg-gradient-to-r from-[#D3CC50] to-[#F0E847] text-[#050C2D] shadow-lg shadow-[#F0E847]/30 scale-105' 
                    : 'text-gray-300 hover:bg-white/5 hover:text-white hover:translate-x-2'
                  }
                `}
              >
                {/* Animated background gradient for hover */}
                {!isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#F0E847]/0 via-[#F0E847]/5 to-[#F0E847]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                )}
                
                <span className={`relative z-10 ${isActive ? 'text-[#050C2D]' : 'text-[#F0E847] group-hover:scale-110 transition-transform duration-300'}`}>
                  {item.icon}
                </span>
                <span className="text-sm sm:text-base font-semibold relative z-10 truncate" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  {item.label}
                </span>
                
                {/* Active indicator dot */}
                {isActive && (
                  <span className="absolute right-3 sm:right-4 w-2 h-2 bg-[#050C2D] rounded-full animate-pulse"></span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button - Enhanced Design */}
        <div className="border-t border-[#F0E847]/10 flex-shrink-0 p-3 sm:p-4 bg-[#050C2D]/50">
          <button
            onClick={handleLogoutClick}
            className="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-4 text-gray-300 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 w-full rounded-xl group relative overflow-hidden border border-transparent hover:border-red-500/30"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/5 to-red-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            
            <LogOut size={22} className="relative z-10 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-sm sm:text-base font-semibold relative z-10" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Log Out
            </span>
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal - Enhanced Glassmorphism */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[60] p-4" style={{ backgroundColor: 'rgba(3, 2, 17, 0.91)' }}>
          <div className="relative w-full max-w-md mx-4 animate-fade-in">
            <div className="relative rounded-2xl p-1 overflow-hidden">
              {/* Animated border glow */}
              <div 
                className="absolute inset-0 rounded-2xl animate-spin-slow" 
                style={{
                  background: 'conic-gradient(from 0deg, transparent 0deg, transparent 240deg, #AFA127 280deg, #F0E847 320deg, #AFA127 360deg)',
                  filter: 'blur(20px)'
                }}
              ></div>
              
              {/* Enhanced glow effect */}
              <div className="absolute inset-0 rounded-2xl" style={{
                boxShadow: '0 0 40px rgba(240, 232, 71, 0.4), inset 0 0 20px rgba(240, 232, 71, 0.2)'
              }}></div>

              {/* Modal Content */}
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#050C2D] to-[#071139]">
                {/* Logo */}
                <div className="py-6 flex justify-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/5 p-3 border border-[#F0E847]/20">
                    <Image 
                      src="/img/umreclogonobg.png" 
                      alt="UMRec Logo" 
                      width={80} 
                      height={80}
                      className="w-full h-full object-contain animate-pulse"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 sm:px-8 pb-6 sm:pb-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 text-center" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Confirm Logout
                  </h3>
                  <p className="text-gray-300 text-sm sm:text-base mb-6 text-center leading-relaxed" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Are you sure you want to log out? You will need to sign in again to access your account.
                  </p>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleLogoutCancel}
                      className="flex-1 px-4 py-3 bg-white/5 text-white rounded-lg font-semibold hover:bg-white/10 hover:scale-105 transition-all duration-300 text-sm sm:text-base border border-white/10"
                      style={{ fontFamily: 'Metropolis, sans-serif' }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleLogoutConfirm}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:from-red-700 hover:to-red-800 hover:scale-105 transition-all duration-300 text-sm sm:text-base shadow-lg shadow-red-500/30"
                      style={{ fontFamily: 'Metropolis, sans-serif' }}
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inline Styles for Animations */}
      <style jsx global>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        /* Custom Scrollbar */
        aside::-webkit-scrollbar {
          width: 6px;
        }

        aside::-webkit-scrollbar-track {
          background: transparent;
        }

        aside::-webkit-scrollbar-thumb {
          background: rgba(240, 232, 71, 0.2);
          border-radius: 3px;
        }

        aside::-webkit-scrollbar-thumb:hover {
          background: rgba(240, 232, 71, 0.4);
        }
      `}</style>
    </>
  );
};

export default Sidebar;
