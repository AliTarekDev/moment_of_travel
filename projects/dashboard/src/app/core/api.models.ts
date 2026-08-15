export type UserRole = 'admin' | 'manager' | 'reception' | 'accountant';
export type BookingStatus = 'new' | 'reviewing' | 'quoted' | 'confirmed' | 'completed' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'pending' | 'partially_paid' | 'paid' | 'refunded';
export type ServiceType = 'flight' | 'hotel' | 'tour' | 'cruise' | 'car' | 'private_aviation';

export interface StaffUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Booking {
  id: string;
  reference: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceType: ServiceType;
  destination: string;
  departureCity: string | null;
  departureDate: string | null;
  returnDate: string | null;
  tripType: 'one_way' | 'round_trip' | null;
  urgent: boolean;
  includesTickets: boolean;
  includesHotels: boolean;
  includesTransport: boolean;
  travelers: number;
  customerNotes: string | null;
  internalNotes: string | null;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  totalAmount: string | null;
  currency: string;
  assignedToId: string | null;
  assignedTo: StaffUser | null;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardSummary {
  total: number;
  paidRevenue: number;
  currency: string;
  statusCounts: Record<BookingStatus, number>;
}

export interface BookingList {
  data: Booking[];
  meta: { page: number; limit: number; total: number };
}

export type CatalogDivision = 'travel' | 'aviation';
export type CatalogType = 'trip' | 'offer' | 'destination' | 'hotel' | 'flight' | 'service';
export type CatalogStatus = 'draft' | 'published' | 'archived';

export interface CatalogItem {
  id: string;
  slug: string;
  division: CatalogDivision;
  type: CatalogType;
  status: CatalogStatus;
  titleAr: string;
  titleEn: string;
  summaryAr: string;
  summaryEn: string;
  descriptionAr: string | null;
  descriptionEn: string | null;
  locationAr: string | null;
  locationEn: string | null;
  imageUrl: string | null;
  price: string | null;
  currency: string;
  startDate: string | null;
  endDate: string | null;
  featured: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export type CatalogPayload = Omit<CatalogItem, 'id' | 'createdAt' | 'updatedAt' | 'price' | 'slug'> & {
  slug?: string;
  price: number | null;
};

export interface CatalogList {
  data: CatalogItem[];
  meta: { page: number; limit: number; total: number };
}

export type ClientGender = 'male' | 'female';
export type ClientMaritalStatus = 'single' | 'married' | 'divorced' | 'widowed';
export type ClientAttachmentKind = 'passport' | 'national_id' | 'portrait';
export interface TravelClient {
  id:string; fullName:string; mobile:string; whatsapp:string|null; email:string|null; nationality:string; birthDate:string;
  gender:ClientGender; maritalStatus:ClientMaritalStatus; mahramName:string|null; mahramRelationship:string|null; notes:string|null;
  nationalId:string|null; passportNumber:string|null; passportExpiry:string|null;
  passportImageName:string|null; nationalIdImageName:string|null; portraitImageName:string|null;
  createdAt:string; updatedAt:string;
}
export type TravelClientPayload=Omit<TravelClient,'id'|'passportImageName'|'nationalIdImageName'|'portraitImageName'|'createdAt'|'updatedAt'>;
export interface TravelClientList{data:TravelClient[];meta:{page:number;limit:number;total:number};}

export type ProgramType='hajj'|'umrah';
export type ProgramServiceLevel='economy'|'standard'|'premium'|'vip';
export type ProgramStatus='draft'|'published'|'archived';
export interface TravelProgram{
  id:string;name:string;type:ProgramType;season:string;serviceLevel:ProgramServiceLevel;status:ProgramStatus;departureDate:string;returnDate:string;ministryPermitNumber:string|null;
  makkahHotel:string|null;makkahHotelRating:number|null;makkahNights:number|null;madinahHotel:string|null;madinahHotelRating:number|null;madinahNights:number|null;airline:string|null;flightNumber:string|null;
  singlePrice:string|null;doublePrice:string|null;triplePrice:string|null;quadruplePrice:string|null;seatCashCost:string|null;totalSeats:number;includesMeals:boolean;includesVisits:boolean;description:string|null;
  seoTitle:string|null;metaDescription:string|null;canonicalUrl:string|null;coverImageName:string;socialImageName:string|null;createdAt:string;updatedAt:string;
}
export type TravelProgramPayload=Omit<TravelProgram,'id'|'singlePrice'|'doublePrice'|'triplePrice'|'quadruplePrice'|'seatCashCost'|'coverImageName'|'socialImageName'|'createdAt'|'updatedAt'>&{singlePrice:number|null;doublePrice:number|null;triplePrice:number|null;quadruplePrice:number|null;seatCashCost:number|null};
export interface TravelProgramList{data:TravelProgram[];meta:{page:number;limit:number;total:number};}
