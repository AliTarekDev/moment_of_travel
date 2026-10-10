import { TranslatePipe } from '../../../i18n/translate.pipe';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRight, faCompass, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';

import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../../i18n/language.service';

@Component({
  selector: 'app-luxury-intro-section',
  standalone: true,
  imports: [TranslatePipe, RouterLink, FontAwesomeModule],
  templateUrl: './luxury-intro-section.component.html',
  styleUrl: './luxury-intro-section.component.scss',
})
export class LuxuryIntroSectionComponent {
  readonly icons = { arrowRight: faArrowRight, compass: faCompass, personal: faWandMagicSparkles };
  readonly languages = inject(LanguageService);
}
