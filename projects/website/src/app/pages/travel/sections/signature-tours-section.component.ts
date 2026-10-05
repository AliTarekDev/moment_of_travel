import { TranslatePipe } from '../../../i18n/translate.pipe';
import { CurrencyPipe } from '@angular/common';

import { Component, DestroyRef, OnInit, afterNextRender, computed, inject, signal } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { RouterLink } from '@angular/router';
import { CatalogApiService, PublicCatalogItem } from '../../../services/catalog-api.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { localizedTourField, tourDayCount } from '../../tours/tour-content';
import { LanguageService } from '../../../i18n/language.service';

@Component({
  selector: 'app-signature-tours-section',
  standalone: true,
  imports: [CurrencyPipe, TranslatePipe, CarouselModule, RouterLink],
  templateUrl: './signature-tours-section.component.html',
  styleUrl: './signature-tours-section.component.scss',
})
export class SignatureToursSectionComponent implements OnInit {
  private readonly catalog = inject(CatalogApiService);
  private readonly destroyRef = inject(DestroyRef);
  readonly tours = signal<PublicCatalogItem[]>([]);
  readonly loading = signal(true);
  readonly loadError = signal(false);

  ngOnInit(): void { this.load(); }
  load(): void {
    this.loading.set(true);
    this.loadError.set(false);
    this.catalog.publishedTours().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: tours => { this.tours.set(tours); this.loading.set(false); },
      error: () => { this.loadError.set(true); this.loading.set(false); },
    });
  }
  local(tour: PublicCatalogItem, field: 'title' | 'summary' | 'location'): string { return localizedTourField(tour, field, this.languages.language()); }
  days(tour: PublicCatalogItem): number | null { return tourDayCount(tour); }
  readonly languages = inject(LanguageService);
  readonly carouselReady = signal(false);

  constructor() {
    // Owl requires a browser layout width; SSR has no clientWidth.
    afterNextRender(() => this.carouselReady.set(true));
  }
  readonly carouselOptions = computed<OwlOptions & { rtl: boolean }>(() => ({
    loop: this.tours().length > 1,
    nav: false,
    dots: true,
    dotsData: true,
    dotsEach: 1,
    slideBy: 1,
    autoplay: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    smartSpeed: 450,
    margin: 22,
    rtl: this.languages.language() === 'ar',
    // Avoid empty slots when only one or two tours are published.
    responsive: {
      0: { items: 1 },
      560: { items: Math.max(1, Math.min(2, this.tours().length)) },
      1100: { items: Math.max(1, Math.min(3, this.tours().length)) },
    },
  }));
  dotContent(index: number): string {
    const title = this.local(this.tours()[index], 'title').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]!));
    return `<button type="button" aria-label="${title}"><span></span></button>`;
  }


}
