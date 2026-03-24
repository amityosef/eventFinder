export interface User {
  _id: string;
  id?: string;
  email: string;
  fullName: string;
  avatar?: string | null;
  role: 'admin' | 'venueOwner' | 'customer' | 'Admin' | 'Owner' | 'User';
  phone?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface GalleryImage {
  original: string;
  thumbnail?: string;
  medium?: string;
  alt?: string;
}

export interface Location {
  city: string;
  neighborhood?: string;
  region?: string;
  address?: string;
  coordinates?: {
    type?: string;
    coordinates?: [number, number];
    lat?: number;
    lng?: number;
  };
}

// Keep Address for backwards compatibility
export interface Address {
  street?: string;
  city: string;
  area?: string;
  zipCode?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Capacity {
  min: number;
  max: number;
}

export interface Pricing {
  pricePerPerson: number;
  minPrice?: number;
  currency: string;
}

export interface Price {
  amount: number;
  type: 'perPerson' | 'flat' | 'hourly';
  currency: string;
}

export interface Features {
  kosher?: boolean;
  accessibility?: boolean;
  parking?: boolean;
  accommodation?: boolean;
  wifi?: boolean;
  airConditioning?: boolean;
  outdoorArea?: boolean;
  indoorArea?: boolean;
  indoorOutdoor?: 'indoor' | 'outdoor' | 'both';
  djEquipment?: boolean;
  catering?: boolean;
  types?: string[];
}

export interface VenueStats {
  totalViews?: number;
  totalLeads?: number;
  averageRating?: number;
  totalReviews?: number;
}

export interface Contact {
  phone?: string;
  email?: string;
  website?: string;
}

export type VenueType = 'weddingHall' | 'eventGarden' | 'conferenceRoom' | 'privateSalon' | 'restaurant' | 'hotel' | 'hall' | 'garden' | 'beach' | 'villa' | 'rooftop' | 'other';

export interface Venue {
  _id: string;
  id?: string;
  name: string;
  description: string;
  venueType?: VenueType;
  // Support both address and location formats
  address?: Address;
  location?: Location;
  capacity: Capacity;
  // Support both pricing formats
  pricing?: Pricing;
  price?: Price;
  features: Features;
  gallery: (GalleryImage | string)[];
  mainImage?: string;
  owner: User | string;
  contact?: Contact;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  stats?: VenueStats;
  rating?: number;
  reviewCount?: number;
  status?: 'active' | 'inactive' | 'pending';
  isActive?: boolean;
  isFeatured?: boolean;
  kospitoVerified?: boolean;
  kospitoRecommended?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Availability {
  _id: string;
  venueId: string;
  date: string;
  status?: AvailabilityStatus;
  isAvailable: boolean;
  slot: 'morning' | 'evening' | 'fullDay';
  specialPrice?: number;
  notes?: string;
  bookingRef?: string;
  createdAt: string;
  updatedAt: string;
}

export type AvailabilityStatus = 'available' | 'booked' | 'hold';

export interface Lead {
  _id: string;
  venue: string | Venue;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  eventDate?: string;
  guestCount: number;
  eventType: EventType;
  status: LeadStatus;
  notes?: string;
  internalNotes?: string;
  assignedTo?: string | User;
  createdAt: string;
  updatedAt: string;
}

export type EventType =
  | 'wedding'
  | 'barMitzvah'
  | 'batMitzvah'
  | 'birthday'
  | 'corporate'
  | 'engagement'
  | 'anniversary'
  | 'other';

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'negotiating'
  | 'confirmed'
  | 'cancelled'
  | 'completed';

export interface CreateLeadPayload {
  venueId: string;
  customerName: string;
  customerEmail: string;
  phone: string;
  eventDate: string;
  guestsCount: number;
  eventType?: EventType;
  message?: string;
  budget?: string;
  preferredSlot?: string;
}

export interface UpdateLeadPayload {
  status?: LeadStatus;
  internalNotes?: string;
}

export interface SearchParams {
  page?: number;
  limit?: number;
  search?: string;
  city?: string;
  venueType?: string;
  minGuests?: number;
  maxGuests?: number;
  minPrice?: number;
  maxPrice?: number;
  kosher?: boolean;
  owner?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  totalPages: number;
  page: number;
}

export interface VenuesResponse {
  venues: Venue[];
  total: number;
  pages?: number;
  currentPage?: number;
  pagination?: {
    total: number;
    totalPages: number;
    page: number;
    limit: number;
  };
}

export interface LeadsResponse {
  leads: Lead[];
  total?: number;
  pages?: number;
  currentPage?: number;
  pagination?: {
    total: number;
    totalPages: number;
    page: number;
    limit: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
  user: User;
}
