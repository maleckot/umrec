// components/NavbarRoles.tsx
'use client';


import Link from 'next/link';
import { Bell, User } from 'lucide-react';
import Image from 'next/image';
import { marcellus, metropolis } from '@/app/fonts';
import { useEffect, useState } from 'react';




// 1. Define the Data for Each Navbar Variation (Interfaces and Data)




// Interface for a single text link object
interface NavLinkProps {
  href: string;
  text: string;
  icon?: 'user' | 'bell';
}




// Interface for icon-based links
interface IconLinkProps {
  href: string;
  icon: 'bell' | 'user';
  ariaLabel: string;
}




// Data structures for different user roles
const NAV_LINKS = {
// Main/Guest User
    main: {
    mainLinks: [
        { href: '/login', text: 'Login', icon: 'user' },
    ] as NavLinkProps[],
    iconLinks: [] as IconLinkProps[],
    },




  // Researcher Role
  researcher: {
    mainLinks: [
      { href: '/researcher/dashboard', text: 'Dashboard' },
      { href: '/researcher/submission', text: 'Submission' },
      { href: '/researcher/help', text: 'Help Center' },
    ] as NavLinkProps[],
    iconLinks: [
      { href: '/researcher/notifications', icon: 'bell', ariaLabel: 'Notifications' },
      { href: '/researcher/account', icon: 'user', ariaLabel: 'Account' },
    ] as IconLinkProps[],
  },




  // Reviewer Role
  reviewer: {
    mainLinks: [
      { href: '/reviewer/dashboard', text: 'Dashboard' },
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
const NavButton: React.FC<NavLinkProps> = ({ href, text, icon }) => {
  const IconComponent = icon === 'bell' ? Bell : icon === 'user' ? User : null;
  
  return (
    <Link href={href} className="text-white hover:text-gray-300 px-3 py-2 transition duration-150 flex items-center gap-2" style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 500 }}>
      {IconComponent && <IconComponent size={20} />}
      {text}
    </Link>
  );
};





// Helper component for rendering icon links
const IconNavButton: React.FC<IconLinkProps> = ({ href, icon, ariaLabel }) => {
  const IconComponent = icon === 'bell' ? Bell : User;
  
  return (
    <Link 
      href={href} 
      className="text-white hover:text-gray-300 p-2 transition duration-150"
      aria-label={ariaLabel}
    >
      <IconComponent size={20} />
    </Link>
  );
};




// 2. Create the Dynamic Navbar Component




// Interface for the component's props
interface NavbarProps {
  role: keyof typeof NAV_LINKS; // Ensures the 'role' prop can only be 'main', 'researcher', or 'reviewer'
}




/**
 * A dynamic Navbar component that changes button links based on the user role.
 * @param role - The current user role ('main', 'researcher', or 'reviewer').
 */
const NavbarRoles: React.FC<NavbarProps> = ({ role }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Select the correct set of links based on the passed 'role' prop
  const { mainLinks, iconLinks } = NAV_LINKS[role] || NAV_LINKS.main;
  
  // Check if it's the main/guest role
  const isMainRole = role === 'main';
  
  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Determine background color based on role and scroll position
  const getBackgroundClass = () => {
    if (isMainRole) {
      return isScrolled ? 'bg-[#071139]' : 'bg-transparent';
    }
    return 'bg-[#071139]';
  };
  
  return (
    <nav className={`${getBackgroundClass()} p-4 flex justify-between items-center shadow-lg fixed top-0 left-0 right-0 z-50 transition-all duration-300`}>
      {/* 1. Logo/Title (Constant) */}
      <div className="text-white text-xl font-extrabold">
        <a href="" target="_blank" rel="noopener noreferrer">
          <Image 
            src="/img/logonavbar.png" 
            alt="Logo" 
            width={350} 
            height={350} 
          />
        </a>
      </div>



      {/* 2. Navigation Links Container */}
      <div className="flex items-center space-x-6">
        {/* Main text-based navigation */}
        <div className="flex space-x-4">
          {mainLinks.map((link) => (
            <NavButton key={link.href} href={link.href} text={link.text} icon={link.icon} />
          ))}
        </div>
        
        {/* Icon-based navigation (separated with border if icons exist) */}
        {iconLinks.length > 0 && (
          <>
            <div className="h-6 w-px bg-gray-600" /> {/* Vertical separator */}
            <div className="flex space-x-2">
              {iconLinks.map((link) => (
                <IconNavButton key={link.href} {...link} />
              ))}
            </div>
          </>
        )}
      </div>
    </nav>
  );
};




export default NavbarRoles;
