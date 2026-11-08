import { Component, computed, inject, input } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { TranslatePipe } from '../../../i18n/translate.pipe';
import { LanguageService } from '../../../i18n/language.service';
import { ImageFallbackDirective } from '../../../shared/image-fallback.directive';
import { AccessibleCarouselDirective } from '../../../shared/accessible-carousel.directive';

export interface GalleryImage {
  image: string;
  titleKey?: string;
  locationKey?: string;
  caption?: string;
}

@Component({
  selector: 'app-luxury-gallery-section',
  standalone: true,
  imports: [AccessibleCarouselDirective, ImageFallbackDirective, TranslatePipe, CarouselModule],
  templateUrl: './luxury-gallery-section.component.html',
  styleUrl: './luxury-gallery-section.component.scss',
})
export class LuxuryGallerySectionComponent {
  readonly languages = inject(LanguageService);
  readonly heading = input('');
  readonly images = input<GalleryImage[]>([
    { titleKey: 'siteCopy.pyramidImageAlt', locationKey: 'siteCopy.giza', image: '/pyramid.JPG' },
    { titleKey: 'whyAncientPaths.imageAlt', locationKey: 'gallery.nileView', image: '/8.jpg' },
    { titleKey: 'gallery.templeArchitecture', locationKey: 'gallery.egypt', image: '/9.jpg' },
    { titleKey: 'gallery.tombInterior', locationKey: 'gallery.egypt', image: '/17.jpg' },
    { titleKey: 'gallery.templeArchitecture', locationKey: 'siteCopy.luxor', image: '/19.jpg' },
    { titleKey: 'gallery.desertJourney', locationKey: 'gallery.egypt', image: '/4.jpg' },
  ]);
  readonly carouselOptions = computed<OwlOptions>(() => ({
    rtl: this.languages.language() === 'ar',
    loop: false,
    rewind: true,
    autoplay: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    nav: false,
    margin: 24,
    smartSpeed: 450,
    responsive: { 0: { items: 1, margin: 16 }, 560: { items: 2 }, 1000: { items: 3 } },
  }));
}
