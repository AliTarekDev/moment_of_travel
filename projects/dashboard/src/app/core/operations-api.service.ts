import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Booking, BookingList, BookingStatus, CatalogDivision, CatalogItem, CatalogList, CatalogPayload, CatalogStatus, ClientAttachmentKind, DashboardSummary, PaymentStatus, StaffUser, TravelClient, TravelClientList, TravelClientPayload, TravelProgram, TravelProgramList, TravelProgramPayload, UserRole } from './api.models';

@Injectable({ providedIn: 'root' })
export class OperationsApiService {
  constructor(private readonly http: HttpClient) {}

  summary() {
    return this.http.get<DashboardSummary>('/api/dashboard/summary', { withCredentials: true });
  }

  bookings(filters: { status?: BookingStatus | ''; search?: string } = {}) {
    let params = new HttpParams().set('page', 1).set('limit', 50);
    if (filters.status) params = params.set('status', filters.status);
    if (filters.search?.trim()) params = params.set('search', filters.search.trim());
    return this.http.get<BookingList>('/api/bookings', { params, withCredentials: true });
  }

  updateBooking(id: string, payload: Partial<Pick<Booking, 'status' | 'assignedToId' | 'internalNotes' | 'currency'>> & { totalAmount?: number }) {
    return this.http.patch<Booking>(`/api/bookings/${id}`, payload, { withCredentials: true });
  }

  updatePayment(id: string, paymentStatus: PaymentStatus) {
    return this.http.patch<Booking>(`/api/bookings/${id}/payment`, { paymentStatus }, { withCredentials: true });
  }

  users() {
    return this.http.get<StaffUser[]>('/api/users', { withCredentials: true });
  }

  user(id: string) {
    return this.http.get<StaffUser>(`/api/users/${id}`, { withCredentials: true });
  }

  createUser(payload: { fullName: string; email: string; password: string; role: UserRole }) {
    return this.http.post<StaffUser>('/api/users', payload, { withCredentials: true });
  }

  updateUser(id: string, payload: Partial<Pick<StaffUser, 'fullName' | 'email' | 'role' | 'active'>>) {
    return this.http.patch<StaffUser>(`/api/users/${id}`, payload, { withCredentials: true });
  }

  deleteUser(id: string) {
    return this.http.delete<{ deleted: true }>(`/api/users/${id}`, { withCredentials: true });
  }

  catalog(filters: { division?: CatalogDivision | ''; status?: CatalogStatus | ''; search?: string } = {}) {
    let params = new HttpParams().set('page', 1).set('limit', 100);
    if (filters.division) params = params.set('division', filters.division);
    if (filters.status) params = params.set('status', filters.status);
    if (filters.search?.trim()) params = params.set('search', filters.search.trim());
    return this.http.get<CatalogList>('/api/catalog', { params, withCredentials: true });
  }

  createCatalogItem(payload: CatalogPayload) {
    return this.http.post<CatalogItem>('/api/catalog', { ...payload, slug: payload.slug || undefined }, { withCredentials: true });
  }

  updateCatalogItem(id: string, payload: CatalogPayload) {
    return this.http.patch<CatalogItem>(`/api/catalog/${id}`, { ...payload, slug: payload.slug || undefined }, { withCredentials: true });
  }

  deleteCatalogItem(id: string) {
    return this.http.delete<{ deleted: true }>(`/api/catalog/${id}`, { withCredentials: true });
  }

  clients(search='') {
    let params=new HttpParams().set('page',1).set('limit',100);
    if(search.trim())params=params.set('search',search.trim());
    return this.http.get<TravelClientList>('/api/clients',{params,withCredentials:true});
  }
  createClient(payload:TravelClientPayload){return this.http.post<TravelClient>('/api/clients',payload,{withCredentials:true});}
  createClientWithAttachments(payload:TravelClientPayload,files:{passport:File;national_id:File;portrait:File}){const body=new FormData();for(const[key,value]of Object.entries(payload)){if(value!==null&&value!==undefined)body.append(key,String(value));}body.append('passport',files.passport);body.append('national_id',files.national_id);body.append('portrait',files.portrait);return this.http.post<TravelClient>('/api/clients/with-attachments',body,{withCredentials:true});}
  uploadClientAttachment(id:string,kind:ClientAttachmentKind,file:File){const body=new FormData();body.append('file',file);return this.http.post<TravelClient>(`/api/clients/${id}/attachments/${kind}`,body,{withCredentials:true});}
  programs(search=''){let params=new HttpParams().set('page',1).set('limit',100);if(search.trim())params=params.set('search',search.trim());return this.http.get<TravelProgramList>('/api/programs',{params,withCredentials:true});}
  createProgram(payload:TravelProgramPayload,files:{cover:File;social:File|null}){const body=new FormData();for(const[key,value]of Object.entries(payload)){if(value!==null&&value!==undefined&&value!=='')body.append(key,String(value));}body.append('cover',files.cover);if(files.social)body.append('social',files.social);return this.http.post<TravelProgram>('/api/programs',body,{withCredentials:true});}
  deleteProgram(id:string){return this.http.delete<{deleted:true}>(`/api/programs/${id}`,{withCredentials:true});}
}
