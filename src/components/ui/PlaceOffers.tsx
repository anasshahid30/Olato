'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, CreditCard } from 'lucide-react';
import { Modal } from './Modal';
import { Discount } from '@/lib/types';
import { SaveButton } from './SaveButton';

export function PlaceOffers({ discount }: { discount: Discount }) {
  const [isOpen, setIsOpen] = useState(false);
  if (!discount.offers || discount.offers.length < 2) return null;
  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
        className="my-2 flex w-full items-center gap-2 rounded-lg bg-[#EEF0FF]/60 px-3 py-2 text-xs font-semibold text-[#5B5CE2] hover:bg-[#EEF0FF] transition-colors focus-visible:outline-2 focus-visible:outline-[#5B5CE2]"
      >
        <CreditCard className="h-3.5 w-3.5 shrink-0" />
        <span className="flex-1 text-left">Available offers ({discount.offers.length})</span>
        <ChevronRight className="h-3.5 w-3.5 shrink-0" />
      </button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={discount.placeName}>
        <p className="mb-3 text-xs text-[#6F7078]">Choose an offer to view its eligibility and terms.</p>
        <div className="divide-y divide-[#E7E7EC]">
        {discount.offers.map((offer) => (
          <div key={offer.id} className="flex items-center gap-3 py-3">
            <Link href={`/discounts/${offer.id}`} onClick={() => setIsOpen(false)} className="flex flex-1 min-w-0 items-center gap-3 text-xs hover:text-[#5B5CE2]">
              <span className="shrink-0 rounded-lg bg-[#EEF0FF] px-2 py-2 font-bold text-[#5B5CE2]">{offer.discountDetails}</span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">{offer.bankCard || (offer.studentEligible ? 'Student offer' : 'General offer')}</span>
                <span className="block mt-1 text-[#6F7078] line-clamp-2">{offer.offerTitle}</span>
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-[#6F7078]" />
            </Link>
            <SaveButton discountId={offer.id} size="sm" />
          </div>
        ))}
        </div>
      </Modal>
    </>
  );
}
