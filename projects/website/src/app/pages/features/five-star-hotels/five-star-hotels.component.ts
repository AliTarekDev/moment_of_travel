import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../../i18n/translate.pipe';
import { LanguageService } from '../../../i18n/language.service';
import { TravelNavComponent } from '../../travel/travel-nav.component';

@Component({
  selector: 'app-five-star-hotels', standalone: true,
  imports: [RouterLink, TranslatePipe, TravelNavComponent],
  templateUrl: './five-star-hotels.component.html',
  styleUrl: './five-star-hotels.component.scss',
})
export class FiveStarHotelsComponent {
  readonly languages = inject(LanguageService);
  readonly failedImages = signal<ReadonlySet<string>>(new Set());
  readonly hotels = [
    { id: 'menaHouse', image: 'https://cache.marriott.com/content/dam/marriott-renditions/CAIMN/caimn-grounds-0019-hor-wide.jpg?output-quality=80&downsize=1200px:*', website: 'https://www.marriott.com/en-us/hotels/caimn-marriott-mena-house-cairo/overview/' },
    { id: 'nilePlaza', image: 'https://press.fourseasons.com/content/dam/fourseasons/images/web/CAI/CAI_962_original.jpg', website: 'https://www.fourseasons.com/caironp/' },
  ];
  imageUnavailable(id: string): void { this.failedImages.update(ids => new Set([...ids, id])); }
}
