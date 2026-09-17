'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { OlatoLogo } from '@/components/brand/OlatoLogo';
import {
  LayoutDashboard,
  Store,
  Tag,
  CheckCircle2,
  Sparkles,
  Users,
  Settings,
  ArrowLeft,
} from 'lucide-react';

export function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/admin', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { href: '/admin/places', label: 'Places', icon: <Store className="w-4 h-4" /> },
    { href: '/admin/discounts', label: 'Discounts', icon: <Tag className="w-4 h-4" /> },
    { href: '/admin/verification', label: 'Verification Queue', icon: <CheckCircle2 className="w-4 h-4" /> },
    { href: '/admin/featured', label: 'Featured Places', icon: <Sparkles className="w-4 h-4" /> },
    { href: '/admin/users', label: 'Users', icon: <Users className="w-4 h-4" /> },
    { href: '/admin/settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 bg-white border-r border-[#E7E7EC] min-h-screen flex flex-col justify-between p-6 shrink-0">
      <div className="space-y-8">
        {/* Brand */}
        <div>
          <OlatoLogo size="sm" showTagline />
          <span className="inline-block mt-2 px-2.5 py-0.5 rounded-md bg-[#EEF0FF] text-[#5B5CE2] text-[10px] font-bold uppercase tracking-wider">
            Admin Portal
          </span>
        </div>

        {/* Links */}
        <nav className="space-y-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? 'bg-[#5B5CE2] text-white shadow-sm'
                    : 'text-[#6F7078] hover:bg-[#F7F7FA] hover:text-[#15151A]'
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Return to Consumer UI */}
      <div className="pt-6 border-t border-[#E7E7EC]">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-bold text-[#6F7078] hover:text-[#5B5CE2] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Consumer App</span>
        </Link>
      </div>
    </aside>
  );
}
