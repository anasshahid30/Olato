export type CategoryType = 'CAFE' | 'RESTAURANT' | 'FEATURED_PLACE';

export type DiscountStatus = 'Active' | 'Expired' | 'Inactive' | 'Pending Verification';

export type UserRole = 'USER' | 'ADMIN';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface CityHub {
  id: string;
  name: string;
  area: string;
  city: string;
  latitude: number;
  longitude: number;
}

export interface Place {
  id: string;
  name: string;
  slug: string;
  category: CategoryType;
  description: string;
  address: string;
  city: string;
  area: string;
  latitude: number;
  longitude: number;
  phone: string;
  openingHours: string;
  images: string[];
  status: 'Active' | 'Inactive';
  isFeatured: boolean;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Discount {
  id: string;
  placeId: string;
  placeName: string;
  category: CategoryType;
  bankCard?: string; // e.g. "ABC Bank Visa", "XYZ Bank Mastercard", "All Cards"
  studentEligible: boolean;
  discountDetails: string; // e.g., "25% OFF", "BOGO", "30% OFF"
  offerTitle: string;
  description: string;
  terms: string[];
  redemptionInstructions: string[];
  startDate: string;
  endDate: string;
  status: DiscountStatus;
  lastVerifiedDate: string; // ISO string or human formatted date
  confidence: number; // 0 to 100 percentage
  image: string;
  latitude: number;
  longitude: number;
  distance?: number; // Calculated dynamically relative to user coordinates (in km)
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  studentVerified: boolean;
  preferredLocation: string;
  savedDiscountIds: string[];
  createdAt: string;
}

export interface SearchFilterParams {
  query?: string;
  category?: CategoryType | 'ALL';
  maxDistance?: number; // in km
  minDiscount?: number; // percentage
  openNow?: boolean;
  validToday?: boolean;
  verifiedOnly?: boolean;
  studentOnly?: boolean;
  bankCard?: string;
  sortBy?: 'relevant' | 'nearest' | 'highest_discount' | 'ending_soon';
}

export interface OperationalMetrics {
  totalActiveDiscounts: number;
  expiringSoonCount: number;
  pendingVerificationCount: number;
  totalPlaces: number;
  featuredPlacesCount: number;
  verificationHealthRate: number; // percentage
}

export interface AIParseResult {
  category?: CategoryType | 'ALL';
  query?: string;
  minDiscount?: number;
  validToday?: boolean;
  verifiedOnly?: boolean;
  studentOnly?: boolean;
  locationArea?: string;
  summaryReasoning: string;
}
