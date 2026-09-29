'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { DiscountCard } from '@/components/ui/DiscountCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { repository } from '@/lib/repository';
import { Discount } from '@/lib/types';
import { useSavedDeals } from '@/context/SavedDealsContext';
import { useLocation } from '@/context/LocationContext';
import { isOfferValid } from '@/lib/distance';
import { Heart, Trash2, ArrowRight, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function SavedDealsPage() {
  const router = useRouter();
  const { savedIds, toggleSave } = useSavedDeals();
  const { userCoords } = useLocation();
  const [savedDiscounts, setSavedDiscounts] = useState<Discount[]>([]);

  useEffect(() => {
    const all = repository.getDiscounts({}, userCoords.latitude, userCoords.longitude);
    const matched = all.filter((d) => savedIds.includes(d.id));
    setSavedDiscounts(matched);
  }, [savedIds, userCoords]);

  const activeSavedDeals = savedDiscounts.filter((d) => isOfferValid(d.startDate, d.endDate) && d.status === 'Active');
  const expiredSavedDeals = savedDiscounts.filter((d) => !isOfferValid(d.startDate, d.endDate) || d.status !== 'Active');

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#15151A]">
      <Navbar />

      <main className="flex-1 max-w-[1440px] mx-auto px-4 sm:px-8 py-8 w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E7EC] pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-[#5B5CE2] uppercase tracking-wider">
                Personal Pocket
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
              <span className="text-xs text-[#6F7078]">{savedDiscounts.length} Deals Saved</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#15151A] tracking-tight">
              My Saved Deals
            </h1>
          </div>

          <Link href="/search">
            <MagneticButton variant="primary" size="sm" icon={<Sparkles className="w-4 h-4" />}>
              Discover More Deals
            </MagneticButton>
          </Link>
        </div>

        {savedDiscounts.length === 0 ? (
          <EmptyState
            type="saved"
            title="You haven't saved any deals yet"
            description="Tap the heart icon on any discount card to store it in your pocket for fast access when visiting."
            actionText="Browse Available Discounts"
            onAction={() => router.push('/search')}
          />
        ) : (
          <div className="space-y-12">
            {/* Active Deals Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#15151A] flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                  <span>Active &amp; Ready to Redeem ({activeSavedDeals.length})</span>
                </h2>
              </div>

              {activeSavedDeals.length === 0 ? (
                <div className="p-8 text-center bg-white border border-[#E7E7EC] rounded-3xl text-sm text-[#6F7078]">
                  None of your saved deals are currently active.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {activeSavedDeals.map((deal) => (
                    <DiscountCard key={deal.id} discount={deal} />
                  ))}
                </div>
              )}
            </div>

            {/* Expired Deals Section */}
            {expiredSavedDeals.length > 0 && (
              <div className="space-y-6 pt-6 border-t border-[#E7E7EC]">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-[#6F7078] flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                    <span>Expired or Inactive Deals ({expiredSavedDeals.length})</span>
                  </h2>
                  <span className="text-xs text-[#9A9BA4]">
                    These promotions are no longer active at the venue.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 opacity-60">
                  {expiredSavedDeals.map((deal) => (
                    <DiscountCard key={deal.id} discount={deal} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
