'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Discount } from '@/lib/types';
import { DiscountBadge } from './DiscountBadge';
import { VerificationBadge } from './VerificationBadge';
import { SaveButton } from './SaveButton';
import { formatDistance, formatDateFriendly } from '@/lib/distance';
import { MapPin, CreditCard, GraduationCap } from 'lucide-react';

interface DiscountCardProps {
  discount: Discount;
  className?: string;
  horizontal?: boolean;
}

export function DiscountCard({ discount, className = '', horizontal = false }: DiscountCardProps) {
  const categoryLabels: Record<string, string> = {
    CAFE: 'Café',
    RESTAURANT: 'Restaurant',
    FEATURED_PLACE: 'Featured Place',
  };

  const formattedDist = discount.distance !== undefined ? formatDistance(discount.distance) : 'Nearby';
  const endDateFormatted = formatDateFriendly(discount.endDate);

  if (horizontal) {
    return (
      <div
        className={`group relative flex flex-col sm:flex-row bg-white border border-[#E7E7EC] rounded-2xl overflow-hidden transition-lift ${className}`}
      >
        {/* Image Container */}
        <div className="relative w-full sm:w-48 h-44 sm:h-auto shrink-0 overflow-hidden bg-[#F7F7FA]">
          <img
            src={discount.image}
            alt={discount.placeName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3 z-10">
            <DiscountBadge details={discount.discountDetails} size="md" />
          </div>
          <div className="absolute top-3 right-3 z-10">
            <SaveButton discountId={discount.id} size="sm" />
          </div>
        </div>

        {/* Content Details */}
        <div className="flex flex-col justify-between p-5 flex-1">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-bold text-[#5B5CE2] uppercase tracking-wider">
                {categoryLabels[discount.category] || 'Place'}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-[#6F7078] font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#5B5CE2]" />
                {formattedDist}
              </span>
            </div>

            <Link href={`/discounts/${discount.id}`} className="group-hover:text-[#5B5CE2] transition-colors">
              <h3 className="text-lg font-bold text-[#15151A] line-clamp-1 mb-1">{discount.placeName}</h3>
            </Link>

            <p className="text-sm font-medium text-[#15151A] line-clamp-2 mb-3">{discount.offerTitle}</p>
          </div>

          <div className="pt-3 border-t border-[#E7E7EC]/60 flex flex-wrap items-center justify-between gap-2 text-xs">
            <VerificationBadge lastVerifiedDate={discount.lastVerifiedDate} confidence={discount.confidence} />
            <span className="text-[#6F7078]">Valid until {endDateFormatted}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group relative flex flex-col bg-white border border-[#E7E7EC] rounded-2xl overflow-hidden transition-lift ${className}`}
    >
      {/* Merchant Image Header */}
      <div className="relative w-full h-48 overflow-hidden bg-[#F7F7FA]">
        <img
          src={discount.image}
          alt={discount.placeName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Prominent Discount Badge */}
        <div className="absolute top-3 left-3 z-10">
          <DiscountBadge details={discount.discountDetails} size="md" />
        </div>

        {/* Save Toggle */}
        <div className="absolute top-3 right-3 z-10">
          <SaveButton discountId={discount.id} size="sm" />
        </div>

        {/* Optional Bank Card or Student Pill overlay */}
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 flex-wrap">
          {discount.bankCard && discount.bankCard !== 'All Cards' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/65 backdrop-blur-md text-white text-[11px] font-medium">
              <CreditCard className="w-3 h-3 text-[#19B87A]" />
              {discount.bankCard}
            </span>
          )}
          {discount.studentEligible && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#5B5CE2]/90 backdrop-blur-md text-white text-[11px] font-medium">
              <GraduationCap className="w-3 h-3" />
              Student
            </span>
          )}
        </div>
      </div>

      {/* Body Content */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-xs font-bold text-[#5B5CE2] uppercase tracking-wider">
            {categoryLabels[discount.category] || 'Place'}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-[#6F7078] font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#5B5CE2]" />
            {formattedDist}
          </span>
        </div>

        <Link href={`/discounts/${discount.id}`} className="group-hover:text-[#5B5CE2] transition-colors">
          <h3 className="text-lg font-bold text-[#15151A] line-clamp-1 mb-1">{discount.placeName}</h3>
        </Link>

        <p className="text-sm font-medium text-[#6F7078] line-clamp-2 mb-4 flex-1">{discount.offerTitle}</p>

        {/* Card Footer: Verification & Expiry */}
        <div className="pt-3 border-t border-[#E7E7EC]/60 flex items-center justify-between gap-2 text-xs">
          <VerificationBadge lastVerifiedDate={discount.lastVerifiedDate} confidence={discount.confidence} />
          <span className="text-[#6F7078] shrink-0">Until {endDateFormatted}</span>
        </div>
      </div>
    </div>
  );
}
