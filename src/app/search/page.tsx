'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SearchBar } from '@/components/ui/SearchBar';
import { CategorySelector } from '@/components/ui/CategorySelector';
import { FilterBar } from '@/components/ui/FilterBar';
import { DiscountCard } from '@/components/ui/DiscountCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { InteractiveMap } from '@/components/map/InteractiveMap';
import { AIDiscoveryModal } from '@/components/ai/AIDiscoveryModal';
import { repository } from '@/lib/repository';
import { useLocation } from '@/context/LocationContext';
import { CategoryType, Discount, SearchFilterParams } from '@/lib/types';
import { LayoutGrid, Map, SlidersHorizontal, Sparkles } from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { userCoords, activeHub } = useLocation();

  // Extract query params
  const initialQuery = searchParams.get('q') || '';
  const initialCat = (searchParams.get('cat') as CategoryType) || 'ALL';
  const initialMinDisc = searchParams.get('minDisc') ? Number(searchParams.get('minDisc')) : 0;
  const initialValidToday = searchParams.get('validToday') === 'true';
  const initialVerifiedOnly = searchParams.get('verifiedOnly') === 'true';
  const initialStudentOnly = searchParams.get('studentOnly') === 'true';

  const [filters, setFilters] = useState<SearchFilterParams>({
    query: initialQuery,
    category: initialCat,
    minDiscount: initialMinDisc,
    validToday: initialValidToday,
    verifiedOnly: initialVerifiedOnly,
    studentOnly: initialStudentOnly,
    maxDistance: 10,
    sortBy: 'relevant',
  });

  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'split'>('split');
  const [selectedDiscountId, setSelectedDiscountId] = useState<string | undefined>(undefined);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  useEffect(() => {
    const list = repository.getDiscounts(filters, userCoords.latitude, userCoords.longitude);
    setDiscounts(list);
  }, [filters, userCoords]);

  const handleUpdateFilters = (updated: Partial<SearchFilterParams>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters({
      query: '',
      category: 'ALL',
      maxDistance: 25,
      minDiscount: 0,
      validToday: false,
      verifiedOnly: false,
      studentOnly: false,
      sortBy: 'relevant',
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7FA]">
      <Navbar onOpenAIModal={() => setIsAIModalOpen(true)} />

      <main className="flex-1 max-w-[1440px] mx-auto px-4 sm:px-8 py-8 w-full">
        {/* TOP SEARCH HEADER */}
        <section className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#15151A]">Deals Near You</h1>
              <p className="text-sm text-[#6F7078] mt-0.5">
                Showing {discounts.length} verified offers around {activeHub.name}
              </p>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1.5 bg-white border border-[#E7E7EC] p-1 rounded-xl shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('split')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'split' ? 'bg-[#5B5CE2] text-white shadow-sm' : 'text-[#6F7078] hover:text-[#15151A]'
                }`}
              >
                <Map className="w-3.5 h-3.5" />
                <span>Split View</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'grid' ? 'bg-[#5B5CE2] text-white shadow-sm' : 'text-[#6F7078] hover:text-[#15151A]'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid Only</span>
              </button>
            </div>
          </div>

          {/* Search bar & Categories */}
          <div className="space-y-3">
            <SearchBar
              initialValue={filters.query || ''}
              onSearch={(q) => handleUpdateFilters({ query: q })}
              onOpenAI={() => setIsAIModalOpen(true)}
              placeholder="Search coffee, pizza, 25% off, or place name..."
            />

            <CategorySelector
              selectedCategory={filters.category || 'ALL'}
              onSelectCategory={(cat) => handleUpdateFilters({ category: cat })}
            />

            <FilterBar
              filters={filters}
              onChangeFilters={handleUpdateFilters}
              onReset={handleResetFilters}
            />
          </div>
        </section>

        {/* RESULTS AREA */}
        {discounts.length > 0 ? (
          viewMode === 'split' ? (
            /* Split View: Left List, Right Map */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: List */}
              <div className="lg:col-span-7 space-y-4">
                {discounts.map((discount) => (
                  <div
                    key={discount.id}
                    onClick={() => setSelectedDiscountId(discount.id)}
                    className={selectedDiscountId === discount.id ? 'ring-2 ring-[#5B5CE2] rounded-2xl' : ''}
                  >
                    <DiscountCard discount={discount} horizontal />
                  </div>
                ))}
              </div>

              {/* Right Column: Interactive Map */}
              <div className="lg:col-span-5 sticky top-28 h-[650px]">
                <InteractiveMap
                  discounts={discounts}
                  selectedDiscountId={selectedDiscountId}
                  onSelectDiscount={(id) => setSelectedDiscountId(id)}
                  centerLat={userCoords.latitude}
                  centerLng={userCoords.longitude}
                  className="h-full w-full"
                />
              </div>
            </div>
          ) : (
            /* Full Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {discounts.map((discount) => (
                <DiscountCard key={discount.id} discount={discount} />
              ))}
            </div>
          )
        ) : (
          <div className="py-12">
            <EmptyState
              type="search"
              title="No matching deals found"
              description="No discounts matched your active search query or filter selection around this area."
              onAction={handleResetFilters}
              actionText="Clear All Filters"
            />
          </div>
        )}
      </main>

      <Footer />

      <AIDiscoveryModal isOpen={isAIModalOpen} onClose={() => setIsAIModalOpen(false)} />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-[#6F7078]">Loading search results...</div>}>
      <SearchContent />
    </Suspense>
  );
}
