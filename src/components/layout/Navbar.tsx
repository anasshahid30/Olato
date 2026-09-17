'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { OlatoLogo } from '@/components/brand/OlatoLogo';
import { LocationSelector } from './LocationSelector';
import { useSavedDeals } from '@/context/SavedDealsContext';
import { useAuth } from '@/context/AuthContext';
import { Search, Heart, User, Map, Shield, Menu, X, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenAIModal?: () => void;
}

export function Navbar({ onOpenAIModal }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { savedCount } = useSavedDeals();
  const { user, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { href: '/', label: 'Discover', icon: <Search className="w-4 h-4" /> },
    { href: '/search', label: 'Explore Deals', icon: <Search className="w-4 h-4" /> },
    { href: '/map', label: 'Map View', icon: <Map className="w-4 h-4" /> },
    { href: '/saved', label: 'Saved', badge: savedCount, icon: <Heart className="w-4 h-4" /> },
  ];

  const isAdminArea = pathname.startsWith('/admin');

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#E7E7EC]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-6 shrink-0">
          <OlatoLogo size="md" />

          {isAdmin && (
            <Link
              href="/admin"
              className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                isAdminArea
                  ? 'bg-[#5B5CE2] text-white border-[#5B5CE2]'
                  : 'bg-[#EEF0FF] text-[#5B5CE2] border-[#5B5CE2]/30 hover:bg-[#5B5CE2] hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Dashboard</span>
            </Link>
          )}
        </div>

        {/* Center: Search Input Bar (Desktop) */}
        {!isAdminArea && (
          <form
            onSubmit={handleQuickSearch}
            className="hidden lg:flex items-center flex-1 max-w-md relative"
          >
            <div className="relative w-full flex items-center bg-[#F7F7FA] border border-[#E7E7EC] rounded-2xl focus-within:bg-white focus-within:border-[#5B5CE2] focus-within:ring-4 focus-within:ring-[#5B5CE2]/10 transition-all">
              <Search className="w-4 h-4 text-[#6F7078] ml-3.5 mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search places, brands or deals..."
                className="w-full py-2.5 pr-3 text-sm text-[#15151A] bg-transparent outline-none placeholder:text-[#6F7078]"
              />
              {onOpenAIModal && (
                <button
                  type="button"
                  onClick={onOpenAIModal}
                  title="AI Natural Discovery"
                  className="flex items-center gap-1 px-2.5 py-1 mr-1.5 text-xs font-semibold text-[#5B5CE2] bg-[#EEF0FF] hover:bg-[#5B5CE2] hover:text-white rounded-xl transition-all shrink-0"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>AI</span>
                </button>
              )}
            </div>
          </form>
        )}

        {/* Right Nav Controls */}
        <div className="hidden md:flex items-center gap-3">
          <LocationSelector />

          {/* Nav Links */}
          <nav className="flex items-center gap-1 border-l border-[#E7E7EC] pl-3">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? 'text-[#5B5CE2] bg-[#EEF0FF]'
                      : 'text-[#6F7078] hover:text-[#15151A] hover:bg-[#F7F7FA]'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge !== undefined && link.badge > 0 && (
                    <span className="flex items-center justify-center min-w-[18px] h-4 px-1 rounded-full bg-[#EF4444] text-white text-[10px] font-bold">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Account / Profile button */}
          <Link
            href={user ? '/profile' : '/auth/signin'}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-[#E7E7EC] bg-white hover:bg-[#F7F7FA] transition-all"
          >
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-[#EEF0FF] text-[#5B5CE2] flex items-center justify-center font-bold text-xs">
                <User className="w-4 h-4" />
              </div>
            )}
            <span className="text-xs font-bold text-[#15151A] max-w-[90px] truncate">
              {user ? user.name.split(' ')[0] : 'Sign In'}
            </span>
          </Link>
        </div>

        {/* Mobile Toggle Button */}
        <div className="flex md:hidden items-center gap-2">
          <LocationSelector />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#15151A] rounded-xl border border-[#E7E7EC] bg-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E7E7EC] bg-white px-4 py-4 space-y-3">
          <form onSubmit={handleQuickSearch} className="flex items-center bg-[#F7F7FA] rounded-xl px-3 py-2 border">
            <Search className="w-4 h-4 text-[#6F7078] mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search places or deals..."
              className="w-full text-sm bg-transparent outline-none"
            />
          </form>

          <div className="grid grid-cols-2 gap-2 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 p-3 rounded-xl text-sm font-semibold border ${
                  pathname === link.href ? 'bg-[#EEF0FF] text-[#5B5CE2] border-[#5B5CE2]/30' : 'bg-[#F7F7FA] border-[#E7E7EC]'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
                {link.badge !== undefined && link.badge > 0 && (
                  <span className="ml-auto bg-[#EF4444] text-white text-xs px-1.5 py-0.5 rounded-full">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-[#E7E7EC]">
            <Link
              href={user ? '/profile' : '/auth/signin'}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl bg-[#15151A] text-white font-semibold text-sm"
            >
              <span>{user ? `Account (${user.name})` : 'Sign In / Sign Up'}</span>
              <User className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
