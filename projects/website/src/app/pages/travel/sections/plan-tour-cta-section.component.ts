import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { LanguageService } from '../../../i18n/language.service';

@Component({
  selector: 'app-plan-tour-cta-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plan-tour-cta-section.component.html',
  styleUrl: './plan-tour-cta-section.component.scss',
})
export class PlanTourCtaSectionComponent {
  readonly languages = inject(LanguageService);
}
