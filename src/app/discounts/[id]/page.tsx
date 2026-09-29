'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { DiscountBadge } from '@/components/ui/DiscountBadge';
import { VerificationBadge } from '@/components/ui/VerificationBadge';
import { SaveButton } from '@/components/ui/SaveButton';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { DiscountCard } from '@/components/ui/DiscountCard';
import { repository } from '@/lib/repository';
import { Discount, Place } from '@/lib/types';
import { useLocation } from '@/context/LocationContext';
import { useSavedDeals } from '@/context/SavedDealsContext';
import { formatDistance, formatDateFriendly, isOfferValid } from '@/lib/distance';
import {
  MapPin,
  Calendar,
  CreditCard,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Navigation,
  Share2,
  ArrowLeft,
  QrCode,
  AlertCircle,
  Copy,
  Check,
  Phone,
  Utensils,
  ExternalLink,
} from 'lucide-react';

export default function DiscountDetailPage() {
  const params = useParams();
  const router = useRouter();
  const discountId = params?.id as string;
  const { userCoords } = useLocation();
  const { isSaved, toggleSave } = useSavedDeals();

  const [discount, setDiscount] = useState<Discount | null>(null);
  const [place, setPlace] = useState<Place | null>(null);
  const [similarDiscounts, setSimilarDiscounts] = useState<Discount[]>([]);
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    if (!discountId) return;

    const found = repository.getDiscountById(discountId);
    if (found) {
      const distance = repository.getDiscounts({}, userCoords.latitude, userCoords.longitude).find((d) => d.id === found.id)?.distance;
      setDiscount({ ...found, distance });

      const foundPlace = repository.getPlaceById(found.placeId);
      if (foundPlace) setPlace(foundPlace);

      // Find other discounts in the same category
      const others = repository
        .getDiscounts({ category: found.category }, userCoords.latitude, userCoords.longitude)
        .filter((d) => d.id !== found.id)
        .slice(0, 3);
      setSimilarDiscounts(others);
    }
  }, [discountId, userCoords]);

  if (!discount) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#15151A]">
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
          <h2 className="text-2xl font-bold">Discount Offer Not Found</h2>
          <p className="text-sm text-[#6F7078]">The requested offer may have expired or was removed by administrators.</p>
          <Link href="/search">
            <MagneticButton variant="primary" size="md">
              Browse Active Deals
            </MagneticButton>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const isValidNow = isOfferValid(discount.startDate, discount.endDate) && discount.status === 'Active';
  const categoryLabel = discount.category === 'CAFE' ? 'Café' : discount.category === 'RESTAURANT' ? 'Restaurant' : 'Selected Place';
  const distanceStr = discount.distance !== undefined ? formatDistance(discount.distance) : 'Nearby';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(`OLATO-${discount.id.toUpperCase()}`);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#15151A]">
      <Navbar />

      <main className="flex-1 max-w-[1280px] mx-auto px-4 sm:px-8 py-8 w-full space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-semibold text-[#6F7078]">
          <Link href="/" className="hover:text-[#5B5CE2]">Home</Link>
          <span>/</span>
          <Link href="/search" className="hover:text-[#5B5CE2]">Discounts</Link>
          <span>/</span>
          <Link href={`/search?cat=${discount.category}`} className="hover:text-[#5B5CE2]">{categoryLabel}</Link>
          <span>/</span>
          <span className="text-[#15151A] font-bold truncate max-w-[200px]">{discount.placeName}</span>
        </div>

        {/* Back Link */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6F7078] hover:text-[#15151A] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to previous page</span>
        </button>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Main Deal & Venue Presentation */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Hero Image Card */}
            <div className="relative rounded-3xl overflow-hidden bg-white border border-[#E7E7EC] shadow-md">
              <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-[#FAF9F6]">
                <img
                  src={discount.image}
                  alt={discount.placeName}
                  className="w-full h-full object-cover"
                />

                {/* Overlaid Badges */}
                <div className="absolute top-4 left-4 z-10">
                  <DiscountBadge details={discount.discountDetails} size="lg" />
                </div>

                <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                  <SaveButton discountId={discount.id} size="md" />
                </div>

                {/* Status indicator bar */}
                <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-xl text-xs font-extrabold backdrop-blur-md ${
                      isValidNow
                        ? 'bg-emerald-600/90 text-white'
                        : 'bg-red-600/90 text-white'
                    }`}
                  >
                    {isValidNow ? '● Active Offer' : '● Expired Offer'}
                  </span>
                  <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-black/60 text-white backdrop-blur-md flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#5B5CE2]" />
                    {distanceStr}
                  </span>
                </div>
              </div>

              {/* Title & Offer Description */}
              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#5B5CE2] uppercase tracking-wider">
                    {categoryLabel}
                  </span>
                  <VerificationBadge lastVerifiedDate={discount.lastVerifiedDate} confidence={discount.confidence} />
                </div>

                <h1 className="text-2xl sm:text-4xl font-black text-[#15151A] tracking-tight">
                  {discount.offerTitle}
                </h1>

                <p className="text-base text-[#6F7078] leading-relaxed">
                  {discount.description}
                </p>
              </div>
            </div>

            {/* Terms & Conditions Section */}
            <div className="rounded-3xl bg-white border border-[#E7E7EC] p-6 sm:p-8 space-y-4 shadow-xs">
              <h3 className="text-lg font-bold text-[#15151A] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#5B5CE2]" />
                Terms of Redemption
              </h3>

              <ul className="space-y-2.5 text-sm text-[#6F7078]">
                {discount.terms?.map((term, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5B5CE2] shrink-0 mt-2" />
                    <span>{term}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* How to Redeem Step-by-Step */}
            <div className="rounded-3xl bg-white border border-[#E7E7EC] p-6 sm:p-8 space-y-4 shadow-xs">
              <h3 className="text-lg font-bold text-[#15151A] flex items-center gap-2">
                <QrCode className="w-5 h-5 text-[#10B981]" />
                How to Claim in Person
              </h3>

              <div className="space-y-3">
                {discount.redemptionInstructions?.map((inst, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-[#FAF9F6] border border-[#E7E7EC] rounded-2xl">
                    <span className="w-6 h-6 rounded-full bg-[#EEF0FF] text-[#5B5CE2] text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-[#15151A] leading-relaxed">{inst}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col: Venue Info, Trust Meter & Action Box */}
          <div className="space-y-6">
            {/* Primary Action Widget */}
            <div className="rounded-3xl bg-[#12131A] text-white p-6 sm:p-8 border border-[#262738] shadow-2xl space-y-6">
              <div>
                <span className="text-xs font-bold text-[#10B981] uppercase tracking-wider block mb-1">
                  Ready to Redeem?
                </span>
                <div className="text-3xl font-black text-white">{discount.discountDetails}</div>
                <p className="text-xs text-[#8E90A0] mt-1">
                  {discount.bankCard ? `Eligible with ${discount.bankCard}` : discount.studentEligible ? 'Eligible with valid Student ID' : 'Available for all customers'}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <MagneticButton
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={() => setIsRedeemModalOpen(true)}
                  icon={<QrCode className="w-4 h-4" />}
                >
                  Redeem / Use Deal
                </MagneticButton>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${discount.latitude},${discount.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#181924] border border-[#262738] hover:border-[#5B5CE2] text-white font-bold text-sm transition-all"
                >
                  <Navigation className="w-4 h-4 text-[#5B5CE2]" />
                  <span>Get Directions</span>
                </a>
              </div>

              {/* Validity summary */}
              <div className="pt-4 border-t border-[#262738] space-y-2 text-xs text-[#8E90A0]">
                <div className="flex items-center justify-between">
                  <span>Start Date:</span>
                  <span className="text-white font-semibold">{formatDateFriendly(discount.startDate)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Expires:</span>
                  <span className="text-white font-semibold">{formatDateFriendly(discount.endDate)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Status:</span>
                  <span className={isValidNow ? 'text-[#10B981] font-bold' : 'text-red-400 font-bold'}>
                    {discount.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Place Details Card */}
            {place && (
              <div className="rounded-3xl bg-white border border-[#E7E7EC] p-6 space-y-4 shadow-xs">
                <span className="text-xs font-bold text-[#5B5CE2] uppercase tracking-wider block">
                  About the Place
                </span>

                <div>
                  <h3 className="text-xl font-bold text-[#15151A]">{place.name}</h3>
                  <p className="text-xs text-[#6F7078] mt-1">{place.description}</p>
                </div>

                <div className="space-y-2.5 text-xs text-[#6F7078] pt-2 border-t border-[#E7E7EC]">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#5B5CE2] shrink-0 mt-0.5" />
                    <span>{place.address}, {place.area}, {place.city}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#5B5CE2] shrink-0" />
                    <span>Hours: {place.openingHours}</span>
                  </div>

                  {place.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#5B5CE2] shrink-0" />
                      <span>{place.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Trust & Transparency Meter */}
            <div className="rounded-3xl bg-white border border-[#E7E7EC] p-6 space-y-3 shadow-xs">
              <span className="text-xs font-bold text-[#10B981] uppercase tracking-wider block flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                Olato Verification Promise
              </span>

              <div className="flex items-center justify-between">
                <span className="text-xs text-[#6F7078]">Confidence Score</span>
                <span className="text-sm font-black text-[#10B981]">{discount.confidence}%</span>
              </div>

              <div className="h-2 bg-[#E7E7EC] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#5B5CE2] to-[#10B981] rounded-full"
                  style={{ width: `${discount.confidence}%` }}
                />
              </div>

              <p className="text-[11px] text-[#6F7078] leading-relaxed">
                Last checked with the restaurant on <strong>{discount.lastVerifiedDate}</strong>. Olato independently audits offers to eliminate expired codes.
              </p>
            </div>
          </div>
        </div>

        {/* Similar Discounts Section */}
        {similarDiscounts.length > 0 && (
          <div className="pt-12 border-t border-[#E7E7EC] space-y-6">
            <h3 className="text-2xl font-black text-[#15151A] tracking-tight">
              More {categoryLabel} Discounts Near You
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarDiscounts.map((sim) => (
                <DiscountCard key={sim.id} discount={sim} />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Redemption Interactive Modal */}
      {isRedeemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className="relative w-full max-w-md bg-white border border-[#E7E7EC] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#10B981] uppercase tracking-wider">
                In-Venue Redemption
              </span>
              <h3 className="text-xl font-bold text-[#15151A]">{discount.placeName}</h3>
              <p className="text-xs text-[#6F7078]">{discount.offerTitle}</p>
            </div>

            {/* Mock QR / Barcode Card */}
            <div className="p-6 bg-[#FAF9F6] border-2 border-dashed border-[#5B5CE2]/40 rounded-2xl space-y-4">
              <div className="w-36 h-36 mx-auto bg-white p-3 rounded-2xl border border-[#E7E7EC] shadow-xs flex items-center justify-center">
                <QrCode className="w-full h-full text-[#15151A]" />
              </div>
              <div>
                <span className="text-[11px] text-[#6F7078] block">Redemption Pass ID:</span>
                <span className="text-sm font-mono font-bold text-[#5B5CE2]">
                  OLATO-{discount.id.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#E7E7EC] text-xs font-bold text-[#15151A] hover:bg-[#F4F3F0] transition-colors cursor-pointer"
              >
                {copiedCode ? <Check className="w-4 h-4 text-[#10B981]" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCode ? 'Code Copied!' : 'Copy Code'}</span>
              </button>

              <button
                onClick={() => setIsRedeemModalOpen(false)}
                className="px-6 py-2.5 bg-[#5B5CE2] hover:bg-[#4B4CCB] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>

            <p className="text-[11px] text-[#6F7078]">
              Present this screen to the waiter or cashier before billing to have the discount applied to your receipt.
            </p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
