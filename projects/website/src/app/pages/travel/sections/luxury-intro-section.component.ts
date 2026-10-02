import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { LanguageService } from '../../../i18n/language.service';

@Component({
  selector: 'app-luxury-intro-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './luxury-intro-section.component.html',
  styleUrl: './luxury-intro-section.component.scss',
})
export class LuxuryIntroSectionComponent {
  readonly languages = inject(LanguageService);
}
