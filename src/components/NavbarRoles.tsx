// components/NavbarRoles.tsx
'use client';

import Link from 'next/link';
import { Bell, User, Menu, X, LogOut, UserCircle } from 'lucide-react';
import Image from 'next/image';
import { marcellus, metropolis } from '@/app/fonts';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

// Interface for a single text link object
interface NavLinkProps {
  href: string;
  text: string;
  icon?: 'user' | 'bell';
  showLine?: boolean;
}

// Interface for icon-based links
interface IconLinkProps {
  href: string;
  icon: 'bell' | 'user';
  ariaLabel: string;
}

// Data structures for different user roles
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
      { href: '/researchermodule/submissions/new/step1', text: 'Submission' },
      { href: '/researchermodule/help center', text: 'Help Center' },
    ] as NavLinkProps[],
    iconLinks: [
      { href: '/researchermodule/notifications', icon: 'bell', ariaLabel: 'Notifications' },
      { href: '/researchermodule/acccount', icon: 'user', ariaLabel: 'Account' },
    ] as IconLinkProps[],
  },

  reviewer: {
    mainLinks: [
      { href: '/reviewermodule', text: 'Dashboard' },
      { href: '/reviewer/reviews', text: 'Reviews' },
      { href: '/reviewer/help', text: 'Help Center' },
    ] as NavLinkProps[],
    iconLinks: [
      { href: '/reviewer/notifications', icon: 'bell', ariaLabel: 'Notifications' },
      { href: '/reviewer/account', icon: 'user', ariaLabel: 'Account' },
    ] as IconLinkProps[],
  },
};

// Helper component for rendering individual text links
const NavButton: React.FC<NavLinkProps & { isActive: boolean; onClick?: () => void; showLine?: boolean }> = ({ href, text, icon, isActive, onClick, showLine = true }) => {
  const IconComponent = icon === 'bell' ? Bell : icon === 'user' ? User : null;
  
  return (
    <Link 
      href={href}
      onClick={onClick}
      className="inline-block relative"
    >
      <div className={`px-3 py-2 transition duration-150 flex items-center gap-2 whitespace-nowrap ${
        isActive ? 'text-[#F0E847]' : 'text-white hover:text-gray-300'
      }`}
      style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 500 }}>
        {IconComponent && <IconComponent size={20} />}
        {text}
      </div>
      {/* Yellow line at the bottom - only show on desktop */}
      {isActive && showLine && (
        <div className="absolute bottom-[-21px] left-0 right-0 h-[4px] bg-[#F0E847]"></div>
      )}
    </Link>
  );
};

// Notification dropdown component
const NotificationDropdown: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  if (!isOpen) return null;
  
  const notifications = [
    { id: 1, message: 'Your consent form requires revision.', time: '2 hours ago', type: 'revision' },
    { id: 2, message: 'Your research protocol has been approved.', time: '5 hours ago', type: 'approved' },
    { id: 3, message: 'Your submission is currently under review.', time: '1 day ago', type: 'review' },
  ];
  
  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-[#071139] rounded-lg shadow-xl border border-gray-700 overflow-hidden z-50">
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-white font-bold" style={{ fontFamily: 'Metropolis, sans-serif' }}>Notifications</h3>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.map((notif) => (
          <div 
            key={notif.id} 
            className="p-4 border-b border-gray-800 hover:bg-[#0a1a4a] transition-colors cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#F0E847] rounded-full flex items-center justify-center flex-shrink-0">
                <Bell size={16} className="text-[#071139]" />
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

// Account dropdown component
const AccountDropdown: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="absolute right-0 top-full mt-2 w-48 bg-[#071139] rounded-lg shadow-xl border border-gray-700 overflow-hidden z-50">
      <Link 
        href="/researcher/profile" 
        className="flex items-center gap-3 p-4 hover:bg-[#0a1a4a] transition-colors"
        onClick={onClose}
      >
        <UserCircle size={20} className="text-white" />
        <span className="text-white" style={{ fontFamily: 'Metropolis, sans-serif' }}>Profile</span>
      </Link>
      <div className="h-px bg-gray-700" />
      <button 
        className="flex items-center gap-3 p-4 hover:bg-[#0a1a4a] transition-colors w-full text-left"
        onClick={() => {
          onClose();
          // Add logout logic here
          window.location.href = '/login';
        }}
      >
        <LogOut size={20} style={{ color: '#FF3B3B' }} />
        <span style={{ color: '#FF3B3B', fontFamily: 'Metropolis, sans-serif' }}>Logout</span>
      </button>
    </div>
  );
};

