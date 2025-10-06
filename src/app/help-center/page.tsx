// app/help-center/page.tsx
'use client';

import HelpCenterLayout from '@/components/helpcenter/HelpCenterLayout';
import NavbarRoles from '@/components/NavbarRoles';

export default function HelpCenterPage() {
  return (
    <div className="flex flex-col h-screen">
      <NavbarRoles role="researcher" />
      <div className="flex-1 overflow-hidden">
        <HelpCenterLayout />
      </div>
    </div>
  );
}
