import { TranslatePipe } from '../../i18n/translate.pipe';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../i18n/language.service';
import { SignatureToursSectionComponent } from '../travel/sections/signature-tours-section.component';
import { TravelNavComponent } from '../travel/travel-nav.component';

@Component({
  selector: 'app-tours',
  standalone: true,
  imports: [TranslatePipe, RouterLink, TravelNavComponent, SignatureToursSectionComponent],
  templateUrl: './tours.component.html',
  styleUrl: './tours.component.scss',
})
export class ToursComponent {
  readonly languages = inject(LanguageService);
}
