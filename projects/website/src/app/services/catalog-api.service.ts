import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
// Restore these operators when the backend tour catalog is enabled again.
// import { EMPTY, expand, map, reduce } from 'rxjs';
import { LOCAL_TOURS } from './local-tours';

export type CatalogDivision = 'travel' | 'aviation';
export type CatalogType = 'trip' | 'offer' | 'destination' | 'hotel' | 'flight' | 'service';

export interface PublicCatalogItem {
  durationDays?: number | null;
  itinerary?: { titleAr: string; titleEn: string; textAr: string; textEn: string }[];
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

  publishedTours() {
    // Temporary local catalog; both the home page and tours page use this method.
    return of(LOCAL_TOURS);
    /* Backend tour fetching is paused. Remove the local return and restore the
       RxJS operator import above to re-enable this implementation.
    const page = (number: number) => this.http.get<{ data: PublicCatalogItem[]; meta: { page: number; limit: number; total: number } }>(
      '/api/catalog/public', {
        params: new HttpParams().set('division', 'travel').set('type', 'trip').set('page', number).set('limit', 100),
      },
    );
    return page(1).pipe(
      expand(response => response.data.length && response.meta.page * response.meta.limit < response.meta.total ? page(response.meta.page + 1) : EMPTY),
      map(response => response.data),
      reduce((items, next) => [...items, ...next], [] as PublicCatalogItem[]),
    );
    */
  }

  publishedTour(slug: string) {
    const tour = LOCAL_TOURS.find(item => item.slug === slug);
    return tour ? of(tour) : throwError(() => ({ status: 404 }));
    // Backend detail fetching is paused alongside the list above.
    // return this.http.get<PublicCatalogItem>(`/api/catalog/public/tours/${encodeURIComponent(slug)}`);
  }
}
