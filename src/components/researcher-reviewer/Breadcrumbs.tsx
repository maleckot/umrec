// components/Breadcrumbs.tsx
'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="flex items-center space-x-2 mb-4" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <ChevronRight size={16} className="text-gray-500 mx-2" />
          )}
          {item.href ? (
            <Link
              href={item.href}
              className="text-sm md:text-base text-gray-600 hover:text-[#101C50] transition-colors cursor-pointer"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              {item.label}
            </Link>
          ) : (
            <span
              className="text-sm md:text-base text-[#101C50] font-semibold"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
