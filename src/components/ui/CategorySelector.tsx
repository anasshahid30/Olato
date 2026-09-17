'use client';

import React from 'react';
import { CategoryType } from '@/lib/types';
import { Coffee, UtensilsCrossed, Sparkles, Compass } from 'lucide-react';

interface CategorySelectorProps {
  selectedCategory: CategoryType | 'ALL';
  onSelectCategory: (cat: CategoryType | 'ALL') => void;
  className?: string;
}

export function CategorySelector({
  selectedCategory,
  onSelectCategory,
  className = '',
}: CategorySelectorProps) {
  const categories: { key: CategoryType | 'ALL'; label: string; icon: React.ReactNode }[] = [
    { key: 'ALL', label: 'All Deals', icon: <Compass className="w-4 h-4" /> },
    { key: 'CAFE', label: 'Cafés', icon: <Coffee className="w-4 h-4" /> },
    { key: 'RESTAURANT', label: 'Restaurants', icon: <UtensilsCrossed className="w-4 h-4" /> },
    { key: 'FEATURED_PLACE', label: 'Featured Places', icon: <Sparkles className="w-4 h-4" /> },
  ];

  return (
    <div className={`flex items-center gap-2 overflow-x-auto no-scrollbar py-1 ${className}`}>
      {categories.map((cat) => {
        const active = selectedCategory === cat.key;
        return (
          <button
            key={cat.key}
            type="button"
            onClick={() => onSelectCategory(cat.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 shrink-0 select-none ${
              active
                ? 'bg-[#5B5CE2] text-white shadow-sm shadow-[#5B5CE2]/30 scale-[1.02]'
                : 'bg-white border border-[#E7E7EC] text-[#15151A] hover:bg-[#F7F7FA] hover:border-[#5B5CE2]/40'
            }`}
          >
            <span className={active ? 'text-white' : 'text-[#5B5CE2]'}>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}
