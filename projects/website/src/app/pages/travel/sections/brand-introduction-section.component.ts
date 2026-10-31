import { Component } from '@angular/core';
import { TranslatePipe } from '../../../i18n/translate.pipe';

@Component({
  selector: 'app-brand-introduction-section',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './brand-introduction-section.component.html',
  styleUrl: './brand-introduction-section.component.scss',
})
export class BrandIntroductionSectionComponent {
  readonly pillars = ['vision', 'culture', 'luxury', 'hospitality'] as const;
}
