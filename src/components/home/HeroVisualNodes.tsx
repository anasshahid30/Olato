'use client';

import React, { useEffect, useState } from 'react';
import { Coffee, UtensilsCrossed, Star, MapPin, ShieldCheck, Sparkles, Navigation, CreditCard, GraduationCap } from 'lucide-react';

export function HeroVisualNodes() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      setMousePos({
        x: (e.clientX - centerX) / 40,
        y: (e.clientY - centerY) / 40,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative w-full h-[380px] sm:h-[480px] flex items-center justify-center overflow-hidden select-none">
      {/* Dynamic Grid Background Layer */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60" />

      {/* Center Olato Discovery Core */}
      <div
        className="relative z-20 flex flex-col items-center justify-center p-6 rounded-3xl bg-[#12131A] border border-[#5B5CE2]/50 shadow-2xl shadow-[#5B5CE2]/20 transition-transform duration-200 ease-out"
        style={{
          transform: `translate3d(${mousePos.x * 0.8}px, ${mousePos.y * 0.8}px, 0)`,
        }}
      >
        <div className="p-4 rounded-2xl bg-[#5B5CE2] text-white shadow-lg shadow-[#5B5CE2]/40 mb-3 animate-pulse">
          <Navigation className="w-8 h-8" />
        </div>
        <div className="text-sm font-black text-white uppercase tracking-wider">OLATO DISCOVERY ENGINE</div>
        <div className="text-[11px] font-semibold text-[#10B981] flex items-center gap-1.5 mt-1">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
          Live Local Deal Radar Active
        </div>
      </div>

      {/* Floating Node 1: Café & Student (Top-Left) */}
      <div
        className="absolute top-6 left-4 sm:left-12 z-20 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E7E7EC] shadow-xl text-xs space-y-2 w-56 transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${-mousePos.x * 1.2}px, ${-mousePos.y * 1.2}px, 0)`,
        }}
      >
        <div className="flex items-center justify-between">
          <span className="font-bold flex items-center gap-1.5 text-[#15151A]">
            <Coffee className="w-4 h-4 text-[#5B5CE2]" />
            Artisan Roasters
          </span>
          <span className="text-[10px] bg-[#EEF0FF] text-[#5B5CE2] px-2 py-0.5 rounded-full font-bold">
            0.4 km
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-extrabold text-[11px] border border-emerald-200 flex items-center gap-1">
            <GraduationCap className="w-3 h-3" />
            30% OFF
          </span>
          <span className="text-[11px] text-[#6F7078] font-medium">Student Verified</span>
        </div>
        <div className="text-[10px] text-[#9A9BA4] flex items-center gap-1">
          <MapPin className="w-3 h-3 text-[#5B5CE2]" />
          Gulberg III • Open Now
        </div>
      </div>

      {/* Floating Node 2: Restaurant & Bank Deal (Top-Right) */}
      <div
        className="absolute top-10 right-4 sm:right-12 z-20 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E7E7EC] shadow-xl text-xs space-y-2 w-64 transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${mousePos.x * 1.5}px, ${-mousePos.y * 1.5}px, 0)`,
        }}
      >
        <div className="flex items-center justify-between">
          <span className="font-bold flex items-center gap-1.5 text-[#15151A]">
            <UtensilsCrossed className="w-4 h-4 text-[#5B5CE2]" />
            Bistro Gourmet
          </span>
          <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-bold border border-amber-200">
            Valid Tonight
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded bg-[#EEF0FF] text-[#5B5CE2] font-extrabold text-[11px] border border-[#5B5CE2]/30 flex items-center gap-1">
            <CreditCard className="w-3 h-3" />
            BOGO Special
          </span>
          <span className="text-[11px] text-[#6F7078] font-medium">Visa &amp; Mastercard</span>
        </div>
        <div className="text-[10px] text-[#9A9BA4]">MM Alam Road • 4.8 ★ (180+ reviews)</div>
      </div>

      {/* Floating Node 3: Live Geo-Radar (Bottom-Left) */}
      <div
        className="absolute bottom-8 left-6 sm:left-20 z-20 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E7E7EC] shadow-xl text-xs space-y-2 w-56 transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${-mousePos.x * 1.8}px, ${mousePos.y * 1.8}px, 0)`,
        }}
      >
        <div className="flex items-center justify-between">
          <span className="font-bold flex items-center gap-1.5 text-[#15151A]">
            <Sparkles className="w-4 h-4 text-[#10B981]" />
            Nearby Radar
          </span>
          <span className="text-[10px] font-bold text-[#10B981] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            18 Active
          </span>
        </div>
        <div className="h-1.5 bg-[#E7E7EC] rounded-full overflow-hidden">
          <div className="w-3/4 h-full bg-[#10B981]" />
        </div>
        <div className="text-[10px] text-[#6F7078]">Within 1.5 km of your location</div>
      </div>

      {/* Floating Node 4: Trust & Verification (Bottom-Right) */}
      <div
        className="absolute bottom-12 right-6 sm:right-24 z-20 p-3.5 rounded-2xl bg-[#12131A] text-white backdrop-blur-md border border-[#262738] shadow-xl text-xs flex items-center gap-3 transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${mousePos.x * 1.4}px, ${mousePos.y * 1.4}px, 0)`,
        }}
      >
        <div className="p-2.5 bg-[#10B981]/20 text-[#10B981] rounded-xl shrink-0">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div>
          <div className="font-extrabold text-xs text-white">98% Verified</div>
          <div className="text-[10px] text-[#8E90A0]">Updated 2 hours ago</div>
        </div>
      </div>

      {/* SVG Connected Neural Data Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 stroke-[#5B5CE2]/25" strokeWidth="1.5">
        <line x1="20%" y1="25%" x2="50%" y2="50%" strokeDasharray="4 4" />
        <line x1="80%" y1="25%" x2="50%" y2="50%" strokeDasharray="4 4" />
        <line x1="25%" y1="80%" x2="50%" y2="50%" strokeDasharray="4 4" />
        <line x1="75%" y1="80%" x2="50%" y2="50%" strokeDasharray="4 4" />
      </svg>
    </div>
  );
}
