import { AnimateOnScrollDirective } from '../../../shared/animate-on-scroll.directive';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../../i18n/translate.pipe';
import { LanguageService } from '../../../i18n/language.service';
import { TravelNavComponent } from '../../travel/travel-nav.component';

@Component({
  selector: 'app-five-star-hotels', standalone: true,
  imports: [AnimateOnScrollDirective, RouterLink, TranslatePipe, TravelNavComponent],
  templateUrl: './five-star-hotels.component.html',
  styleUrl: './five-star-hotels.component.scss',
})
export class FiveStarHotelsComponent {
  readonly languages = inject(LanguageService);
  readonly failedImages = signal<ReadonlySet<string>>(new Set());
  readonly hotels = [
    { id: 'menaHouse', image: '/18.jpg' },
    { id: 'nilePlaza', image: '/16.jpg' },
  ];
  imageUnavailable(id: string): void { this.failedImages.update(ids => new Set([...ids, id])); }
}
