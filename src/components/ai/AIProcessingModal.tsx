'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { parseNaturalLanguageQuery } from '@/lib/ai-service';
import { repository } from '@/lib/repository';
import { Discount, AIParseResult } from '@/lib/types';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { DiscountBadge } from '@/components/ui/DiscountBadge';
import { VerificationBadge } from '@/components/ui/VerificationBadge';
import { SaveButton } from '@/components/ui/SaveButton';
import { formatDistance } from '@/lib/distance';
import { Sparkles, CheckCircle2, Bot, MapPin, Coffee, UtensilsCrossed, Star, ArrowRight, X, CreditCard, GraduationCap } from 'lucide-react';

interface AIProcessingModalProps {
  userPrompt: string;
  onClose: () => void;
}

export function AIProcessingModal({ userPrompt, onClose }: AIProcessingModalProps) {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [parsedResult, setParsedResult] = useState<AIParseResult | null>(null);
  const [matchedDeals, setMatchedDeals] = useState<Discount[]>([]);

  const processingSteps = [
    'Interpreting your search request...',
    'Mapping category intent (Café, Restaurant, Selected Place)...',
    'Filtering active bank card & student eligibility...',
    'Locating verified active deals near you...',
  ];

  useEffect(() => {
    // Step progression animation timer
    const stepInterval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev < processingSteps.length - 1) return prev + 1;
        return prev;
      });
    }, 350);

    // Parse natural query and match discounts
    parseNaturalLanguageQuery(userPrompt).then((parsed) => {
      setParsedResult(parsed);

      const discounts = repository.getDiscounts({
        query: parsed.query,
        category: parsed.category,
        minDiscount: parsed.minDiscount,
        validToday: parsed.validToday,
        verifiedOnly: parsed.verifiedOnly,
        studentOnly: parsed.studentOnly,
      });

      setMatchedDeals(discounts);
    });

    return () => clearInterval(stepInterval);
  }, [userPrompt]);

  const handleViewAllInSearch = () => {
    if (!parsedResult) return;
    const params = new URLSearchParams();
    if (parsedResult.query) params.set('q', parsedResult.query);
    if (parsedResult.category && parsedResult.category !== 'ALL') params.set('cat', parsedResult.category);
    if (parsedResult.minDiscount) params.set('minDisc', parsedResult.minDiscount.toString());
    if (parsedResult.validToday) params.set('validToday', 'true');
    if (parsedResult.verifiedOnly) params.set('verifiedOnly', 'true');
    if (parsedResult.studentOnly) params.set('studentOnly', 'true');

    onClose();
    router.push(`/search?${params.toString()}`);
  };

  const categoryIcon = (cat?: string) => {
    switch (cat) {
      case 'CAFE':
        return <Coffee className="w-4 h-4 text-[#5B5CE2]" />;
      case 'RESTAURANT':
        return <UtensilsCrossed className="w-4 h-4 text-[#5B5CE2]" />;
      default:
        return <Star className="w-4 h-4 text-[#5B5CE2]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-2xl bg-white border border-[#E7E7EC] rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gradient bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#5B5CE2] via-[#10B981] to-[#5B5CE2]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#6F7078] hover:text-[#15151A] hover:bg-[#F4F3F0] rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* PROCESSING STATE */}
        {!parsedResult || stepIndex < processingSteps.length - 1 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
            <div className="relative flex items-center justify-center">
              <div className="w-20 h-20 rounded-full border-3 border-[#5B5CE2]/20 border-t-[#5B5CE2] animate-spin" />
              <div className="absolute p-4 bg-[#5B5CE2]/10 rounded-full text-[#5B5CE2]">
                <Bot className="w-8 h-8 animate-pulse" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-[#15151A]">Olato AI Discovery</h3>
              <p className="text-sm text-[#5B5CE2] font-semibold animate-pulse">
                {processingSteps[stepIndex]}
              </p>
            </div>

            {/* Progress indicators */}
            <div className="flex items-center gap-2 pt-2">
              {processingSteps.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx <= stepIndex ? 'w-8 bg-[#5B5CE2]' : 'w-2 bg-[#E7E7EC]'
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          /* RESULT DISCOUNTS VIEW */
          <div className="space-y-5 animate-fade-in max-h-[80vh] overflow-y-auto pr-1">
            {/* Header & Interpretation */}
            <div>
              <span className="text-xs font-bold text-[#10B981] uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                Understood & Filtered by Olato
              </span>
              <h3 className="text-xl font-bold text-[#15151A]">
                {parsedResult.summaryReasoning || `Matched Deals for "${userPrompt}"`}
              </h3>
            </div>

            {/* Interpreted Filter Parameters */}
            <div className="flex flex-wrap items-center gap-2 p-3.5 bg-[#FAF9F6] border border-[#E7E7EC] rounded-2xl text-xs font-semibold text-[#15151A]">
              <span className="text-[#6F7078] text-[11px] uppercase tracking-wider font-bold">Interpreted:</span>
              
              <div className="flex items-center gap-1 px-2.5 py-1 bg-white border border-[#E7E7EC] rounded-xl shadow-xs">
                {categoryIcon(parsedResult.category)}
                <span>{parsedResult.category === 'ALL' ? 'All Places' : parsedResult.category === 'CAFE' ? 'Café' : parsedResult.category === 'RESTAURANT' ? 'Restaurant' : 'Selected Place'}</span>
              </div>

              {parsedResult.minDiscount && (
                <div className="px-2.5 py-1 bg-[#EEF0FF] text-[#5B5CE2] font-bold rounded-xl border border-[#5B5CE2]/20">
                  {parsedResult.minDiscount}%+ Discount
                </div>
              )}

              {parsedResult.studentOnly && (
                <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-xl border border-emerald-200">
                  <GraduationCap className="w-3.5 h-3.5" />
                  Student Discount
                </div>
              )}

              {parsedResult.validToday && (
                <div className="px-2.5 py-1 bg-amber-50 text-amber-700 font-bold rounded-xl border border-amber-200">
                  Valid Today
                </div>
              )}

              <div className="flex items-center gap-1 px-2.5 py-1 bg-white border border-[#E7E7EC] rounded-xl text-[#6F7078]">
                <MapPin className="w-3.5 h-3.5 text-[#5B5CE2]" />
                {parsedResult.locationArea ? parsedResult.locationArea : 'Nearby'}
              </div>
            </div>

            {/* Matched Deals List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-[#6F7078] uppercase tracking-wider">
                <span>Top Matches ({matchedDeals.length})</span>
                <span>Verified Deals</span>
              </div>

              {matchedDeals.length === 0 ? (
                <div className="p-8 text-center bg-[#FAF9F6] border border-[#E7E7EC] rounded-2xl space-y-2">
                  <p className="text-sm font-semibold text-[#15151A]">No direct matches for this specific prompt</p>
                  <p className="text-xs text-[#6F7078]">Try searching for "Coffee in Gulberg" or "Restaurants with 20% discount".</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {matchedDeals.slice(0, 3).map((deal) => (
                    <div
                      key={deal.id}
                      className="p-3.5 bg-white border border-[#E7E7EC] hover:border-[#5B5CE2]/40 rounded-2xl flex items-center justify-between gap-4 transition-all shadow-xs hover:shadow-md"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <img
                          src={deal.image}
                          alt={deal.placeName}
                          className="w-14 h-14 rounded-xl object-cover shrink-0 bg-[#F4F3F0]"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[11px] font-bold text-[#5B5CE2] uppercase tracking-wider">
                              {deal.category === 'CAFE' ? 'Café' : deal.category === 'RESTAURANT' ? 'Restaurant' : 'Selected Place'}
                            </span>
                            <span className="text-[11px] text-[#6F7078] flex items-center gap-0.5">
                              <MapPin className="w-3 h-3 text-[#5B5CE2]" />
                              {deal.distance !== undefined ? formatDistance(deal.distance) : 'Nearby'}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-[#15151A] truncate">{deal.placeName}</h4>
                          <p className="text-xs text-[#6F7078] truncate">{deal.offerTitle}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        <DiscountBadge details={deal.discountDetails} size="sm" />
                        <Link
                          href={`/discounts/${deal.id}`}
                          onClick={onClose}
                          className="px-3 py-1.5 bg-[#EEF0FF] hover:bg-[#5B5CE2] text-[#5B5CE2] hover:text-white rounded-xl text-xs font-bold transition-colors"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#E7E7EC]">
              <span className="text-xs text-[#6F7078]">
                Olato monitors and manually verifies all listed discounts.
              </span>
              <MagneticButton
                variant="primary"
                size="sm"
                onClick={handleViewAllInSearch}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                View in Search ({matchedDeals.length})
              </MagneticButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
