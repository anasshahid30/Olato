import { Place, Discount, SearchFilterParams, OperationalMetrics } from './types';
import { INITIAL_PLACES, INITIAL_DISCOUNTS } from './seed-data';
import { calculateDistance, isOfferValid } from './distance';

const PLACES_STORAGE_KEY = 'olato_places_v1';
const DISCOUNTS_STORAGE_KEY = 'olato_discounts_v1';

class RepositoryService {
  private places: Place[] = [];
  private discounts: Discount[] = [];
  private initialized: boolean = false;

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') {
      this.places = [...INITIAL_PLACES];
      this.discounts = [...INITIAL_DISCOUNTS];
      this.initialized = true;
      return;
    }

    try {
      const storedPlaces = localStorage.getItem(PLACES_STORAGE_KEY);
      const storedDiscounts = localStorage.getItem(DISCOUNTS_STORAGE_KEY);

      if (storedPlaces) {
        this.places = JSON.parse(storedPlaces);
      } else {
        this.places = [...INITIAL_PLACES];
        localStorage.setItem(PLACES_STORAGE_KEY, JSON.stringify(this.places));
      }

      if (storedDiscounts) {
        this.discounts = JSON.parse(storedDiscounts);
      } else {
        this.discounts = [...INITIAL_DISCOUNTS];
        localStorage.setItem(DISCOUNTS_STORAGE_KEY, JSON.stringify(this.discounts));
      }
    } catch (e) {
      console.warn('LocalStorage error, using memory seed:', e);
      this.places = [...INITIAL_PLACES];
      this.discounts = [...INITIAL_DISCOUNTS];
    }

    this.initialized = true;
  }

  private persist() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(PLACES_STORAGE_KEY, JSON.stringify(this.places));
        localStorage.setItem(DISCOUNTS_STORAGE_KEY, JSON.stringify(this.discounts));
      } catch (e) {
        console.error('Failed to save to localStorage:', e);
      }
    }
  }

  // --- PLACES CRUD ---
  public getPlaces(category?: string, featuredOnly?: boolean): Place[] {
    let result = [...this.places];
    if (category && category !== 'ALL') {
      result = result.filter((p) => p.category === category);
    }
    if (featuredOnly) {
      result = result.filter((p) => p.isFeatured);
    }
    return result;
  }

  public getPlaceById(id: string): Place | undefined {
    return this.places.find((p) => p.id === id);
  }

  public savePlace(placeData: Partial<Place> & { name: string; category: Place['category'] }): Place {
    const existingIndex = this.places.findIndex((p) => p.id === placeData.id);
    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      const updated: Place = {
        ...this.places[existingIndex],
        ...placeData,
        updatedAt: now,
      };
      this.places[existingIndex] = updated;
      this.persist();
      return updated;
    } else {
      const newPlace: Place = {
        id: placeData.id || `place-${Date.now()}`,
        name: placeData.name,
        slug: placeData.slug || placeData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: placeData.category,
        description: placeData.description || '',
        address: placeData.address || '',
        city: placeData.city || 'Lahore',
        area: placeData.area || 'Gulberg',
        latitude: placeData.latitude || 31.5204,
        longitude: placeData.longitude || 74.3587,
        phone: placeData.phone || '',
        openingHours: placeData.openingHours || '09:00 AM - 11:00 PM',
        images: placeData.images?.length ? placeData.images : ['https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80'],
        status: placeData.status || 'Active',
        isFeatured: placeData.isFeatured || false,
        rating: placeData.rating || 4.5,
        reviewCount: placeData.reviewCount || 10,
        createdAt: now,
        updatedAt: now,
      };
      this.places.unshift(newPlace);
      this.persist();
      return newPlace;
    }
  }

  public deletePlace(id: string): boolean {
    const lenBefore = this.places.length;
    this.places = this.places.filter((p) => p.id !== id);
    if (this.places.length !== lenBefore) {
      this.persist();
      return true;
    }
    return false;
  }

  // --- DISCOUNTS CRUD & FILTERING ---
  public getDiscounts(
    params: SearchFilterParams = {},
    userLat: number = 31.5204,
    userLng: number = 74.3587
  ): Discount[] {
    let result = this.discounts.map((d) => {
      const distance = calculateDistance(userLat, userLng, d.latitude, d.longitude);
      return { ...d, distance };
    });

    // 1. Text Query Search (place name, offer title, description, bank, details)
    if (params.query && params.query.trim()) {
      const q = params.query.toLowerCase().trim();
      result = result.filter(
        (d) =>
          d.placeName.toLowerCase().includes(q) ||
          d.offerTitle.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          d.discountDetails.toLowerCase().includes(q) ||
          (d.bankCard && d.bankCard.toLowerCase().includes(q))
      );
    }

    // 2. Category Filter (CAFE, RESTAURANT, FEATURED_PLACE)
    if (params.category && params.category !== 'ALL') {
      result = result.filter((d) => d.category === params.category);
    }

    // 3. Distance Filter
    if (params.maxDistance !== undefined && params.maxDistance > 0) {
      result = result.filter((d) => (d.distance ?? 0) <= params.maxDistance!);
    }

    // 4. Min Discount % Filter
    if (params.minDiscount !== undefined && params.minDiscount > 0) {
      result = result.filter((d) => {
        const match = d.discountDetails.match(/(\d+)%/);
        if (match) {
          return parseInt(match[1], 10) >= params.minDiscount!;
        }
        return true; // Keep non-percentage (like BOGO) unless strict
      });
    }

    // 5. Valid Today Filter
    if (params.validToday) {
      result = result.filter((d) => isOfferValid(d.startDate, d.endDate) && d.status === 'Active');
    }

    // 6. Verified Only Filter
    if (params.verifiedOnly) {
      result = result.filter((d) => d.confidence >= 90);
    }

    // 7. Student Only Filter
    if (params.studentOnly) {
      result = result.filter((d) => d.studentEligible);
    }

    // 8. Bank/Card Filter
    if (params.bankCard) {
      result = result.filter(
        (d) =>
          d.bankCard &&
          (d.bankCard.toLowerCase().includes(params.bankCard!.toLowerCase()) ||
            d.bankCard === 'All Cards')
      );
    }

    // 9. Sorting
    if (params.sortBy) {
      switch (params.sortBy) {
        case 'nearest':
          result.sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
          break;
        case 'highest_discount':
          result.sort((a, b) => {
            const percA = parseInt(a.discountDetails.match(/(\d+)%/)?.[1] || '0', 10);
            const percB = parseInt(b.discountDetails.match(/(\d+)%/)?.[1] || '0', 10);
            return percB - percA;
          });
          break;
        case 'ending_soon':
          result.sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());
          break;
        case 'relevant':
        default:
          result.sort((a, b) => b.confidence - a.confidence);
          break;
      }
    }

    return result;
  }

  public getDiscountById(id: string, userLat: number = 31.5204, userLng: number = 74.3587): Discount | undefined {
    const d = this.discounts.find((item) => item.id === id);
    if (!d) return undefined;
    const distance = calculateDistance(userLat, userLng, d.latitude, d.longitude);
    return { ...d, distance };
  }

  public saveDiscount(discountData: Partial<Discount> & { placeId: string; offerTitle: string }): Discount {
    const existingIndex = this.discounts.findIndex((d) => d.id === discountData.id);
    const now = new Date().toISOString();

    const targetPlace = this.getPlaceById(discountData.placeId);
    const placeName = targetPlace ? targetPlace.name : discountData.placeName || 'Partner Merchant';
    const category = targetPlace ? targetPlace.category : discountData.category || 'CAFE';
    const latitude = targetPlace ? targetPlace.latitude : discountData.latitude || 31.5204;
    const longitude = targetPlace ? targetPlace.longitude : discountData.longitude || 74.3587;

    if (existingIndex >= 0) {
      const updated: Discount = {
        ...this.discounts[existingIndex],
        ...discountData,
        placeName,
        category,
        latitude,
        longitude,
        updatedAt: now,
      };
      this.discounts[existingIndex] = updated;
      this.persist();
      return updated;
    } else {
      const newDiscount: Discount = {
        id: discountData.id || `disc-${Date.now()}`,
        placeId: discountData.placeId,
        placeName,
        category,
        bankCard: discountData.bankCard || 'All Cards',
        studentEligible: discountData.studentEligible ?? false,
        discountDetails: discountData.discountDetails || '20% OFF',
        offerTitle: discountData.offerTitle,
        description: discountData.description || 'Special promotional discount for Olato members.',
        terms: discountData.terms || ['Show offer screen before ordering.', 'Cannot combine with other promos.'],
        redemptionInstructions: discountData.redemptionInstructions || ['Show offer badge to server upon billing.'],
        startDate: discountData.startDate || new Date().toISOString().split('T')[0],
        endDate: discountData.endDate || '2026-12-31',
        status: discountData.status || 'Active',
        lastVerifiedDate: now,
        confidence: discountData.confidence ?? 95,
        image: discountData.image || (targetPlace?.images[0] ?? 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80'),
        latitude,
        longitude,
        createdAt: now,
        updatedAt: now,
      };
      this.discounts.unshift(newDiscount);
      this.persist();
      return newDiscount;
    }
  }

  public deleteDiscount(id: string): boolean {
    const lenBefore = this.discounts.length;
    this.discounts = this.discounts.filter((d) => d.id !== id);
    if (this.discounts.length !== lenBefore) {
      this.persist();
      return true;
    }
    return false;
  }

  public verifyDiscount(id: string, status: Discount['status'] = 'Active', confidence: number = 99): Discount | undefined {
    const d = this.discounts.find((item) => item.id === id);
    if (!d) return undefined;

    const now = new Date().toISOString();
    d.status = status;
    d.confidence = confidence;
    d.lastVerifiedDate = now;
    d.updatedAt = now;

    this.persist();
    return d;
  }

  // --- OPERATIONAL METRICS ---
  public getOperationalMetrics(): OperationalMetrics {
    const active = this.discounts.filter((d) => d.status === 'Active');
    const pending = this.discounts.filter((d) => d.status === 'Pending Verification');
    const placesCount = this.places.length;
    const featuredPlaces = this.places.filter((p) => p.isFeatured).length;

    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const expiringSoon = active.filter((d) => {
      const end = new Date(d.endDate);
      return end > now && end <= sevenDaysFromNow;
    }).length;

    const verifiedCount = active.filter((d) => d.confidence >= 90).length;
    const verificationHealthRate = active.length > 0 ? Math.round((verifiedCount / active.length) * 100) : 100;

    return {
      totalActiveDiscounts: active.length,
      expiringSoonCount: expiringSoon,
      pendingVerificationCount: pending.length,
      totalPlaces: placesCount,
      featuredPlacesCount: featuredPlaces,
      verificationHealthRate,
    };
  }

  public resetToDefaultSeed() {
    this.places = [...INITIAL_PLACES];
    this.discounts = [...INITIAL_DISCOUNTS];
    this.persist();
  }
}

export const repository = new RepositoryService();
