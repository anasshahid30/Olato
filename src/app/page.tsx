'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AIPromptInterface } from '@/components/ai/AIPromptInterface';
import { HeroVisualNodes } from '@/components/home/HeroVisualNodes';
import { DiscountCard } from '@/components/ui/DiscountCard';
import { GlowingCard } from '@/components/ui/GlowingCard';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { InteractiveMap } from '@/components/map/InteractiveMap';
import { repository } from '@/lib/repository';
import { Discount, CategoryType } from '@/lib/types';
import { useLocation } from '@/context/LocationContext';
import { useSavedDeals } from '@/context/SavedDealsContext';
import { formatDistance, formatDateFriendly } from '@/lib/distance';
import {
  Coffee,
  UtensilsCrossed,
  Star,
  Sparkles,
  ArrowRight,
  MapPin,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  Clock,
  Search,
  ExternalLink,
  Heart,
  TrendingUp,
} from 'lucide-react';

export default function OlatoHomePage() {
  const { activeHub, userCoords } = useLocation();
  const { savedIds, isSaved } = useSavedDeals();

  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [activeCategory, setActiveCategory] = useState<CategoryType | 'ALL'>('ALL');
  const [selectedMapDiscountId, setSelectedMapDiscountId] = useState<string>('disc-1');
  const [featuredDiscounts, setFeaturedDiscounts] = useState<Discount[]>([]);

  // Load live discounts relative to user/hub coordinates
  useEffect(() => {
    const loadDiscounts = () => {
      const all = repository.getDiscounts({}, userCoords.latitude, userCoords.longitude);
      setDiscounts(all);
      // Featured deals with high confidence
      setFeaturedDiscounts(all.filter((d) => d.confidence >= 90).slice(0, 3));
    };

    loadDiscounts();
    const unsubscribe = repository.subscribe(loadDiscounts);
    return () => unsubscribe();
  }, [userCoords]);

  const nearbyDiscounts = discounts.filter((d) => {
    if (activeCategory === 'ALL') return true;
    return d.category === activeCategory;
  });

  const selectedMapDiscount = discounts.find((d) => d.id === selectedMapDiscountId) || discounts[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#15151A]">
      <Navbar />

      <main className="flex-1 w-full overflow-hidden">
        {/* ============================================================== */}
        {/* 01 — HERO SECTION */}
        {/* ============================================================== */}
        <section className="relative pt-10 sm:pt-16 pb-20 overflow-hidden">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-[#5B5CE2]/10 blur-[130px] rounded-full pointer-events-none" />

          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 relative z-10 space-y-10">
            <div className="text-center max-w-4xl mx-auto space-y-6">
              {/* Product Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E7E7EC] text-xs font-black uppercase tracking-widest text-[#5B5CE2] shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
                <span>LOCAL DISCOUNT DISCOVERY PLATFORM</span>
              </div>

              {/* Core Hero Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#15151A] leading-[1.08]">
                What's worth discovering <span className="animate-shimmer">near you?</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-[#6F7078] max-w-2xl mx-auto leading-relaxed font-normal">
                Discover verified discounts from nearby cafés, restaurants, and selected places. Intelligent search tailored to your location, bank cards, and student perks.
              </p>

              {/* Intelligent AI Prompt Receiver */}
              <div className="pt-2">
                <AIPromptInterface theme="dark" autoFocus />
              </div>

              {/* Real-time Proximity Indicators */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs font-semibold text-[#6F7078]">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E7E7EC] shadow-xs">
                  <MapPin className="w-3.5 h-3.5 text-[#5B5CE2]" />
                  <span>Browsing near: <strong className="text-[#15151A] font-bold">{activeHub.name}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E7E7EC] shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>100% Manually Verified</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E7E7EC] shadow-xs">
                  <TrendingUp className="w-3.5 h-3.5 text-[#5B5CE2]" />
                  <span>{discounts.length} Active Deals Available</span>
                </div>
              </div>
            </div>

            {/* Interactive Hero Visual System with physics-driven mouse nodes */}
            <div className="pt-4">
              <HeroVisualNodes />
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 02 — DISCOVER NEAR YOU */}
        {/* ============================================================== */}
        <section className="py-20 bg-white border-y border-[#E7E7EC]" id="discover">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-[#5B5CE2] uppercase tracking-wider block mb-1">
                  Real-time Proximity
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-[#15151A] tracking-tight">
                  Discounts near you
                </h2>
                <p className="text-sm text-[#6F7078] mt-1">
                  Hand-checked discounts within easy walking or driving distance of {activeHub.name}.
                </p>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex items-center gap-2 p-1.5 bg-[#FAF9F6] border border-[#E7E7EC] rounded-2xl shrink-0 overflow-x-auto no-scrollbar">
                {[
                  { id: 'ALL', label: 'All Places' },
                  { id: 'CAFE', label: 'Cafés', icon: <Coffee className="w-3.5 h-3.5" /> },
                  { id: 'RESTAURANT', label: 'Restaurants', icon: <UtensilsCrossed className="w-3.5 h-3.5" /> },
                  { id: 'FEATURED_PLACE', label: 'Selected Places', icon: <Star className="w-3.5 h-3.5" /> },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategory(tab.id as any)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      activeCategory === tab.id
                        ? 'bg-[#5B5CE2] text-white shadow-xs'
                        : 'text-[#6F7078] hover:text-[#15151A] hover:bg-white'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Grid Showcase of Live Deals */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {nearbyDiscounts.slice(0, 8).map((deal) => (
                <DiscountCard key={deal.id} discount={deal} />
              ))}
            </div>

            {/* Bottom View All Action */}
            <div className="flex justify-center pt-6">
              <Link href="/search">
                <MagneticButton
                  variant="outline"
                  size="md"
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Explore all {discounts.length} discounts
                </MagneticButton>
              </Link>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 03 — EXPLORE CATEGORIES (STRICTLY: CAFÉ, RESTAURANT, SELECTED PLACES) */}
        {/* ============================================================== */}
        <section className="py-24 max-w-[1440px] mx-auto px-4 sm:px-8 space-y-12" id="categories">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-[#5B5CE2] uppercase tracking-wider">
              Focused Discovery
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#15151A] tracking-tight">
              Curated Local Categories
            </h2>
            <p className="text-sm text-[#6F7078]">
              Olato stays focused strictly on places where authentic local discounts matter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category 1: CAFÉ */}
            <Link href="/search?cat=CAFE" className="group">
              <GlowingCard className="h-full p-8 flex flex-col justify-between hover:border-[#5B5CE2]/50 transition-all">
                <div className="space-y-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#EEF0FF] text-[#5B5CE2] flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                    <Coffee className="w-7 h-7" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-black text-[#15151A] tracking-tight">CAFÉS</h3>
                      <span className="text-xs font-extrabold text-[#5B5CE2] bg-[#EEF0FF] px-2.5 py-1 rounded-full">
                        {discounts.filter((d) => d.category === 'CAFE').length} Deals
                      </span>
                    </div>
                    <p className="text-sm text-[#6F7078] leading-relaxed">
                      Specialty coffee roasters, artisanal bakeries, quiet workspaces, and morning espresso rituals with student and banking privileges.
                    </p>
                  </div>
                </div>

                <div className="pt-8 flex items-center gap-2 text-xs font-bold text-[#5B5CE2] group-hover:translate-x-1 transition-transform">
                  <span>Explore Café Deals</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </GlowingCard>
            </Link>

            {/* Category 2: RESTAURANT */}
            <Link href="/search?cat=RESTAURANT" className="group">
              <GlowingCard className="h-full p-8 flex flex-col justify-between hover:border-[#5B5CE2]/50 transition-all">
                <div className="space-y-6">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                    <UtensilsCrossed className="w-7 h-7" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-black text-[#15151A] tracking-tight">RESTAURANTS</h3>
                      <span className="text-xs font-extrabold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                        {discounts.filter((d) => d.category === 'RESTAURANT').length} Deals
                      </span>
                    </div>
                    <p className="text-sm text-[#6F7078] leading-relaxed">
                      Casual bistros, high-end culinary kitchens, family dining, and evening feasts offering BOGO and credit card partnership savings.
                    </p>
                  </div>
                </div>

                <div className="pt-8 flex items-center gap-2 text-xs font-bold text-[#5B5CE2] group-hover:translate-x-1 transition-transform">
                  <span>Explore Restaurant Deals</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </GlowingCard>
            </Link>

            {/* Category 3: SELECTED / FEATURED PLACES */}
            <Link href="/search?cat=FEATURED_PLACE" className="group">
              <GlowingCard className="h-full p-8 flex flex-col justify-between hover:border-[#5B5CE2]/50 transition-all">
                <div className="space-y-6">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                    <Star className="w-7 h-7" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-black text-[#15151A] tracking-tight">SELECTED PLACES</h3>
                      <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                        {discounts.filter((d) => d.category === 'FEATURED_PLACE').length} Deals
                      </span>
                    </div>
                    <p className="text-sm text-[#6F7078] leading-relaxed">
                      Handpicked landmark spots, rooftop venues, boutique dessert salons, and signature dining locations chosen for exceptional quality.
                    </p>
                  </div>
                </div>

                <div className="pt-8 flex items-center gap-2 text-xs font-bold text-[#5B5CE2] group-hover:translate-x-1 transition-transform">
                  <span>Explore Selected Places</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </GlowingCard>
            </Link>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 04 — FEATURED DISCOUNTS */}
        {/* ============================================================== */}
        <section className="py-20 bg-[#12131A] text-white relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#5B5CE2]/15 blur-[140px] rounded-full pointer-events-none" />

          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 relative z-10 space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-[#10B981] uppercase tracking-wider block mb-1">
                  High Confidence &amp; Maximum Savings
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  Featured Active Discounts
                </h2>
              </div>
              <Link href="/search?verifiedOnly=true">
                <span className="text-xs font-bold text-[#8B8CFE] hover:text-white flex items-center gap-1">
                  View all verified highlights →
                </span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredDiscounts.map((deal) => (
                <div
                  key={deal.id}
                  className="rounded-3xl bg-[#181924] border border-[#262738] p-6 flex flex-col justify-between hover:border-[#5B5CE2]/50 transition-all duration-300 space-y-6 group"
                >
                  <div className="space-y-4">
                    <div className="relative h-48 rounded-2xl overflow-hidden">
                      <img
                        src={deal.image}
                        alt={deal.placeName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-[#5B5CE2] text-white px-3 py-1 rounded-xl text-xs font-extrabold shadow-md">
                        {deal.discountDetails}
                      </div>
                      <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg">
                        {deal.bankCard || (deal.studentEligible ? 'Student Special' : 'Special Offer')}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-[#8E90A0]">
                        <span className="uppercase font-bold text-[#8B8CFE]">
                          {deal.category === 'CAFE' ? 'Café' : deal.category === 'RESTAURANT' ? 'Restaurant' : 'Selected Place'}
                        </span>
                        <span>Valid until {formatDateFriendly(deal.endDate)}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white group-hover:text-[#8B8CFE] transition-colors">
                        {deal.placeName}
                      </h3>
                      <p className="text-xs text-[#8E90A0] line-clamp-2">
                        {deal.offerTitle} — {deal.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#262738] flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-[#10B981] font-semibold">
                      <ShieldCheck className="w-4 h-4" />
                      <span>{deal.confidence}% Conf.</span>
                    </div>

                    <Link href={`/discounts/${deal.id}`}>
                      <MagneticButton variant="primary" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                        View deal
                      </MagneticButton>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 05 — HOW OLATO WORKS */}
        {/* ============================================================== */}
        <section className="py-24 max-w-[1440px] mx-auto px-4 sm:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-[#5B5CE2] uppercase tracking-wider">
              Transparent &amp; Reliable
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#15151A] tracking-tight">
              How Olato Works
            </h2>
            <p className="text-sm text-[#6F7078]">
              No expired coupon codes or dead ends. A seamless four-step flow built for real life.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'DISCOVER',
                desc: 'Find places and discounts around you based on your exact location and preferred area.',
                icon: <Search className="w-6 h-6 text-[#5B5CE2]" />,
              },
              {
                step: '02',
                title: 'CHECK',
                desc: 'See exactly how the discount works, what card is required, and who is eligible to use it.',
                icon: <CreditCard className="w-6 h-6 text-[#10B981]" />,
              },
              {
                step: '03',
                title: 'VERIFY',
                desc: 'Check the latest manual verification date and confidence score before heading out.',
                icon: <ShieldCheck className="w-6 h-6 text-[#5B5CE2]" />,
              },
              {
                step: '04',
                title: 'SAVE / USE',
                desc: 'Save the deal to your pocket or get instant driving/walking directions directly to the venue.',
                icon: <ArrowRight className="w-6 h-6 text-[#10B981]" />,
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-white border border-[#E7E7EC] space-y-4 hover:border-[#5B5CE2]/40 transition-all shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-[#E7E7EC] font-mono">{item.step}</span>
                  <div className="p-3 rounded-2xl bg-[#FAF9F6] border border-[#E7E7EC]">
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-lg font-black text-[#15151A] tracking-tight">{item.title}</h3>
                <p className="text-xs text-[#6F7078] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================== */}
        {/* 06 — MAP / NEARBY EXPERIENCE */}
        {/* ============================================================== */}
        <section className="py-20 bg-white border-y border-[#E7E7EC]" id="map">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-[#5B5CE2] uppercase tracking-wider block mb-1">
                  Location Intelligence
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-[#15151A] tracking-tight">
                  Map &amp; Nearby Places
                </h2>
                <p className="text-sm text-[#6F7078] mt-1">
                  Pins show active verified discounts. Click any pin to inspect the venue and deal details.
                </p>
              </div>
              <Link href="/map">
                <MagneticButton variant="outline" size="sm" icon={<ExternalLink className="w-3.5 h-3.5" />}>
                  Full Screen Map
                </MagneticButton>
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              {/* Left 2 Cols: Interactive Map */}
              <div className="lg:col-span-2 rounded-3xl overflow-hidden border border-[#E7E7EC] shadow-md min-h-[460px]">
                <InteractiveMap
                  discounts={discounts}
                  selectedDiscountId={selectedMapDiscountId}
                  onSelectDiscount={(id) => setSelectedMapDiscountId(id)}
                  centerLat={userCoords.latitude}
                  centerLng={userCoords.longitude}
                  className="h-[460px] w-full"
                />
              </div>

              {/* Right Col: Selected Location Preview Card */}
              <div className="rounded-3xl bg-[#FAF9F6] border border-[#E7E7EC] p-6 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#5B5CE2] uppercase tracking-wider">
                      Selected Venue
                    </span>
                    <span className="text-xs text-[#6F7078] flex items-center gap-1 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-[#5B5CE2]" />
                      {selectedMapDiscount?.distance !== undefined
                        ? formatDistance(selectedMapDiscount.distance)
                        : 'Nearby'}
                    </span>
                  </div>

                  {selectedMapDiscount && (
                    <>
                      <div className="relative h-44 rounded-2xl overflow-hidden">
                        <img
                          src={selectedMapDiscount.image}
                          alt={selectedMapDiscount.placeName}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3 bg-[#5B5CE2] text-white px-3 py-1 rounded-xl text-xs font-bold">
                          {selectedMapDiscount.discountDetails}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <h3 className="text-xl font-bold text-[#15151A]">
                          {selectedMapDiscount.placeName}
                        </h3>
                        <p className="text-sm font-semibold text-[#5B5CE2]">
                          {selectedMapDiscount.offerTitle}
                        </p>
                        <p className="text-xs text-[#6F7078] line-clamp-2">
                          {selectedMapDiscount.description}
                        </p>
                      </div>

                      <div className="p-3 bg-white border border-[#E7E7EC] rounded-xl flex items-center justify-between text-xs">
                        <span className="text-[#6F7078]">Card / Terms:</span>
                        <span className="font-bold text-[#15151A]">
                          {selectedMapDiscount.bankCard || (selectedMapDiscount.studentEligible ? 'Student ID' : 'Open')}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {selectedMapDiscount && (
                  <div className="pt-4 border-t border-[#E7E7EC] flex items-center gap-3">
                    <Link href={`/discounts/${selectedMapDiscount.id}`} className="flex-1">
                      <MagneticButton variant="primary" size="sm" className="w-full">
                        View deal →
                      </MagneticButton>
                    </Link>

                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${selectedMapDiscount.latitude},${selectedMapDiscount.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-3 bg-white border border-[#E7E7EC] hover:bg-[#F4F3F0] rounded-2xl text-xs font-bold text-[#15151A] transition-colors"
                    >
                      Directions
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 07 — SMART DISCOVERY (AI UNDERSTANDING VISUALIZATION) */}
        {/* ============================================================== */}
        <section className="py-24 max-w-[1440px] mx-auto px-4 sm:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-[#5B5CE2] uppercase tracking-wider">
              Intelligent Local Search
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#15151A] tracking-tight">
              Smart Discovery, No Jargon
            </h2>
            <p className="text-sm text-[#6F7078]">
              Speak naturally. Olato maps your prompt directly to validated place categories, discounts, and real-time proximity.
            </p>
          </div>

          <div className="max-w-4xl mx-auto p-8 rounded-3xl bg-white border border-[#E7E7EC] shadow-lg space-y-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Step 1: User Prompt */}
              <div className="flex-1 p-5 rounded-2xl bg-[#FAF9F6] border border-[#E7E7EC] space-y-2 w-full">
                <span className="text-[11px] font-bold text-[#6F7078] uppercase tracking-wider block">
                  You Ask Naturally:
                </span>
                <p className="text-base font-bold text-[#15151A]">
                  "Find me a quiet café nearby with a student discount."
                </p>
              </div>

              {/* Conversion Arrow */}
              <div className="p-3 bg-[#EEF0FF] text-[#5B5CE2] rounded-2xl shrink-0">
                <ArrowRight className="w-5 h-5 rotate-90 md:rotate-0" />
              </div>

              {/* Step 2: Olato Interprets */}
              <div className="flex-1 p-5 rounded-2xl bg-[#12131A] text-white border border-[#262738] space-y-3 w-full">
                <span className="text-[11px] font-bold text-[#10B981] uppercase tracking-wider block">
                  Olato Interprets:
                </span>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-[#181924] border border-[#262738] text-center">
                    <span className="text-[#8E90A0] text-[10px] block">Category</span>
                    <strong className="text-white font-bold">Café</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-[#181924] border border-[#262738] text-center">
                    <span className="text-[#8E90A0] text-[10px] block">Eligibility</span>
                    <strong className="text-[#10B981] font-bold">Student</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-[#181924] border border-[#262738] text-center">
                    <span className="text-[#8E90A0] text-[10px] block">Radius</span>
                    <strong className="text-white font-bold">&lt; 1.5 km</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Instant Verified Results */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-[#15151A]">Results Appear Instantly</h4>
                  <p className="text-xs text-[#6F7078]">
                    Filtered without complex checkboxes, endless pagination, or expired coupons.
                  </p>
                </div>
              </div>
              <Link href="/search?cat=CAFE&studentOnly=true">
                <MagneticButton variant="secondary" size="sm">
                  Try this search →
                </MagneticButton>
              </Link>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 08 — SAVED DEALS PREVIEW */}
        {/* ============================================================== */}
        <section className="py-20 bg-white border-y border-[#E7E7EC]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-[#5B5CE2] uppercase tracking-wider block mb-1">
                  Personal Pocket
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-[#15151A] tracking-tight">
                  Save Useful Deals for Later
                </h2>
                <p className="text-sm text-[#6F7078] mt-1">
                  Keep your favorite deals on hand. Quick one-tap bookmarking on any card.
                </p>
              </div>
              <Link href="/saved">
                <MagneticButton variant="outline" size="sm" icon={<Heart className="w-3.5 h-3.5 text-[#EF4444]" />}>
                  View saved deals ({savedIds.length})
                </MagneticButton>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {discounts
                .filter((d) => isSaved(d.id))
                .slice(0, 3)
                .map((deal) => (
                  <DiscountCard key={deal.id} discount={deal} />
                ))}
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 09 — TRUST / VERIFICATION TRACKING */}
        {/* ============================================================== */}
        <section className="py-24 max-w-[1440px] mx-auto px-4 sm:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-[#10B981] uppercase tracking-wider">
              Verification Standards
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#15151A] tracking-tight">
              Verified Deals You Can Actually Use
            </h2>
            <p className="text-sm text-[#6F7078]">
              Most discount sites contain dead codes and expired promotions. Olato verifies discount data manually with venues.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-3xl bg-white border border-[#E7E7EC] space-y-4 shadow-xs">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl w-fit">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#15151A]">Last Verified Timestamps</h3>
              <p className="text-xs text-[#6F7078] leading-relaxed">
                Every deal displays the date and hour it was confirmed directly with the merchant's staff or active menu.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#E7E7EC] space-y-4 shadow-xs">
              <div className="p-3 bg-[#EEF0FF] text-[#5B5CE2] rounded-2xl w-fit">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#15151A]">Confidence Rating</h3>
              <p className="text-xs text-[#6F7078] leading-relaxed">
                Deals carry a transparency confidence score (e.g. 95%), computed from validation recency and user redemption feedback.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#E7E7EC] space-y-4 shadow-xs">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl w-fit">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#15151A]">Clear Terms &amp; Restrictions</h3>
              <p className="text-xs text-[#6F7078] leading-relaxed">
                Eligible card types (Visa, Mastercard, Alfalah, Standard Chartered) and dine-in restrictions are stated upfront.
              </p>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 10 — FINAL DISCOVERY CTA */}
        {/* ============================================================== */}
        <section className="py-24 bg-[#12131A] text-white relative overflow-hidden">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-[#5B5CE2]/15 blur-[160px] rounded-full pointer-events-none" />

          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 relative z-10 text-center space-y-8">
            <div className="max-w-2xl mx-auto space-y-4">
              <span className="text-xs font-bold text-[#10B981] uppercase tracking-wider">
                Ready to head out?
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                Find your next deal.
              </h2>
              <p className="text-sm text-[#8E90A0] leading-relaxed">
                Tell Olato what you're looking for, or browse verified discounts across top local venues.
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <AIPromptInterface theme="dark" />
            </div>

            <div className="pt-4 flex items-center justify-center gap-4">
              <Link href="/search">
                <MagneticButton variant="primary" size="md" icon={<ArrowRight className="w-4 h-4" />}>
                  Browse all places
                </MagneticButton>
              </Link>
              <Link href="/map">
                <MagneticButton variant="outlineDark" size="md" icon={<MapPin className="w-4 h-4" />}>
                  Explore map
                </MagneticButton>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
