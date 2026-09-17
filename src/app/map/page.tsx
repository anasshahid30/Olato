'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CategorySelector } from '@/components/ui/CategorySelector';
import { DiscountBadge } from '@/components/ui/DiscountBadge';
import { SaveButton } from '@/components/ui/SaveButton';
import { Button } from '@/components/ui/Button';
import { InteractiveMap } from '@/components/map/InteractiveMap';
import { repository } from '@/lib/repository';
import { useLocation } from '@/context/LocationContext';
import { CategoryType, Discount } from '@/lib/types';
import { formatDistance } from '@/lib/distance';
import { MapPin, Navigation, ArrowRight, X } from 'lucide-react';

export default function DedicatedMapPage() {
  const { userCoords, activeHub } = useLocation();

  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'ALL'>('ALL');
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [selectedDiscountId, setSelectedDiscountId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const list = repository.getDiscounts({ category: selectedCategory }, userCoords.latitude, userCoords.longitude);
    setDiscounts(list);
    if (list.length > 0 && !selectedDiscountId) {
      setSelectedDiscountId(list[0].id);
    }
  }, [selectedCategory, userCoords, selectedDiscountId]);

  const activeDiscount = discounts.find((d) => d.id === selectedDiscountId) || discounts[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7FA]">
      <Navbar />

      <main className="flex-1 max-w-[1440px] mx-auto px-4 sm:px-8 py-6 w-full flex flex-col">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-[#15151A]">Map Discovery</h1>
            <p className="text-xs text-[#6F7078]">
              Exploring {discounts.length} offers around {activeHub.name}
            </p>
          </div>

          <CategorySelector
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* Dedicated Map Workspace Container */}
        <div className="relative flex-1 min-h-[620px] rounded-3xl overflow-hidden border border-[#E7E7EC] shadow-sm bg-white grid grid-cols-1 lg:grid-cols-12">
          {/* Main Full-height Map Canvas */}
          <div className="lg:col-span-8 relative h-[450px] lg:h-full">
            <InteractiveMap
              discounts={discounts}
              selectedDiscountId={selectedDiscountId}
              onSelectDiscount={(id) => setSelectedDiscountId(id)}
              centerLat={userCoords.latitude}
              centerLng={userCoords.longitude}
              className="h-full w-full border-none rounded-none"
            />
          </div>

          {/* Sidebar Nearby Offers & Preview Drawer */}
          <div className="lg:col-span-4 bg-white border-t lg:border-t-0 lg:border-l border-[#E7E7EC] p-6 flex flex-col overflow-y-auto max-h-[620px]">
            {/* Active Selected Card Preview */}
            {activeDiscount && (
              <div className="mb-6 p-4 rounded-2xl bg-[#EEF0FF]/60 border border-[#5B5CE2]/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#5B5CE2] uppercase tracking-wider">
                    {activeDiscount.category}
                  </span>
                  <SaveButton discountId={activeDiscount.id} size="sm" />
                </div>

                <div className="flex items-start gap-3">
                  <img
                    src={activeDiscount.image}
                    alt={activeDiscount.placeName}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div>
                    <h3 className="font-bold text-[#15151A] text-base leading-snug">{activeDiscount.placeName}</h3>
                    <p className="text-xs text-[#6F7078] line-clamp-1">{activeDiscount.offerTitle}</p>
                    <div className="mt-1">
                      <DiscountBadge details={activeDiscount.discountDetails} size="sm" />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#5B5CE2]/15 flex items-center justify-between text-xs">
                  <span className="text-[#6F7078]">
                    {activeDiscount.distance !== undefined ? formatDistance(activeDiscount.distance) : 'Nearby'}
                  </span>
                  <Link href={`/discounts/${activeDiscount.id}`}>
                    <Button variant="primary" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* List of Nearby Pins */}
            <h4 className="text-xs font-bold text-[#6F7078] uppercase tracking-wider mb-3">
              Nearby Places ({discounts.length})
            </h4>

            <div className="space-y-3 flex-1 overflow-y-auto pr-1">
              {discounts.map((d) => {
                const isSelected = d.id === selectedDiscountId;
                return (
                  <div
                    key={d.id}
                    onClick={() => setSelectedDiscountId(d.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#EEF0FF] border-[#5B5CE2] shadow-sm'
                        : 'bg-white border-[#E7E7EC] hover:bg-[#F7F7FA]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-sm text-[#15151A] line-clamp-1">{d.placeName}</span>
                      <span className="text-xs font-extrabold text-[#19B87A] shrink-0">{d.discountDetails}</span>
                    </div>
                    <p className="text-xs text-[#6F7078] line-clamp-1 mb-2">{d.offerTitle}</p>
                    <div className="flex items-center justify-between text-[11px] text-[#6F7078]">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#5B5CE2]" />
                        {d.distance !== undefined ? formatDistance(d.distance) : 'Nearby'}
                      </span>
                      <span>✓ Verified</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
