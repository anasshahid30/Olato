'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { DiscountCard } from '@/components/ui/DiscountCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { useSavedDeals } from '@/context/SavedDealsContext';
import { useLocation } from '@/context/LocationContext';
import { repository } from '@/lib/repository';
import { Discount } from '@/lib/types';
import { Heart, Compass, Sparkles } from 'lucide-react';

export default function SavedDealsPage() {
  const router = useRouter();
  const { savedIds, savedCount } = useSavedDeals();
  const { userCoords } = useLocation();
  const [savedDiscounts, setSavedDiscounts] = useState<Discount[]>([]);

  useEffect(() => {
    const all = repository.getDiscounts({}, userCoords.latitude, userCoords.longitude);
    const filtered = all.filter((d) => savedIds.includes(d.id));
    setSavedDiscounts(filtered);
  }, [savedIds, userCoords]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7FA]">
      <Navbar />

      <main className="flex-1 max-w-[1440px] mx-auto px-4 sm:px-8 py-8 w-full">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-[#EF4444] fill-[#EF4444]" />
              <h1 className="text-3xl font-bold text-[#15151A]">Your Saved Deals</h1>
            </div>
            <p className="text-sm text-[#6F7078] mt-1">
              You have {savedCount} saved {savedCount === 1 ? 'offer' : 'offers'} ready for redemption
            </p>
          </div>

          {savedCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/search')}
              icon={<Compass className="w-4 h-4 text-[#5B5CE2]" />}
            >
              Discover More Deals
            </Button>
          )}
        </div>

        {/* Saved List */}
        {savedDiscounts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {savedDiscounts.map((discount) => (
              <DiscountCard key={discount.id} discount={discount} />
            ))}
          </div>
        ) : (
          <div className="py-12">
            <EmptyState
              type="saved"
              title="No saved deals yet"
              description="You haven't saved any local discounts yet. Browse nearby cafés and restaurants and tap the heart icon to save deals."
              onAction={() => router.push('/search')}
              actionText="Explore Verified Deals"
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
