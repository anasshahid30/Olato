'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { InteractiveMap } from '@/components/map/InteractiveMap';
import { DiscountBadge } from '@/components/ui/DiscountBadge';
import { VerificationBadge } from '@/components/ui/VerificationBadge';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { repository } from '@/lib/repository';
import { Discount, CategoryType } from '@/lib/types';
import { useLocation } from '@/context/LocationContext';
import { formatDistance, formatDateFriendly } from '@/lib/distance';
import {
  Coffee,
  UtensilsCrossed,
  Star,
  MapPin,
  ShieldCheck,
  Navigation,
  ArrowRight,
  SlidersHorizontal,
  Compass,
  CheckCircle2,
} from 'lucide-react';

export default function MapPage() {
  const { userCoords, activeHub, isUsingGPS, requestGPSLocation } = useLocation();
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [activeCategory, setActiveCategory] = useState<CategoryType | 'ALL'>('ALL');
  const [selectedDiscountId, setSelectedDiscountId] = useState<string>('disc-1');
  const [isRequestingGPS, setIsRequestingGPS] = useState(false);

  useEffect(() => {
    const all = repository.getDiscounts({}, userCoords.latitude, userCoords.longitude);
    setDiscounts(all);
    if (all.length > 0 && !selectedDiscountId) {
      setSelectedDiscountId(all[0].id);
    }
  }, [userCoords, selectedDiscountId]);

  const filteredDiscounts = discounts.filter((d) => {
    if (activeCategory === 'ALL') return true;
    return d.category === activeCategory;
  });

  const selectedDiscount = discounts.find((d) => d.id === selectedDiscountId) || discounts[0];

  const handleUseGPS = async () => {
    setIsRequestingGPS(true);
    await requestGPSLocation();
    setIsRequestingGPS(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#15151A]">
      <Navbar />

      <main className="flex-1 max-w-[1440px] mx-auto px-4 sm:px-8 py-6 w-full space-y-6 flex flex-col">
        {/* Top Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#E7E7EC] p-4 rounded-3xl shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-bold text-[#5B5CE2] uppercase tracking-wider">
                Geospatial Discovery
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              <span className="text-xs text-[#6F7078]">
                Centered at <strong>{activeHub.name}</strong>
              </span>
            </div>
            <h1 className="text-2xl font-black text-[#15151A] tracking-tight">
              Nearby Discount Map
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 bg-[#FAF9F6] p-1.5 border border-[#E7E7EC] rounded-2xl overflow-x-auto no-scrollbar">
              {[
                { id: 'ALL', label: 'All Places' },
                { id: 'CAFE', label: 'Cafés', icon: <Coffee className="w-3.5 h-3.5" /> },
                { id: 'RESTAURANT', label: 'Restaurants', icon: <UtensilsCrossed className="w-3.5 h-3.5" /> },
                { id: 'FEATURED_PLACE', label: 'Selected Places', icon: <Star className="w-3.5 h-3.5" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeCategory === tab.id
                      ? 'bg-[#5B5CE2] text-white'
                      : 'text-[#6F7078] hover:text-[#15151A] hover:bg-white'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* GPS Trigger */}
            <button
              onClick={handleUseGPS}
              disabled={isRequestingGPS}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                isUsingGPS
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-white border-[#E7E7EC] text-[#15151A] hover:border-[#5B5CE2]'
              }`}
            >
              <Compass className={`w-3.5 h-3.5 ${isRequestingGPS ? 'animate-spin' : 'text-[#5B5CE2]'}`} />
              <span>{isUsingGPS ? 'GPS Active' : 'Use My GPS'}</span>
            </button>
          </div>
        </div>

        {/* Map & Preview Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-stretch">
          {/* Main Map Box */}
          <div className="lg:col-span-8 rounded-3xl overflow-hidden border border-[#E7E7EC] shadow-md min-h-[540px] flex">
            <InteractiveMap
              discounts={filteredDiscounts}
              selectedDiscountId={selectedDiscountId}
              onSelectDiscount={(id) => setSelectedDiscountId(id)}
              centerLat={userCoords.latitude}
              centerLng={userCoords.longitude}
              className="h-[540px] lg:h-full w-full"
            />
          </div>

          {/* Place Preview Card & Nearby List */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
            {/* Active Selected Card Preview */}
            {selectedDiscount && (
              <div className="bg-white border border-[#E7E7EC] rounded-3xl p-6 shadow-md space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#5B5CE2] uppercase tracking-wider">
                    {selectedDiscount.category === 'CAFE' ? 'Café' : selectedDiscount.category === 'RESTAURANT' ? 'Restaurant' : 'Selected Place'}
                  </span>
                  <span className="text-xs text-[#6F7078] flex items-center gap-1 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-[#5B5CE2]" />
                    {selectedDiscount.distance !== undefined ? formatDistance(selectedDiscount.distance) : 'Nearby'}
                  </span>
                </div>

                <div className="relative h-44 rounded-2xl overflow-hidden bg-[#FAF9F6]">
                  <img
                    src={selectedDiscount.image}
                    alt={selectedDiscount.placeName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <DiscountBadge details={selectedDiscount.discountDetails} size="md" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-[#15151A]">{selectedDiscount.placeName}</h3>
                  <p className="text-sm font-semibold text-[#5B5CE2]">{selectedDiscount.offerTitle}</p>
                  <p className="text-xs text-[#6F7078] line-clamp-2">{selectedDiscount.description}</p>
                </div>

                <div className="pt-2 border-t border-[#E7E7EC] flex items-center justify-between text-xs">
                  <VerificationBadge
                    lastVerifiedDate={selectedDiscount.lastVerifiedDate}
                    confidence={selectedDiscount.confidence}
                  />
                  <span className="text-[#6F7078]">Valid to {formatDateFriendly(selectedDiscount.endDate)}</span>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Link href={`/discounts/${selectedDiscount.id}`} className="flex-1">
                    <MagneticButton variant="primary" size="sm" className="w-full">
                      View deal →
                    </MagneticButton>
                  </Link>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedDiscount.latitude},${selectedDiscount.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 bg-[#FAF9F6] border border-[#E7E7EC] hover:bg-[#F4F3F0] rounded-xl text-xs font-bold text-[#15151A] transition-colors"
                  >
                    Directions
                  </a>
                </div>
              </div>
            )}

            {/* Scrollable list of other pins */}
            <div className="bg-[#FAF9F6] border border-[#E7E7EC] rounded-3xl p-4 flex-1 space-y-3 overflow-hidden flex flex-col">
              <span className="text-xs font-bold text-[#6F7078] uppercase tracking-wider block">
                Visible Venues ({filteredDiscounts.length})
              </span>

              <div className="space-y-2 overflow-y-auto max-h-[220px] pr-1">
                {filteredDiscounts.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => setSelectedDiscountId(d.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      d.id === selectedDiscountId
                        ? 'bg-white border-[#5B5CE2] shadow-xs'
                        : 'bg-white/60 border-[#E7E7EC] hover:bg-white'
                    }`}
                  >
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-[#15151A] truncate">{d.placeName}</h4>
                      <p className="text-[11px] text-[#6F7078] truncate">{d.offerTitle}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-extrabold text-[#5B5CE2]">{d.discountDetails}</span>
                      <span className="text-[10px] text-[#6F7078]">
                        {d.distance !== undefined ? formatDistance(d.distance) : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
