'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SearchBar } from '@/components/ui/SearchBar';
import { CategorySelector } from '@/components/ui/CategorySelector';
import { DiscountCard } from '@/components/ui/DiscountCard';
import { Button } from '@/components/ui/Button';
import { AIDiscoveryModal } from '@/components/ai/AIDiscoveryModal';
import { repository } from '@/lib/repository';
import { useLocation } from '@/context/LocationContext';
import { CategoryType, Discount, Place } from '@/lib/types';
import { Sparkles, MapPin, ArrowRight, ShieldCheck, Flame, Compass, Coffee, UtensilsCrossed } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { activeHub, userCoords } = useLocation();

  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'ALL'>('ALL');
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [featuredPlaces, setFeaturedPlaces] = useState<Place[]>([]);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  useEffect(() => {
    // Fetch live discounts from repository with user coordinates
    const list = repository.getDiscounts(
      { category: selectedCategory, validToday: true, sortBy: 'relevant' },
      userCoords.latitude,
      userCoords.longitude
    );
    setDiscounts(list);

    // Fetch featured places
    const featured = repository.getPlaces('ALL', true);
    setFeaturedPlaces(featured);
  }, [selectedCategory, userCoords]);

  const handleSearchSubmit = (query: string) => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7FA]">
      <Navbar onOpenAIModal={() => setIsAIModalOpen(true)} />

      <main className="flex-1 max-w-[1440px] mx-auto px-4 sm:px-8 py-8 w-full">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#15151A] via-[#1E1E26] to-[#2B2B38] text-white p-8 sm:p-12 lg:p-16 mb-12 shadow-xl">
          {/* Subtle brand glow overlay */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#5B5CE2]/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#19B87A]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            {/* Location Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-white/90">
              <span className="relative flex h-2 w-2">
                <span className="pulse-location absolute inline-flex h-full w-full rounded-full bg-[#19B87A] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#19B87A]"></span>
              </span>
              <MapPin className="w-3.5 h-3.5 text-[#19B87A]" />
              <span>Showing verified deals near {activeHub.name}, {activeHub.city}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
              Discover what’s <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5B5CE2] via-[#8B8CFE] to-[#19B87A]">worth it</span> around you.
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-[#6F7078] leading-relaxed max-w-2xl text-white/80">
              Verified local discounts from selected cafés, restaurants, and featured places. Real savings, instant redemption, zero clutter.
            </p>

            {/* Search Bar Container */}
            <div className="pt-2">
              <SearchBar
                onSearch={handleSearchSubmit}
                onOpenAI={() => setIsAIModalOpen(true)}
                placeholder="Search coffee, fine dining, or 25% OFF..."
                className="shadow-2xl border-white/20"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={() => router.push('/search')}
                icon={<ArrowRight className="w-5 h-5" />}
              >
                Find Deals
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => router.push('/map')}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30"
              >
                Explore Map
              </Button>

              {/* AI Quick Prompt Pill */}
              <button
                type="button"
                onClick={() => setIsAIModalOpen(true)}
                className="hidden sm:inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-[#EEF0FF]/15 hover:bg-[#EEF0FF]/25 border border-[#5B5CE2]/40 text-xs font-bold text-[#8B8CFE] transition-all"
              >
                <Sparkles className="w-4 h-4 text-[#19B87A]" />
                <span>Try AI Natural Search</span>
              </button>
            </div>
          </div>
        </section>

        {/* CATEGORY SELECTOR & SECTION HEADER */}
        <section className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#5B5CE2]" />
                <h2 className="text-2xl font-bold text-[#15151A]">Deals Near You</h2>
              </div>
              <p className="text-sm text-[#6F7078] mt-0.5">
                Active and verified discounts within driving distance of {activeHub.name}
              </p>
            </div>

            <Link
              href="/search"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#5B5CE2] hover:text-[#4A4BC7] transition-colors"
            >
              <span>View All ({discounts.length})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <CategorySelector
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </section>

        {/* DISCOUNT CARDS GRID */}
        <section className="mb-16">
          {discounts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {discounts.map((discount) => (
                <DiscountCard key={discount.id} discount={discount} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center bg-white rounded-2xl border border-[#E7E7EC] p-8">
              <Compass className="w-12 h-12 text-[#5B5CE2] mx-auto mb-3" />
              <h3 className="text-lg font-bold text-[#15151A]">No active deals in this category</h3>
              <p className="text-sm text-[#6F7078] mt-1 mb-4">Try selecting another category or location hub.</p>
              <Button variant="outline" size="sm" onClick={() => setSelectedCategory('ALL')}>
                Show All Categories
              </Button>
            </div>
          )}
        </section>

        {/* CURATED FEATURED PLACES SHOWCASE */}
        <section className="mb-16 bg-white border border-[#E7E7EC] rounded-3xl p-8 sm:p-10 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#5B5CE2] uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                Selected & Verified
              </span>
              <h2 className="text-2xl font-bold text-[#15151A]">Featured Places in Lahore</h2>
              <p className="text-sm text-[#6F7078] mt-0.5">
                Top curated culinary spots hand-selected for quality, atmosphere, and savings.
              </p>
            </div>

            <Link
              href="/search?cat=FEATURED_PLACE"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#5B5CE2] hover:text-[#4A4BC7]"
            >
              <span>Explore Featured</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredPlaces.slice(0, 3).map((place) => (
              <div
                key={place.id}
                className="group relative bg-[#F7F7FA] border border-[#E7E7EC] rounded-2xl overflow-hidden transition-lift"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={place.images[0]}
                    alt={place.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-[#5B5CE2] text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-md">
                    Featured
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-[#5B5CE2] uppercase">{place.area}</span>
                    <span className="text-xs font-bold text-[#15151A]">★ {place.rating}</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#15151A] mb-1">{place.name}</h3>
                  <p className="text-xs text-[#6F7078] line-clamp-2 mb-4">{place.description}</p>
                  <Link
                    href={`/search?q=${encodeURIComponent(place.name)}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#5B5CE2] hover:underline"
                  >
                    <span>View Place Offers</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TRUST BANNER */}
        <section className="bg-gradient-to-r from-[#EEF0FF] via-white to-[#E8FAF2] border border-[#E7E7EC] rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white rounded-2xl shadow-sm text-[#19B87A] border border-[#19B87A]/20">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#15151A]">Every Offer Verified & Validated</h3>
              <p className="text-sm text-[#6F7078] mt-0.5 max-w-xl">
                We audit merchant offer terms directly with place management. If an offer is expired or invalid, it is automatically removed.
              </p>
            </div>
          </div>

          <Button variant="secondary" size="md" onClick={() => router.push('/search?verifiedOnly=true')}>
            Browse Verified Deals
          </Button>
        </section>
      </main>

      <Footer />

      <AIDiscoveryModal isOpen={isAIModalOpen} onClose={() => setIsAIModalOpen(false)} />
    </div>
  );
}
