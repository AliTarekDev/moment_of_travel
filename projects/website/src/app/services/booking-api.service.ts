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

@Injectable({ providedIn: 'root' })
export class BookingApiService {
  constructor(private readonly http: HttpClient) {}

  create(request: BookingRequest) {
    return this.http.post<{ reference: string; status: string; createdAt: string }>('/api/bookings/public', request);
  }
}
