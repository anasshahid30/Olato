import { Place, Discount, SearchFilterParams, OperationalMetrics, CategoryType } from './types';
import { INITIAL_PLACES, INITIAL_DISCOUNTS } from './seed-data';
import { calculateDistance, isOfferValid } from './distance';
import { supabase } from '@/lib/supabase/client';

const PLACES_STORAGE_KEY = 'olato_places_v2';
const DISCOUNTS_STORAGE_KEY = 'olato_discounts_v2';

// Unsplash curated photography for Lahore dining categories
const CAFE_IMAGES = [
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=80',
];

const RESTAURANT_IMAGES = [
  'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1000&q=80',
];

const DESI_IMAGES = [
  'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1606471191009-63994c53433b?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1000&q=80',
];

/**
 * Parses PostGIS EWKB geometry hex point to { latitude, longitude }
 */
export function parsePostgisPoint(hex: unknown): { latitude: number; longitude: number } {
  if (!hex || typeof hex !== 'string') return { latitude: 31.5204, longitude: 74.3587 };
  try {
    const bytes = new Uint8Array(hex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));
    const view = new DataView(bytes.buffer);
    // Standard PostGIS 2D Point with SRID: bytes 9..17 = lng, 17..25 = lat (little endian)
    const lng = view.getFloat64(9, true);
    const lat = view.getFloat64(17, true);
    if (isNaN(lat) || isNaN(lng)) return { latitude: 31.5204, longitude: 74.3587 };
    return { latitude: lat, longitude: lng };
  } catch {
    return { latitude: 31.5204, longitude: 74.3587 };
  }
}

function getImageForPlace(id: number | string, category: CategoryType, slug?: string): string[] {
  const num = typeof id === 'number' ? id : parseInt(String(id).replace(/\D/g, '')) || 1;
  if (category === 'CAFE') {
    return [CAFE_IMAGES[num % CAFE_IMAGES.length]];
  }
  if (
    slug?.includes('karahi') ||
    slug?.includes('nihari') ||
    slug?.includes('biryani') ||
    slug?.includes('desi') ||
    slug?.includes('shinwari') ||
    slug?.includes('haveli') ||
    slug?.includes('bundu') ||
    slug?.includes('tonight')
  ) {
    return [DESI_IMAGES[num % DESI_IMAGES.length]];
  }
  return [RESTAURANT_IMAGES[num % RESTAURANT_IMAGES.length]];
}

function mapCategory(slug?: string, placeId?: number): CategoryType {
  if (slug === 'cafe') return 'CAFE';
  if (slug === 'continental-international') return 'RESTAURANT';
  if (slug === 'desi-pakistani') {
    if (placeId && [61, 62, 63, 64].includes(placeId)) return 'FEATURED_PLACE';
    return 'RESTAURANT';
  }
  if (placeId && placeId >= 41 && placeId <= 60) return 'CAFE';
  return 'RESTAURANT';
}

class RepositoryService {
  private places: Place[] = [];
  private discounts: Discount[] = [];
  private initialized: boolean = false;
  private listeners: Set<() => void> = new Set();
  public isSyncing: boolean = false;
  public lastSyncedAt: Date | null = null;

