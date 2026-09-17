'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { useSavedDeals } from '@/context/SavedDealsContext';

interface SaveButtonProps {
  discountId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function SaveButton({ discountId, className = '', size = 'md' }: SaveButtonProps) {
  const { isSaved, toggleSave } = useSavedDeals();
  const saved = isSaved(discountId);

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const btnSizes = {
    sm: 'w-8 h-8',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSave(discountId);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={saved ? 'Remove from saved' : 'Save deal'}
      className={`inline-flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm border border-[#E7E7EC] shadow-sm transition-all duration-200 hover:scale-110 active:scale-95 ${
        btnSizes[size]
      } ${saved ? 'text-[#EF4444] border-[#EF4444]/30 bg-[#FFF5F5]' : 'text-[#6F7078] hover:text-[#EF4444]'} ${className}`}
    >
      <Heart
        className={`${iconSizes[size]} transition-all duration-300 ${
          saved ? 'fill-[#EF4444] scale-110' : ''
        }`}
      />
    </button>
  );
}
