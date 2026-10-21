import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export type BookingServiceType = 'flight' | 'hotel' | 'tour' | 'cruise' | 'car' | 'private_aviation';

export interface BookingRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceType: BookingServiceType;
  destination: string;
  departureCity?: string;
  departureDate?: string;
  returnDate?: string;
  tripType?: 'one_way' | 'round_trip';
  urgent?: boolean;
  includesTickets?: boolean;
  includesHotels?: boolean;
  includesTransport?: boolean;
  travelers: number;
  customerNotes?: string;
}

export interface TailorMadeRequest {
  firstName: string; email: string; adults: number; children: number; origin: string;
  arrivalDate: string; departureDate: string; flightsBooked: string; days: string;
  occasions?: string | null; cairoSites: string[]; luxor: string; aswan: string; abuSimbel: string;
  cruise: string; alexandria: string; otherPlaces?: string | null; experiences: string[];
  otherExperiences?: string | null; vip: string; hotels: string; notes?: string | null;
}

@Injectable({ providedIn: 'root' })
export class BookingApiService {
  constructor(private readonly http: HttpClient) {}

  createTailorMade(request: TailorMadeRequest) {
    return this.http.post<{ reference: string; status: string; createdAt: string }>('/api/bookings/public/tailor-made', request);
  }

  create(request: BookingRequest) {
    return this.http.post<{ reference: string; status: string; createdAt: string }>('/api/bookings/public', request);
  }
}