  constructor() {
    this.init();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('Error notifying repository subscriber:', err);
      }
    });
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

      if (storedPlaces && storedDiscounts) {
        this.places = JSON.parse(storedPlaces);
        this.discounts = JSON.parse(storedDiscounts);
      } else {
        this.places = [...INITIAL_PLACES];
        this.discounts = [...INITIAL_DISCOUNTS];
      }
    } catch (e) {
      console.warn('LocalStorage error, using memory seed:', e);
      this.places = [...INITIAL_PLACES];
      this.discounts = [...INITIAL_DISCOUNTS];
    }

    this.initialized = true;

    // Automatically trigger live fetch from Supabase on client boot
    this.syncFromSupabase();
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

  /**
   * Fetches fresh live data from Supabase PostgreSQL tables
   */
  public async syncFromSupabase(): Promise<boolean> {
    if (this.isSyncing) return false;
    this.isSyncing = true;

    try {
      // 1. Fetch places with joined categories
      const { data: rawPlaces, error: placesError } = await supabase
        .from('places')
        .select('*, place_categories(category_id, categories(slug, name))')
        .order('id', { ascending: true });

      if (placesError) {
        console.warn('⚠️ Supabase places fetch failed, using cached data:', placesError.message);
        this.isSyncing = false;
        return false;
      }

      // 2. Fetch discounts with joined place & provider
      const { data: rawDiscounts, error: discountsError } = await supabase
        .from('discounts')
        .select('*, places(id, name, slug, location, place_categories(categories(slug))), discount_providers(name, slug)')
        .order('id', { ascending: true });

      if (discountsError) {
        console.warn('⚠️ Supabase discounts fetch failed, using cached data:', discountsError.message);
        this.isSyncing = false;
        return false;
      }

      if (rawPlaces && rawPlaces.length > 0) {
        this.places = rawPlaces.map((p) => {
          const categorySlug = p.place_categories?.[0]?.categories?.slug;
          const category = mapCategory(categorySlug, p.id);
          const coords = parsePostgisPoint(p.location);
          const images = getImageForPlace(p.id, category, p.slug);

          return {
            id: `place-${p.id}`,
            name: p.name,
            slug: p.slug,
            category,
            description: p.description || p.why_this_spot_is_good || '',
            address: p.address,
            city: p.city || 'Lahore',
            area: p.area || 'Gulberg',
            latitude: coords.latitude,
            longitude: coords.longitude,
            phone: p.phone || '',
            openingHours: p.opening_hours || '12:00 PM - 12:00 AM',
            images,
            status: p.status === 'active' ? 'Active' : 'Inactive',
            isFeatured: [1, 2, 7, 10, 41, 50, 61, 62].includes(p.id),
            rating: 4.5 + ((p.id % 5) * 0.1),
            reviewCount: 50 + ((p.id * 13) % 450),
            createdAt: p.created_at || new Date().toISOString(),
            updatedAt: p.updated_at || new Date().toISOString(),
          };
        });
      }

      if (rawDiscounts && rawDiscounts.length > 0) {
        this.discounts = rawDiscounts.map((d) => {
          const placeCoords = parsePostgisPoint(d.places?.location);
          const categorySlug = d.places?.place_categories?.[0]?.categories?.slug;
          const category = mapCategory(categorySlug, d.place_id);
          const images = getImageForPlace(d.place_id, category, d.places?.slug);

          return {
            id: `disc-${d.id}`,
            placeId: `place-${d.place_id}`,
            placeName: d.places?.name || 'Local Favorite',
            category,
            bankCard: d.bank_card || d.discount_providers?.name || 'All Cards',
            studentEligible: Boolean(d.is_student_eligible),
            discountDetails: d.discount_type === 'percentage' ? `${d.discount_value}% OFF` : 'SPECIAL OFFER',
            offerTitle: d.title,
            description: d.details || `${d.discount_value}% discount on menu items.`,
            terms: Array.isArray(d.terms) ? d.terms : ['Show offer badge before payment.'],
            redemptionInstructions: Array.isArray(d.redemption_instructions)
              ? d.redemption_instructions
              : ['Present card or voucher at billing.'],
            startDate: d.start_date || '2026-09-01',
            endDate: d.end_date || '2027-12-31',
            status: d.is_active ? 'Active' : 'Inactive',
            lastVerifiedDate: d.last_verified_at || d.created_at || new Date().toISOString(),
            confidence: 95 + ((d.id % 5)),
            image: images[0],
            latitude: placeCoords.latitude,
            longitude: placeCoords.longitude,
            createdAt: d.created_at || new Date().toISOString(),
            updatedAt: d.updated_at || new Date().toISOString(),
          };
        });
      }

      this.lastSyncedAt = new Date();
      this.persist();
      this.notify();
      this.isSyncing = false;
      return true;
    } catch (err) {
      console.error('Error during Supabase sync:', err);
      this.isSyncing = false;
      return false;
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
    return this.places.find((p) => p.id === id || p.id === `place-${id}`);
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
      this.notify();
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
        images: placeData.images?.length
          ? placeData.images
          : ['https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80'],
        status: placeData.status || 'Active',
        isFeatured: placeData.isFeatured || false,
        rating: placeData.rating || 4.5,
        reviewCount: placeData.reviewCount || 10,
        createdAt: now,
        updatedAt: now,
      };
      this.places.unshift(newPlace);
      this.persist();
      this.notify();
      return newPlace;
    }
  }

  public deletePlace(id: string): boolean {
    const lenBefore = this.places.length;
    this.places = this.places.filter((p) => p.id !== id && p.id !== `place-${id}`);
    if (this.places.length !== lenBefore) {
      this.persist();
      this.notify();
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

    // 4. Minimum Discount Percentage Filter
    if (params.minDiscount !== undefined && params.minDiscount > 0) {
      result = result.filter((d) => {
        const match = d.discountDetails.match(/(\d+)%/);
        if (match) {
          const val = parseInt(match[1], 10);
          return val >= params.minDiscount!;
        }
        return false;
      });
    }

    // 5. Bank Card Filter
    if (params.bankCard && params.bankCard !== 'ALL') {
      const cardNeedle = params.bankCard.toLowerCase();
      result = result.filter((d) => {
        if (!d.bankCard) return false;
        const b = d.bankCard.toLowerCase();
        return b.includes(cardNeedle) || b.includes('all cards') || cardNeedle === 'all';
      });
    }

    // 6. Student Only Filter
    if (params.studentOnly) {
      result = result.filter((d) => d.studentEligible);
    }

    // 7. Verified Only (High Confidence >= 90)
    if (params.verifiedOnly) {
      result = result.filter((d) => d.confidence >= 90 && d.status === 'Active');
    }

    // 8. Valid Today Filter
    if (params.validToday) {
      result = result.filter((d) => isOfferValid(d.startDate, d.endDate) && d.status === 'Active');
    }

    // 9. Sorting
    switch (params.sortBy) {
      case 'nearest':
        result.sort((a, b) => (a.distance ?? 999) - (b.distance ?? 999));
        break;
      case 'highest_discount':
        result.sort((a, b) => {
          const valA = parseInt(a.discountDetails.match(/(\d+)%/)?.[1] || '0', 10);
          const valB = parseInt(b.discountDetails.match(/(\d+)%/)?.[1] || '0', 10);
          return valB - valA;
        });
        break;
      case 'ending_soon':
        result.sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());
        break;
      case 'relevant':
      default:
        result.sort((a, b) => {
          if (b.confidence !== a.confidence) {
            return b.confidence - a.confidence;
          }
          return (a.distance ?? 0) - (b.distance ?? 0);
        });
        break;
    }

    return result;
  }

  public getDiscountById(id: string): Discount | undefined {
    return this.discounts.find((d) => d.id === id || d.id === `disc-${id}`);
  }

  public saveDiscount(
    discountData: Partial<Discount> & {
      placeId: string;
      offerTitle: string;
      category?: CategoryType;
    }
  ): Discount {
    const existingIndex = this.discounts.findIndex((d) => d.id === discountData.id);
    const now = new Date().toISOString();

    const targetPlace = this.getPlaceById(discountData.placeId);
    const placeName = targetPlace?.name || discountData.placeName || 'Unknown Venue';
    const latitude = targetPlace?.latitude ?? discountData.latitude ?? 31.5204;
    const longitude = targetPlace?.longitude ?? discountData.longitude ?? 74.3587;
    const category = discountData.category || targetPlace?.category || 'CAFE';

    if (existingIndex >= 0) {
      const updated: Discount = {
        ...this.discounts[existingIndex],
        ...discountData,
        placeName,
        latitude,
        longitude,
        category,
        updatedAt: now,
      };
      this.discounts[existingIndex] = updated;
      this.persist();
      this.notify();
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
        endDate: discountData.endDate || '2027-12-31',
        status: discountData.status || 'Active',
        lastVerifiedDate: now,
        confidence: discountData.confidence ?? 95,
        image:
          discountData.image ||
          targetPlace?.images[0] ||
          'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80',
        latitude,
        longitude,
        createdAt: now,
        updatedAt: now,
      };
      this.discounts.unshift(newDiscount);
      this.persist();
      this.notify();
      return newDiscount;
    }
  }

  public deleteDiscount(id: string): boolean {
    const lenBefore = this.discounts.length;
    this.discounts = this.discounts.filter((d) => d.id !== id && d.id !== `disc-${id}`);
    if (this.discounts.length !== lenBefore) {
      this.persist();
      this.notify();
      return true;
    }
    return false;
  }

  public verifyDiscount(
    id: string,
    status: Discount['status'] = 'Active',
    confidence: number = 99
  ): Discount | undefined {
    const d = this.discounts.find((item) => item.id === id || item.id === `disc-${id}`);
    if (!d) return undefined;

    const now = new Date().toISOString();
    d.status = status;
    d.confidence = confidence;
    d.lastVerifiedDate = now;
    d.updatedAt = now;

    this.persist();
    this.notify();
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
    this.notify();
  }
}

export const repository = new RepositoryService();