// Interface for the component's props
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
  
  // Function to check if a link is active
  const isLinkActive = (href: string) => {
    // Special handling for submission pages - match entire /submissions path
    if (href.includes('/submissions')) {
      return pathname?.startsWith('/researchermodule/submissions');
    }
    // Exact match for other links
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
      return isScrolled ? 'bg-[#071139]' : 'bg-transparent';
    }
    return 'bg-[#071139]';
  };
  
  return (
    <>
      <nav className={`${getBackgroundClass()} p-4 flex justify-between items-center shadow-lg fixed top-0 left-0 right-0 z-50 transition-all duration-300`}>
        {/* Mobile Burger Button and Logo */}
        <div className="flex items-center gap-4">
          {/* Mobile Burger Menu Button - Only show for researcher/reviewer */}
          {!isMainRole && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white p-2"
              aria-label="Toggle menu"
            >
              <Menu size={24} />
            </button>
          )}

          <div className="text-white text-xl font-extrabold">
            <a href="">
              <Image 
                src="/img/logonavbar.png" 
                alt="Logo" 
                width={350} 
                height={350} 
              />
            </a>
          </div>
        </div>

        {/* Desktop Navigation */}
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
              <div className="h-6 w-px bg-gray-600" />
              <div className="flex space-x-2 relative">
                {/* Notification Bell */}
                <button
                  onClick={() => {
                    setNotificationOpen(!notificationOpen);
                    setAccountOpen(false);
                  }}
                  className="text-white hover:text-gray-300 p-2 transition duration-150 relative"
                  aria-label="Notifications"
                >
                  <Bell size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#F0E847] rounded-full"></span>
                </button>
                
                <NotificationDropdown isOpen={notificationOpen} />
                
                {/* Account Icon */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setAccountOpen(!accountOpen);
                      setNotificationOpen(false);
                    }}
                    className="text-white hover:text-gray-300 p-2 transition duration-150"
                    aria-label="Account"
                  >
                    <User size={20} />
                  </button>
                  
                  <AccountDropdown isOpen={accountOpen} onClose={() => setAccountOpen(false)} />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Mobile Icons - Always visible for researcher/reviewer */}
        {!isMainRole && (
          <div className="md:hidden flex items-center space-x-2">
            {iconLinks.length > 0 && (
              <>
                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setNotificationOpen(!notificationOpen);
                      setAccountOpen(false);
                    }}
                    className="text-white hover:text-gray-300 p-2 transition duration-150 relative"
                    aria-label="Notifications"
                  >
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-[#F0E847] rounded-full"></span>
                  </button>
                  
                  <NotificationDropdown isOpen={notificationOpen} />
                </div>
                
                {/* Account Icon */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setAccountOpen(!accountOpen);
                      setNotificationOpen(false);
                    }}
                    className="text-white hover:text-gray-300 p-2 transition duration-150"
                    aria-label="Account"
                  >
                    <User size={20} />
                  </button>
                  
                  <AccountDropdown isOpen={accountOpen} onClose={() => setAccountOpen(false)} />
                </div>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Mobile Sidebar Drawer - NO OVERLAY, only for researcher/reviewer */}
      {!isMainRole && (
        <div 
          className={`md:hidden fixed left-0 top-0 bottom-0 w-80 bg-[#071139] shadow-xl z-40 overflow-y-auto transition-transform duration-300 ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Header with close button */}
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <Image 
              src="/img/logonavbar.png" 
              alt="Logo" 
              width={200} 
              height={50} 
            />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-white p-2"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col pt-13 px-7 space-y-11">
            {mainLinks.map((link) => (
              <div key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-xl transition-colors block ${
                    isLinkActive(link.href) ? 'text-[#F0E847]' : 'text-white hover:text-gray-300'
                  }`}
                  style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 500 }}
                >
                  {link.text}
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
