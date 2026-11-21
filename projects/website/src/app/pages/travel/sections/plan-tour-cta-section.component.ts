import { AnimateOnScrollDirective } from '../../../shared/animate-on-scroll.directive';
import { TranslatePipe } from '../../../i18n/translate.pipe';

import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../../i18n/language.service';

@Component({
  selector: 'app-plan-tour-cta-section',
  standalone: true,
  imports: [AnimateOnScrollDirective, TranslatePipe, RouterLink],
  templateUrl: './plan-tour-cta-section.component.html',
  styleUrl: './plan-tour-cta-section.component.scss',
})
export class PlanTourCtaSectionComponent {
  readonly languages = inject(LanguageService);
}
