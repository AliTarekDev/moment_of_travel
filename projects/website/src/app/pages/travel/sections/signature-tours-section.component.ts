import { TranslatePipe } from '../../../i18n/translate.pipe';

import { Component, computed, inject } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { RouterLink } from '@angular/router';
import { TOURS } from '../../tours/tour-data';
import { LanguageService } from '../../../i18n/language.service';

@Component({
  selector: 'app-signature-tours-section',
  standalone: true,
  imports: [TranslatePipe, CarouselModule, RouterLink],
  templateUrl: './signature-tours-section.component.html',
  styleUrl: './signature-tours-section.component.scss',
})
export class SignatureToursSectionComponent {
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
    margin: 22,
    rtl: this.languages.language() === 'ar',
    // Four tours need fewer than four visible cards for Owl to show pagination.
    responsive: {
      0: { items: 1 },
      560: { items: 2 },
      1100: { items: 3 },
    },
  }));
  dotContent(index: number): string {
    const title = this.languages.translate(this.tours[index].titleKey);
    return `<button type="button" aria-label="${title}"><span></span></button>`;
  }

  readonly tours = TOURS;
}
