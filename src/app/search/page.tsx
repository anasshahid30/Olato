'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AIPromptInterface } from '@/components/ai/AIPromptInterface';
import { FilterBar } from '@/components/ui/FilterBar';
import { DiscountCard } from '@/components/ui/DiscountCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { repository } from '@/lib/repository';
import { Discount, SearchFilterParams, CategoryType } from '@/lib/types';
import { useLocation } from '@/context/LocationContext';
import { Coffee, UtensilsCrossed, Star, Sparkles, SlidersHorizontal, Search, RefreshCw, MapPin } from 'lucide-react';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const { userCoords, activeHub } = useLocation();

  // URL Query Parameters
  const queryParam = searchParams.get('q') || '';
  const categoryParam = (searchParams.get('cat') as CategoryType | 'ALL') || 'ALL';
  const minDiscParam = searchParams.get('minDisc') ? Number(searchParams.get('minDisc')) : undefined;
  const validTodayParam = searchParams.get('validToday') === 'true';
  const verifiedOnlyParam = searchParams.get('verifiedOnly') === 'true';
  const studentOnlyParam = searchParams.get('studentOnly') === 'true';
  const bankCardParam = searchParams.get('card') || undefined;

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [activeCategory, setActiveCategory] = useState<CategoryType | 'ALL'>(categoryParam);
  const [filters, setFilters] = useState<SearchFilterParams>({
    query: queryParam,
    category: categoryParam,
    minDiscount: minDiscParam,
    validToday: validTodayParam,
    verifiedOnly: verifiedOnlyParam,
    studentOnly: studentOnlyParam,
    bankCard: bankCardParam,
    maxDistance: 15,
    sortBy: 'relevant',
  });

  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Sync state when URL params change
  useEffect(() => {
    setSearchQuery(queryParam);
    setActiveCategory(categoryParam);
    setFilters((prev) => ({
      ...prev,
      query: queryParam,
      category: categoryParam,
      minDiscount: minDiscParam,
      validToday: validTodayParam,
      verifiedOnly: verifiedOnlyParam,
      studentOnly: studentOnlyParam,
      bankCard: bankCardParam,
    }));
  }, [queryParam, categoryParam, minDiscParam, validTodayParam, verifiedOnlyParam, studentOnlyParam, bankCardParam]);

  // Execute query against repository
  useEffect(() => {
    setIsSearching(true);
    const combinedParams: SearchFilterParams = {
      ...filters,
      query: searchQuery.trim() || undefined,
      category: activeCategory,
    };

    const results = repository.getDiscounts(
      combinedParams,
      userCoords.latitude,
      userCoords.longitude
    );

    setDiscounts(results);
    setIsSearching(false);
  }, [filters, searchQuery, activeCategory, userCoords]);

  const handleUpdateFilters = (updated: Partial<SearchFilterParams>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveCategory('ALL');
    setFilters({
      query: '',
      category: 'ALL',
      maxDistance: 15,
      minDiscount: 0,
      validToday: false,
      verifiedOnly: false,
      studentOnly: false,
      bankCard: undefined,
      sortBy: 'relevant',
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#15151A]">
      <Navbar />

      <main className="flex-1 max-w-[1440px] mx-auto px-4 sm:px-8 py-8 w-full space-y-8">
        {/* Header with Title & Location */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E7E7EC] pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-[#5B5CE2] uppercase tracking-wider">
                Discovery Engine
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              <span className="text-xs font-semibold text-[#6F7078] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#5B5CE2]" />
                Near {activeHub.name}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#15151A] tracking-tight">
              Explore Verified Discounts
            </h1>
          </div>

          <div className="w-full md:max-w-md">
            <AIPromptInterface theme="light" />
          </div>
        </div>

        {/* Category Pill Filters (STRICTLY CAFE, RESTAURANT, SELECTED PLACES) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {[
            { id: 'ALL', label: 'All Categories' },
            { id: 'CAFE', label: 'Cafés', icon: <Coffee className="w-4 h-4" /> },
            { id: 'RESTAURANT', label: 'Restaurants', icon: <UtensilsCrossed className="w-4 h-4" /> },
            { id: 'FEATURED_PLACE', label: 'Selected Places', icon: <Star className="w-4 h-4" /> },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-xs ${
                activeCategory === cat.id
                  ? 'bg-[#5B5CE2] text-white'
                  : 'bg-white border border-[#E7E7EC] text-[#6F7078] hover:text-[#15151A] hover:bg-[#F4F3F0]'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white border border-[#E7E7EC] rounded-2xl p-4 shadow-xs">
          <FilterBar
            filters={{ ...filters, category: activeCategory, query: searchQuery }}
            onChangeFilters={handleUpdateFilters}
            onReset={handleResetFilters}
          />
        </div>

        {/* Active Query Pill */}
        {(searchQuery || filters.studentOnly || filters.verifiedOnly || filters.bankCard) && (
          <div className="flex items-center justify-between p-3 bg-[#EEF0FF] rounded-2xl border border-[#5B5CE2]/20 text-xs">
            <div className="flex items-center gap-2 text-[#5B5CE2] font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>
                Showing results for: <strong>"{searchQuery || 'Active Filters'}"</strong>
              </span>
            </div>
            <button
              onClick={handleResetFilters}
              className="text-[#5B5CE2] hover:underline font-bold cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Results Header */}
        <div className="flex items-center justify-between text-xs font-bold text-[#6F7078] uppercase tracking-wider pt-2">
          <span>{discounts.length} {discounts.length === 1 ? 'Discount Found' : 'Discounts Found'}</span>
          <span>Verified Local Places</span>
        </div>

        {/* Discounts Grid */}
        {discounts.length === 0 ? (
          <EmptyState
            type="search"
            title="No matching discounts found"
            description="Try widening your distance radius, removing student or card restrictions, or searching for another neighborhood."
            actionText="Reset all filters"
            onAction={handleResetFilters}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {discounts.map((discount) => (
              <DiscountCard key={discount.id} discount={discount} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center text-sm font-semibold text-[#6F7078]">
          Loading discounts...
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
