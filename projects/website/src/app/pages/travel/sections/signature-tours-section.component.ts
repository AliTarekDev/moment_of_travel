import { TranslatePipe } from '../../../i18n/translate.pipe';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRight, faClock } from '@fortawesome/free-solid-svg-icons';
import { CurrencyPipe } from '@angular/common';

import { Component, DestroyRef, OnInit, computed, inject, input, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { RouterLink } from '@angular/router';
import { CatalogApiService, PublicCatalogItem } from '../../../services/catalog-api.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { localizedTourField, tourDayCount } from '../../tours/tour-content';
import { LanguageService } from '../../../i18n/language.service';
import { ImageFallbackDirective } from '../../../shared/image-fallback.directive';
import { AccessibleCarouselDirective } from '../../../shared/accessible-carousel.directive';

@Component({
  selector: 'app-signature-tours-section',
  standalone: true,
  imports: [AccessibleCarouselDirective, ImageFallbackDirective, NgTemplateOutlet, CarouselModule, CurrencyPipe, TranslatePipe, RouterLink, FontAwesomeModule],
  templateUrl: './signature-tours-section.component.html',
  styleUrl: './signature-tours-section.component.scss',
})
export class SignatureToursSectionComponent implements OnInit {
  readonly icons = { arrowRight: faArrowRight, clock: faClock };
  private readonly catalog = inject(CatalogApiService);
  private readonly destroyRef = inject(DestroyRef);
  readonly tours = signal<PublicCatalogItem[]>([]);
  readonly loading = signal(true);
  readonly loadError = signal(false);
  readonly carousel = input(true);
  isDragging = false;
  readonly carouselOptions = computed<OwlOptions>(() => ({
    rtl: this.languages.language() === 'ar', loop: false, rewind: true,
    autoplay: false, dots: false, nav: false, mouseDrag: true, touchDrag: true,
    pullDrag: false, margin: 28, smartSpeed: 450,
    responsive: { 0: { items: 1, margin: 16 }, 760: { items: 2, margin: 28 } },
  }));

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
}
