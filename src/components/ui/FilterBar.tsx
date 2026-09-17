'use client';

import React from 'react';
import { SearchFilterParams } from '@/lib/types';
import { SlidersHorizontal, CheckCircle2, GraduationCap, MapPin, ArrowUpDown } from 'lucide-react';

interface FilterBarProps {
  filters: SearchFilterParams;
  onChangeFilters: (updated: Partial<SearchFilterParams>) => void;
  onReset: () => void;
  className?: string;
}

export function FilterBar({
  filters,
  onChangeFilters,
  onReset,
  className = '',
}: FilterBarProps) {
  const hasActiveFilters =
    filters.validToday ||
    filters.verifiedOnly ||
    filters.studentOnly ||
    (filters.maxDistance && filters.maxDistance < 20) ||
    (filters.minDiscount && filters.minDiscount > 0) ||
    filters.bankCard;

  return (
    <div className={`flex flex-wrap items-center gap-2.5 py-2 ${className}`}>
      {/* Distance Filter */}
      <div className="flex items-center gap-1 bg-white border border-[#E7E7EC] rounded-xl px-3 py-1.5 text-xs font-semibold text-[#15151A]">
        <MapPin className="w-3.5 h-3.5 text-[#5B5CE2]" />
        <span>Distance:</span>
        <select
          value={filters.maxDistance ?? 10}
          onChange={(e) => onChangeFilters({ maxDistance: Number(e.target.value) })}
          className="bg-transparent font-semibold outline-none cursor-pointer text-[#5B5CE2]"
        >
          <option value={2}>Within 2 km</option>
          <option value={5}>Within 5 km</option>
          <option value={10}>Within 10 km</option>
          <option value={25}>Within 25 km</option>
        </select>
      </div>

      {/* Min Discount % */}
      <div className="flex items-center gap-1 bg-white border border-[#E7E7EC] rounded-xl px-3 py-1.5 text-xs font-semibold text-[#15151A]">
        <span>Discount:</span>
        <select
          value={filters.minDiscount ?? 0}
          onChange={(e) => onChangeFilters({ minDiscount: Number(e.target.value) })}
          className="bg-transparent font-semibold outline-none cursor-pointer text-[#19B87A]"
        >
          <option value={0}>All Discounts</option>
          <option value={15}>15%+ OFF</option>
          <option value={20}>20%+ OFF</option>
          <option value={25}>25%+ OFF</option>
          <option value={30}>30%+ OFF</option>
        </select>
      </div>

      {/* Valid Today Toggle Pill */}
      <button
        type="button"
        onClick={() => onChangeFilters({ validToday: !filters.validToday })}
        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all select-none ${
          filters.validToday
            ? 'bg-[#19B87A] text-white border-[#19B87A]'
            : 'bg-white border-[#E7E7EC] text-[#6F7078] hover:border-[#19B87A]/50 hover:text-[#15151A]'
        }`}
      >
        Valid Today
      </button>

      {/* Verified Only Pill */}
      <button
        type="button"
        onClick={() => onChangeFilters({ verifiedOnly: !filters.verifiedOnly })}
        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all select-none ${
          filters.verifiedOnly
            ? 'bg-[#E8FAF2] text-[#19B87A] border-[#19B87A]'
            : 'bg-white border-[#E7E7EC] text-[#6F7078] hover:border-[#19B87A]/50 hover:text-[#15151A]'
        }`}
      >
        <CheckCircle2 className="w-3.5 h-3.5" />
        Verified Only
      </button>

      {/* Student Deals Toggle Pill */}
      <button
        type="button"
        onClick={() => onChangeFilters({ studentOnly: !filters.studentOnly })}
        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all select-none ${
          filters.studentOnly
            ? 'bg-[#EEF0FF] text-[#5B5CE2] border-[#5B5CE2]'
            : 'bg-white border-[#E7E7EC] text-[#6F7078] hover:border-[#5B5CE2]/50 hover:text-[#15151A]'
        }`}
      >
        <GraduationCap className="w-3.5 h-3.5" />
        Student Deals
      </button>

      {/* Sort Select */}
      <div className="flex items-center gap-1 bg-white border border-[#E7E7EC] rounded-xl px-3 py-1.5 text-xs font-semibold text-[#15151A] ml-auto">
        <ArrowUpDown className="w-3.5 h-3.5 text-[#6F7078]" />
        <span className="hidden sm:inline">Sort:</span>
        <select
          value={filters.sortBy || 'relevant'}
          onChange={(e) => onChangeFilters({ sortBy: e.target.value as SearchFilterParams['sortBy'] })}
          className="bg-transparent font-semibold outline-none cursor-pointer text-[#15151A]"
        >
          <option value="relevant">Most Relevant</option>
          <option value="nearest">Nearest First</option>
          <option value="highest_discount">Highest Discount</option>
          <option value="ending_soon">Ending Soon</option>
        </select>
      </div>

      {/* Reset Filter Action */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-[#5B5CE2] underline font-semibold px-2 py-1 hover:text-[#4A4BC7]"
        >
          Reset Filters
        </button>
      )}
    </div>
  );
}
