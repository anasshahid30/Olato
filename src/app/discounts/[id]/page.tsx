'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { DiscountBadge } from '@/components/ui/DiscountBadge';
import { VerificationBadge } from '@/components/ui/VerificationBadge';
import { SaveButton } from '@/components/ui/SaveButton';
import { Button } from '@/components/ui/Button';
import { InteractiveMap } from '@/components/map/InteractiveMap';
import { repository } from '@/lib/repository';
import { useLocation } from '@/context/LocationContext';
import { Discount, Place } from '@/lib/types';
import { formatDistance, formatDateFriendly } from '@/lib/distance';
import {
  MapPin,
  Clock,
  Calendar,
  Share2,
  Navigation,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  GraduationCap,
  ChevronLeft,
  Phone,
  ShieldCheck,
  Check,
} from 'lucide-react';

export default function DiscountDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { userCoords } = useLocation();

  const [discount, setDiscount] = useState<Discount | null>(null);
  const [place, setPlace] = useState<Place | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const d = repository.getDiscountById(resolvedParams.id, userCoords.latitude, userCoords.longitude);
    if (d) {
      setDiscount(d);
      const p = repository.getPlaceById(d.placeId);
      if (p) setPlace(p);
    }
  }, [resolvedParams.id, userCoords]);

  if (!discount) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F7F7FA]">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <AlertCircle className="w-12 h-12 text-[#EF4444] mb-3" />
          <h2 className="text-xl font-bold text-[#15151A]">Offer Not Found</h2>
          <p className="text-sm text-[#6F7078] mb-6">The requested discount may have expired or been removed.</p>
          <Link href="/search">
            <Button variant="primary">Browse Active Deals</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const categoryLabels: Record<string, string> = {
    CAFE: 'Café & Bakery',
    RESTAURANT: 'Restaurant',
    FEATURED_PLACE: 'Selected / Featured Place',
  };

  const formattedDist = discount.distance !== undefined ? formatDistance(discount.distance) : 'Nearby';

  const handleGetDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${discount.latitude},${discount.longitude}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7FA]">
      <Navbar />

      <main className="flex-1 max-w-[1440px] mx-auto px-4 sm:px-8 py-8 w-full">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/search"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#6F7078] hover:text-[#5B5CE2] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Discovery Results</span>
          </Link>
        </div>

        {/* HERO BANNER & MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          {/* Left Column: Image Gallery & Offer Specs */}
          <div className="lg:col-span-8 space-y-8">
            {/* Merchant Hero Image */}
            <div className="relative w-full h-[360px] sm:h-[450px] rounded-3xl overflow-hidden shadow-sm border border-[#E7E7EC] bg-[#15151A]">
              <img
                src={discount.image}
                alt={discount.placeName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

              {/* Top Action Pills */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                <DiscountBadge details={discount.discountDetails} size="lg" />
                <span className="px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider">
                  {categoryLabels[discount.category]}
                </span>
              </div>

              <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/90 backdrop-blur-sm border border-[#E7E7EC] text-xs font-bold text-[#15151A] hover:bg-white transition-all shadow-sm"
                >
                  {copied ? <Check className="w-4 h-4 text-[#19B87A]" /> : <Share2 className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Share'}</span>
                </button>
                <SaveButton discountId={discount.id} size="lg" />
              </div>

              {/* Bottom Hero Overlay Information */}
              <div className="absolute bottom-6 left-6 right-6 text-white z-10 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-white/90">
                  <MapPin className="w-4 h-4 text-[#19B87A]" />
                  <span>{place?.address || 'Lahore'}</span>
                  <span>•</span>
                  <span>{formattedDist}</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">{discount.placeName}</h1>
                <p className="text-lg text-white/90 font-semibold">{discount.offerTitle}</p>
              </div>
            </div>

            {/* Offer Overview Card */}
            <div className="bg-white border border-[#E7E7EC] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div>
                <h2 className="text-xl font-bold text-[#15151A] mb-2">About This Discount</h2>
                <p className="text-base text-[#6F7078] leading-relaxed">{discount.description}</p>
              </div>

              {/* Eligibility Badges */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {discount.bankCard && (
                  <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#EEF0FF] border border-[#5B5CE2]/30 text-xs font-bold text-[#5B5CE2]">
                    <CreditCard className="w-4 h-4" />
                    <span>Card Offer: {discount.bankCard}</span>
                  </div>
                )}
                {discount.studentEligible && (
                  <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#E8FAF2] border border-[#19B87A]/30 text-xs font-bold text-[#19B87A]">
                    <GraduationCap className="w-4 h-4" />
                    <span>Student Discount Eligible</span>
                  </div>
                )}
              </div>

              {/* Verification & Expiry Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#E7E7EC]">
                <div className="p-4 rounded-2xl bg-[#F7F7FA] border border-[#E7E7EC] space-y-1">
                  <div className="text-xs text-[#6F7078] font-bold uppercase tracking-wider">Verification Status</div>
                  <VerificationBadge lastVerifiedDate={discount.lastVerifiedDate} confidence={discount.confidence} />
                  <p className="text-xs text-[#6F7078] pt-1">
                    Confidence score: <span className="font-bold text-[#19B87A]">{discount.confidence}% Verified</span>
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F7F7FA] border border-[#E7E7EC] space-y-1">
                  <div className="text-xs text-[#6F7078] font-bold uppercase tracking-wider">Offer Validity Window</div>
                  <div className="flex items-center gap-1.5 text-sm font-bold text-[#15151A]">
                    <Calendar className="w-4 h-4 text-[#5B5CE2]" />
                    <span>{formatDateFriendly(discount.startDate)} – {formatDateFriendly(discount.endDate)}</span>
                  </div>
                  <p className="text-xs text-[#19B87A] font-semibold pt-1">✓ Currently Active & Valid</p>
                </div>
              </div>

              {/* How to Redeem Step-by-Step */}
              <div className="pt-4 border-t border-[#E7E7EC]">
                <h3 className="text-lg font-bold text-[#15151A] mb-3">How to Redeem This Discount</h3>
                <div className="space-y-3">
                  {discount.redemptionInstructions.map((instruction, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#EEF0FF]/50 border border-[#5B5CE2]/15">
                      <div className="w-6 h-6 rounded-full bg-[#5B5CE2] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="text-sm font-semibold text-[#15151A]">{instruction}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="pt-4 border-t border-[#E7E7EC]">
                <h3 className="text-lg font-bold text-[#15151A] mb-3">Offer Terms & Conditions</h3>
                <ul className="space-y-2 text-sm text-[#6F7078]">
                  {discount.terms.map((term, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#5B5CE2] font-bold">•</span>
                      <span>{term}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column: Merchant Details & Directions CTA */}
          <div className="lg:col-span-4 space-y-6 sticky top-28">
            {/* Action Box */}
            <div className="bg-white border border-[#E7E7EC] rounded-3xl p-6 space-y-5 shadow-sm">
              <div className="text-center p-4 rounded-2xl bg-[#E8FAF2] border border-[#19B87A]/20">
                <span className="text-xs font-bold text-[#19B87A] uppercase tracking-wider block">Exclusive Deal</span>
                <span className="text-3xl font-black text-[#19B87A]">{discount.discountDetails}</span>
                <span className="text-xs text-[#15151A] font-semibold block mt-1">{discount.offerTitle}</span>
              </div>

              <Button
                variant="secondary"
                size="lg"
                onClick={handleGetDirections}
                className="w-full shadow-lg shadow-[#19B87A]/20"
                icon={<Navigation className="w-5 h-5 fill-current" />}
              >
                Get Directions
              </Button>

              <div className="text-center text-xs text-[#6F7078]">
                Calculated {formattedDist} from your location
              </div>
            </div>

            {/* Merchant Information Card */}
            <div className="bg-white border border-[#E7E7EC] rounded-3xl p-6 space-y-4 shadow-sm">
              <h3 className="text-lg font-bold text-[#15151A]">Merchant Details</h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#5B5CE2] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-[#15151A]">{place?.name}</div>
                    <div className="text-xs text-[#6F7078]">{place?.address}, {place?.city}</div>
                  </div>
                </div>

                {place?.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-[#5B5CE2] shrink-0" />
                    <a href={`tel:${place.phone}`} className="text-xs font-semibold text-[#5B5CE2] hover:underline">
                      {place.phone}
                    </a>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-[#5B5CE2] shrink-0" />
                  <div className="text-xs text-[#6F7078]">
                    Hours: <span className="font-semibold text-[#15151A]">{place?.openingHours || '09:00 AM - 11:00 PM'}</span>
                  </div>
                </div>
              </div>

              {/* Map Preview */}
              <div className="pt-2">
                <InteractiveMap
                  discounts={[discount]}
                  selectedDiscountId={discount.id}
                  centerLat={discount.latitude}
                  centerLng={discount.longitude}
                  className="h-44 w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
