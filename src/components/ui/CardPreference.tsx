'use client';

import { useId, useSyncExternalStore } from 'react';
import { CreditCard } from 'lucide-react';
import { repository } from '@/lib/repository';
import { useCardPreference } from '@/hooks/useCardPreference';

function availableCards() {
  return [...new Set(repository.getDiscounts({}).map((offer) => offer.bankCard).filter((card): card is string => Boolean(card) && card !== 'All Cards'))].sort();
}

const subscribeToCards = (listener: () => void) => repository.subscribe(listener);
const getCardsSnapshot = () => JSON.stringify(availableCards());
const getServerCardsSnapshot = () => '[]';

export function CardPreference({ value, onChange }: { value?: string; onChange?: (card: string) => void }) {
  const { cardPreference, setCardPreference } = useCardPreference();
  // Use the same empty snapshot on the server and during browser hydration.
  const cards = JSON.parse(useSyncExternalStore(subscribeToCards, getCardsSnapshot, getServerCardsSnapshot)) as string[];
  const id = useId();
  const selected = value ?? cardPreference;
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-[#E7E7EC] bg-[#FAF9F6] px-4 py-3">
      <label htmlFor={id} className="flex items-center gap-2 text-sm font-semibold text-[#15151A]">
        <CreditCard className="h-4 w-4 text-[#5B5CE2]" /> My card
      </label>
      <select id={id} value={selected} onChange={(event) => {
        setCardPreference(event.target.value);
        onChange?.(event.target.value);
      }} className="min-w-0 max-w-full rounded-lg border border-[#E7E7EC] bg-white px-3 py-2 text-xs font-semibold text-[#5B5CE2] focus-visible:outline-2 focus-visible:outline-[#5B5CE2]">
        <option value="">All cards</option>
        {selected && !cards.includes(selected) && <option value={selected}>{selected}</option>}
        {cards.map((card) => <option key={card} value={card}>{card}</option>)}
      </select>
      <span className="text-xs text-[#6F7078]">{selected ? 'Showing offers for your card, including offers valid on all cards.' : 'Choose your card to find offers you can use.'}</span>
    </div>
  );
}
