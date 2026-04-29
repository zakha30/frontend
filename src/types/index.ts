// ── Auth ──────────────────────────────────────────────────────────────────────

export interface LoginDto {
  email: string;
  password: string;
  tenantSlug: string;
}

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  tenantName: string;
  tenantSlug: string;
  planId: string;
}

export interface UserDto {
  id: string;
  tenantId: string;
  fullName: string;
  email: string;
  role: string;
}

export interface TokenResponseDto {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  user: UserDto;
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export interface DashboardSummaryDto {
  totalListings: number;
  activeListings: number;
  totalQuotesSubmitted: number;
  pendingQuotesSubmitted: number;
  totalQuotesReceived: number;
  pendingQuotesReceived: number;
  acceptedQuotesReceived: number;
  totalRevenueFromAcceptedQuotes: number;
}

export interface MyListingDto {
  id: string;
  title: string;
  locationFrom: string;
  locationTo: string;
  type: ListingType;
  price: number;
  currency: string;
  status: ListingStatus;
  totalQuotes: number;
  pendingQuotes: number;
  hasAcceptedQuote: boolean;
  expiresAt?: string;
  createdAt: string;
}

export interface MyListingsResponseDto {
  items: MyListingDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface MyQuoteDto {
  id: string;
  listingId: string;
  listingTitle: string;
  locationFrom: string;
  locationTo: string;
  myPrice: number;
  currency: string;
  message: string;
  status: QuoteStatus;
  rejectionReason?: string;
  validUntil?: string;
  createdAt: string;
}

export interface MyQuotesResponseDto {
  items: MyQuoteDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ReceivedQuoteDto {
  id: string;
  listingId: string;
  listingTitle: string;
  locationFrom?: string;
  locationTo?: string;
  transporterId: string;
  transporterName: string;
  transporterEmail: string;
  price: number;
  currency: string;
  message: string;
  status: QuoteStatus;
  rejectionReason?: string;
  validUntil?: string;
  acceptedAt?: string;
  rejectedAt?: string;
  createdAt: string;
}

export interface ReceivedQuotesResponseDto {
  items: ReceivedQuoteDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ── Listings ──────────────────────────────────────────────────────────────────

export type ListingType = 'FreightOffer' | 'FreightRequest' | 'VehicleHire';
export type ListingStatus = 'Draft' | 'Active' | 'Expired' | 'Closed' | 'Cancelled';

export interface ListingResponseDto {
  id: string;
  tenantId: string;
  userId: string;
  title: string;
  description?: string;
  type: ListingType;
  typeLabel: string;
  locationFrom: string;
  locationTo: string;
  price: number;
  currency: string;
  status: ListingStatus;
  statusLabel: string;
  weightKg?: number;
  volumeM3?: number;
  cargoType?: string;
  availableFrom?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateListingDto {
  title: string;
  description?: string;
  type: ListingType;
  locationFrom: string;
  locationTo: string;
  price: number;
  currency?: string;
  weightKg?: number;
  volumeM3?: number;
  cargoType?: string;
  availableFrom?: string;
  expiresAt?: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ── Quotes ────────────────────────────────────────────────────────────────────

export type QuoteStatus = 'Pending' | 'Accepted' | 'Rejected' | 'Withdrawn' | 'Expired';

export interface QuoteResponseDto {
  id: string;
  tenantId: string;
  listingId: string;
  transporterId: string;
  price: number;
  currency: string;
  message: string;
  status: QuoteStatus;
  statusLabel: string;
  rejectionReason?: string;
  validUntil?: string;
  acceptedAt?: string;
  rejectedAt?: string;
  withdrawnAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SubmitQuoteDto {
  listingId: string;
  price: number;
  message: string;
  currency?: string;
  validUntil?: string;
}

// ── Vehicle enums ─────────────────────────────────────────────────────────────
export type VehicleStatus =
  | 'Available'
  | 'OnTrip'
  | 'Maintenance'
  | 'Inactive';

export type VehicleCategory =
  | 'Truck'
  | 'Trailer'
  | 'LCV'       // Light Commercial Vehicle
  | 'Bus'
  | 'Other';

export type MembershipTier =
  | 'Free'
  | 'Basic'
  | 'Premium'
  | 'Enterprise';

// ── Vehicles ──────────────────────────────────────────────────────────────────



// ── Plans ─────────────────────────────────────────────────────────────────────

export interface PlanDto {
  id: string;
  name: string;
  description?: string;
  monthlyPrice: number;
  currency: string;
}

// ── Notifications ─────────────────────────────────────────────────────────────

export interface NotificationDto {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// ── Available Loads ───────────────────────────────────────────────────────────
export interface AvailableLoadDto {
  id: string; tenantId: string; departureProvince: string;
  departureCountry: string; departureCity: string;
  destinationProvince: string; destinationCountry: string;
  commodity: string; weightBracket: string; contactEmail: string;
  contactPhone?: string; isCrossBorder: boolean; loadDate?: string;
  status: string; membershipTier: string; createdAt: string;
}
export interface CreateAvailableLoadDto {
  departureProvince: string; departureCountry: string; departureCity: string;
  destinationProvince: string; destinationCountry: string;
  commodity: string; weightBracket: string; contactEmail: string;
  contactPhone?: string; isCrossBorder: boolean; loadDate?: string;
  additionalNotes?: string;
}
export interface LoadFilterDto {
  departureProvince?: string; destinationProvince?: string;
  weightBracket?: string; commodity?: string; page?: number; pageSize?: number;
}

// ── Quote Requests ────────────────────────────────────────────────────────────
export interface QuoteRequestDto {
  id: string; details: string; province: string; city: string;
  contactEmail: string; status: string; submissionCount: number; createdAt: string;
}

// ── Business Directory ────────────────────────────────────────────────────────
export interface BusinessListingDto {
  id: string; companyName: string; province: string; city: string;
  contactEmail: string; contactPhone?: string; website?: string;
  serviceTypes: string[]; isVerified: boolean; membershipTier: string;
  logoUrl?: string; createdAt: string;
}

// ── Classifieds ───────────────────────────────────────────────────────────────
export type ClassifiedCategory = 'CommercialVehicles'|'Bakkies'|'Trailers'|'Parts'|'Equipment'|'Other';
export interface ClassifiedAdDto {
  id: string; title: string; description: string; category: ClassifiedCategory;
  adType: string; price?: number; currency: string; province: string;
  contactEmail: string; status: string; createdAt: string; expiresAt: string;
}

// ── Jobs ──────────────────────────────────────────────────────────────────────
export type JobType = 'SeekingWork' | 'OfferingJob';
export interface JobSeekerDto {
  id: string; adTitle: string; description: string; jobType: JobType;
  province: string; licenseCode?: string; yearsExperience?: number;
  contactEmail: string; status: string; isUrgent: boolean; createdAt: string;
}

// ── Forum ─────────────────────────────────────────────────────────────────────
export interface ForumCategoryDto {
  id: string; name: string; slug: string; description: string;
  isFraudReporting: boolean; topicCount: number; postCount: number;
}
export interface ForumTopicDto {
  id: string; categoryId: string; title: string; authorName: string;
  viewCount: number; replyCount: number; isPinned: boolean;
  isFraudReport: boolean; createdAt: string;
}

// ── Extended Vehicle (TransHub hire board) ────────────────────────────────────
// Replace existing VehicleResponseDto with this extended version:
export interface VehicleResponseDto {
  id:                   string;
  registrationNumber:   string;
  make:                 string;
  model:                string;
  year:                 number;
  status:               VehicleStatus;
  Category:             VehicleCategory;
  truckType?:           string;
  trailerType?:         string;
  payloadTons:          number;
  province:             string;
  city?:                string;
  isCrossBorderCapable: boolean;
  contactEmail:         string;
  contactPhone?:        string;
  dailyRate?:           number;
  currency:             string;
  description?:         string;
  imageUrl?:            string;
  membershipTier:       MembershipTier;
  postedByUserId:       string;
}

export interface CreateVehicleDto {
  registrationNumber:  string;
  make:                string;
  model:               string;
  year:                number;
  status:              VehicleStatus;
  Category:            VehicleCategory;
  truckType:           string;
  trailerType?:        string;
  payloadTons:         number;
  province:            string;
  city?:               string;
  isCrossBorderCapable: boolean;
  contactEmail:        string;
  contactPhone?:       string;
  dailyRate?:          number;
  currency:            string;
  description?:        string;
  imageUrl?:           string;
  membershipTier:      MembershipTier;
  postedByUserId:      string;   // Guid as string
}

export interface UpdateVehicleDto {
  registrationNumber?:  string;
  make?:                string;
  model?:               string;
  year?:                number;
  status?:              VehicleStatus;
  Category?:            VehicleCategory;
  truckType?:           string;
  trailerType?:         string;
  payloadTons?:         number;
  province?:            string;
  city?:                string;
  isCrossBorderCapable?: boolean;
  contactEmail?:        string;
  contactPhone?:        string;
  dailyRate?:           number;
  currency?:            string;
  description?:         string;
  imageUrl?:            string;
  membershipTier?:      MembershipTier;
  postedByUserId?:      string;
}

export interface VehicleFilterDto {
  category?:             VehicleCategory;
  province?:             string;
  truckType?:            string;
  isCrossBorderCapable?: boolean;
  minPayloadTons?:       number;
  status?:               string;
  page?:                 number;
  pageSize?:             number;
}

export interface VehiclePagedResult {
  items:      VehicleResponseDto[];
  totalCount: number;
  page:       number;
  pageSize:   number;
  totalPages: number;
}

// ── Alias for backward compatibility ──────────────────────────────────────────
export type PaginatedResponse<T> = PagedResult<T>;

// ── Classifieds (Response/Create/Filter) ──────────────────────────────────────
export interface ClassifiedResponseDto extends ClassifiedAdDto {}
export interface CreateClassifiedDto {
  title: string;
  description: string;
  category: ClassifiedCategory;
  adType: string;
  price?: number;
  currency?: string;
  province?: string;
}
export interface ClassifiedFilterDto {
  category?: ClassifiedCategory;
  province?: string;
  page?: number;
  pageSize?: number;
}

// ── Directory (Response/Create/Filter) ────────────────────────────────────────
export interface DirectoryResponseDto extends BusinessListingDto {}
export interface CreateDirectoryEntryDto {
  BusinessName: string;
  Slug: string;
  ContactEmail: string;
  ContactPhone?: string;
  Website?: string;
  ServiceTypes?: string[];
}
export interface DirectoryFilterDto {
  province?: string;
  category?: string;
  page?: number;
  pageSize?: number;
}

// ── Jobs (Response/Create/Filter) ─────────────────────────────────────────────
export interface JobResponseDto extends JobSeekerDto {}
export interface CreateJobDto {
  Title: string;
  Company?: string;
  Description?: string;
  Province?: string;
  JobType?: JobType;
}
export interface JobFilterDto {
  province?: string;
  jobType?: JobType;
  page?: number;
  pageSize?: number;
}

// ── Loads (Response/Create) ───────────────────────────────────────────────────
export interface LoadResponseDto extends AvailableLoadDto {}
export type CreateLoadDto = CreateAvailableLoadDto;

// ── Quote Requests (Response) ─────────────────────────────────────────────────
export interface QuoteRequestResponseDto {
  items: QuoteRequestDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ── Quote Submissions ────────────────────────────────────────────────────────── 
export interface QuoteSubmissionDto {
  listingId: string;
  price: number;
  message: string;
  currency?: string;
  validUntil?: string;
}

// ── Forum Threads (Response/Create/Filter) ───────────────────────────────────
export interface ThreadResponseDto {
  id: string;
  category: string;
  title: string;
  content: string;
  authorName: string;
  viewCount: number;
  replyCount: number;
  isPinned: boolean;
  createdAt: string;
}

export interface CreateThreadDto {
  Title: string;
  Content: string;
  Category?: string;
}

export interface ThreadFilterDto {
  category?: string;
  page?: number;
  pageSize?: number;
}