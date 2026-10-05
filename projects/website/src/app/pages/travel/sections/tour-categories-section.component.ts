
import { Component, computed, inject } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { LanguageService } from '../../../i18n/language.service';

@Component({
  selector: 'app-tour-categories-section',
  standalone: true,
  imports: [CarouselModule],
  templateUrl: './tour-categories-section.component.html',
  styleUrl: './tour-categories-section.component.scss',
})
export class TourCategoriesSectionComponent {
  readonly languages = inject(LanguageService);
  readonly carouselOptions = computed<OwlOptions & { rtl: boolean }>(() => ({
    loop: true,
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
    margin: 28,
    rtl: this.languages.language() === 'ar',
    // Keep fewer visible items than categories so pagination stays usable.
    responsive: {
      0: { items: 1 },
      480: { items: 2 },
      760: { items: 3 },
      1100: { items: 4 },
    },
  }));

  readonly categories = [
    { id: 'nile', titleEn: 'Nile cruises', titleAr: 'رحلات النيل', image: 'https://images.unsplash.com/photo-1623674567450-b600b67864a6?auto=format&fit=crop&w=600&q=85' },
    { id: 'ancient', titleEn: 'Ancient wonders', titleAr: 'روائع الحضارة', image: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=600&q=85' },
    { id: 'coastal', titleEn: 'Coastal escapes', titleAr: 'عطلات ساحلية', image: 'https://images.unsplash.com/photo-1593385069384-2e2006c5508e?auto=format&fit=crop&w=600&q=85' },
    { id: 'culture', titleEn: 'Cultural journeys', titleAr: 'رحلات ثقافية', image: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=600&q=85' },
    { id: 'desert', titleEn: 'Desert adventures', titleAr: 'مغامرات الصحراء', image: 'https://images.unsplash.com/photo-1560157368-946d9c8f7cb6?auto=format&fit=crop&w=600&q=85' },
  ];

  dotContent(index: number): string {
    const title = this.languages.language() === 'ar'
      ? this.categories[index].titleAr
      : this.categories[index].titleEn;
    return `<button type="button" aria-label="${title}"><span></span></button>`;
  }
}
