import React from 'react';

interface DiscountBadgeProps {
  details: string; // e.g., "25% OFF", "BOGO", "30% OFF"
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function DiscountBadge({ details, size = 'md', className = '' }: DiscountBadgeProps) {
  const sizes = {
    sm: 'px-2 py-0.5 text-xs font-bold',
    md: 'px-2.5 py-1 text-xs font-extrabold tracking-wide',
    lg: 'px-4 py-1.5 text-base font-black tracking-wide',
  };

  return (
    <span
      className={`inline-flex items-center rounded-lg bg-[#E8FAF2] text-[#19B87A] border border-[#19B87A]/30 uppercase ${sizes[size]} ${className}`}
    >
      {details}
    </span>
  );
}
