import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

export type CatalogDivision = 'travel' | 'aviation';
export type CatalogType = 'trip' | 'offer' | 'destination' | 'hotel' | 'flight' | 'service';

export interface PublicCatalogItem {
  id: string;
  slug: string;
  division: CatalogDivision;
  type: CatalogType;
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
}

@Injectable({ providedIn: 'root' })
export class CatalogApiService {
  private readonly http = inject(HttpClient);

  published(division: CatalogDivision) {
    const params = new HttpParams().set('division', division).set('page', 1).set('limit', 100);
    return this.http.get<{ data: PublicCatalogItem[] }>('/api/catalog/public', { params });
  }
}
