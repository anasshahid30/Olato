import { Discount } from './types';

// Group by venue identity, preserving filter results and their sorted order.
export function groupDiscounts(discounts: Discount[]): Discount[] {
  const places = new Map<string, Discount>();
  for (const discount of discounts) {
    const key = discount.placeId || `${discount.placeName}:${discount.latitude}:${discount.longitude}`;
    const existing = places.get(key);
    if (existing) {
      if (!existing.offers!.some((offer) => offer.id === discount.id)) existing.offers!.push(discount);
    } else {
      places.set(key, { ...discount, offers: [discount] });
    }
  }
  return [...places.values()];
}
