import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../../i18n/translate.pipe';
import { LanguageService } from '../../../i18n/language.service';
import { TravelNavComponent } from '../../travel/travel-nav.component';

@Component({
  selector: 'app-exclusive-visits', standalone: true,
  imports: [RouterLink, TranslatePipe, TravelNavComponent],
  templateUrl: './exclusive-visits.component.html',
  styleUrl: './exclusive-visits.component.scss',
})
export class ExclusiveVisitsComponent {
  readonly languages = inject(LanguageService);
  readonly visits = [
    { id: 'giza', image: '/pyramid.JPG' },
    { id: 'luxor', image: '/9.jpg' },
    { id: 'nile', image: '/8.jpg' },
    { id: 'celebration', image: '/19.jpg' },
  ];
}
