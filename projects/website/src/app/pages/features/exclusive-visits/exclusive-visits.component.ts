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
    { id: 'giza', image: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=85' },
    { id: 'luxor', image: 'https://images.pexels.com/photos/15188316/pexels-photo-15188316.jpeg?auto=compress&cs=tinysrgb&w=1200' },
    { id: 'nile', image: 'https://images.unsplash.com/photo-1623674567450-b600b67864a6?auto=format&fit=crop&w=1200&q=85' },
    { id: 'celebration', image: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1200&q=85' },
  ];
}
