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
        icon: <LayoutDashboard size={24} />,
        key: 'dashboard',
      },
      {
        label: 'Submissions',
        href: `/${role}module/submissions`,
        icon: <FileText size={24} />,
        key: 'submissions',
      },
    ];

    const roleSpecificItems: Record<string, MenuItem[]> = {
      staff: [
        {
          label: 'Reviewers',
          href: '/staffmodule/reviewers',
          icon: <Users size={24} />,
          key: 'reviewers',
        },
        {
          label: 'Reports',
          href: '/staffmodule/reports',
          icon: <BarChart3 size={24} />,
          key: 'reports',
        },
        {
          label: 'Settings',
          href: '/staffmodule/settings',
          icon: <Settings size={24} />,
          key: 'settings',
        },
      ],
      secretariat: [
        {
          label: 'Reviewers',
          href: '/secretariatmodule/reviewers',
          icon: <Users size={24} />,
          key: 'reviewers',
        },
        {
          label: 'Reports',
          href: '/secretariatmodule/reports',
          icon: <BarChart3 size={24} />,
          key: 'reports',
        },
        {
          label: 'Settings',
          href: '/secretariatmodule/settings',
          icon: <Settings size={24} />,
          key: 'settings',
        },
      ],
      admin: [
        {
          label: 'Researcher Management',
          href: '/adminmodule/researchers',
          icon: <GraduationCap size={24} />,
          key: 'researchers',
        },
        {
          label: 'Reviewer Management',
          href: '/adminmodule/reviewers',
          icon: <UserCog size={24} />,
          key: 'reviewers',
        },
        {
          label: 'Reports',
          href: '/adminmodule/reports',
          icon: <BarChart3 size={24} />,
          key: 'reports',
        },
        {
          label: 'Settings',
          href: '/adminmodule/settings',
          icon: <Settings size={24} />,
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
    // Clear any authentication tokens/session data here
    // Example: localStorage.removeItem('authToken');
    
    // Redirect to login page
    router.push('/login');
    setShowLogoutModal(false);
    closeMobileMenu();
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#050C2D] text-white rounded-lg shadow-lg cursor-pointer"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay - Semi-transparent to show content behind */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          w-80 bg-[#050C2D] h-screen flex flex-col fixed left-0 top-0 shadow-2xl overflow-y-auto
          transition-transform duration-300 ease-in-out
          lg:z-30 z-50
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo and Role Title */}
        <div className="px-5 py-6 border-b border-[#FFD700]/10 flex-shrink-0">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
              <Image
                src="/img/umreclogonobg.png"
                alt="UMREC Logo"
                width={80}
                height={80}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <p className="text-white font-bold text-2xl leading-tight" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                UMREC
              </p>
              <p className="text-[#FFD700] text-xl font-bold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {roleTitle}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-8 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            // Use activeNav if provided, otherwise fall back to pathname matching
            const isActive = activeNav 
              ? activeNav === item.key
              : pathname === item.href || pathname?.startsWith(item.href + '/');
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobileMenu}
                className={`
                  flex items-center gap-4 px-8 py-4 transition-all duration-200
                  ${isActive 
                    ? 'bg-[#FFD700] text-[#050C2D] shadow-xl' 
                    : 'text-gray-300 hover:bg-[#0A1435] hover:text-white hover:pl-10'
                  }
                `}
              >
                <span className={isActive ? 'text-[#050C2D]' : ''}>
                  {item.icon}
                </span>
                <span className="text-base font-semibold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="border-t border-[#FFD700]/10 flex-shrink-0">
          <button
            onClick={handleLogoutClick}
            className="flex items-center gap-4 px-8 py-4 text-gray-300 hover:bg-[#0A1435] hover:text-white transition-all duration-200 w-full cursor-pointer rounded-lg"
          >
            <LogOut size={24} />
            <span className="text-base font-semibold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Log Out
            </span>
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[60] p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-[#003366] mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Confirm Logout
              </h3>
              <p className="text-sm text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Are you sure you want to log out? You will need to sign in again to access your account.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleLogoutCancel}
                className="flex-1 px-4 py-2.5 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors text-sm"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors text-sm"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
