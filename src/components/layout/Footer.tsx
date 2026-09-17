import React from 'react';
import Link from 'next/link';
import { OlatoLogo } from '@/components/brand/OlatoLogo';

export function Footer() {
  return (
    <footer className="bg-white border-t border-[#E7E7EC] mt-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <OlatoLogo size="md" showTagline />
            <p className="text-sm text-[#6F7078] leading-relaxed">
              Discover what's worth it around you. Verified discounts from local cafés, restaurants, and featured places.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#15151A] uppercase tracking-wider">Discovery</h4>
            <ul className="space-y-2 text-sm text-[#6F7078]">
              <li><Link href="/" className="hover:text-[#5B5CE2] transition-colors">Home / Discover</Link></li>
              <li><Link href="/search" className="hover:text-[#5B5CE2] transition-colors">Explore All Deals</Link></li>
              <li><Link href="/map" className="hover:text-[#5B5CE2] transition-colors">Interactive Discovery Map</Link></li>
              <li><Link href="/saved" className="hover:text-[#5B5CE2] transition-colors">Your Saved Deals</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#15151A] uppercase tracking-wider">Categories</h4>
            <ul className="space-y-2 text-sm text-[#6F7078]">
              <li><Link href="/search?cat=CAFE" className="hover:text-[#5B5CE2] transition-colors">Cafés & Specialty Coffee</Link></li>
              <li><Link href="/search?cat=RESTAURANT" className="hover:text-[#5B5CE2] transition-colors">Restaurants & Fine Dining</Link></li>
              <li><Link href="/search?cat=FEATURED_PLACE" className="hover:text-[#5B5CE2] transition-colors">Selected / Featured Places</Link></li>
            </ul>
          </div>

          {/* Business & Admin */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#15151A] uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 text-sm text-[#6F7078]">
              <li><Link href="/auth/signin" className="hover:text-[#5B5CE2] transition-colors">Member Sign In</Link></li>
              <li><Link href="/profile" className="hover:text-[#5B5CE2] transition-colors">User Account Settings</Link></li>
              <li><Link href="/admin" className="hover:text-[#5B5CE2] transition-colors font-semibold text-[#5B5CE2]">Merchant Admin Portal</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#E7E7EC] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6F7078]">
          <p>© 2026 OLATO Technologies. All rights reserved. Fictional prototype seed data.</p>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Verification Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
