import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { TranslatePipe } from '../../i18n/translate.pipe';

@Component({
  selector: 'app-faq-section',
  standalone: true,
  imports: [FontAwesomeModule, TranslatePipe],
  templateUrl: './faq-section.component.html',
  styleUrl: './faq-section.component.scss',
})
export class FaqSectionComponent {
  readonly chevron = faChevronDown;
  readonly questions = [
    { id: 'visa', highlighted: false },
    { id: 'safety', highlighted: false },
    { id: 'season', highlighted: true },
    { id: 'customization', highlighted: false },
    { id: 'private', highlighted: true },
    { id: 'difference', highlighted: true },
    { id: 'occasions', highlighted: false },
    { id: 'guides', highlighted: true },
    { id: 'clothing', highlighted: false },
    { id: 'airport', highlighted: false },
    { id: 'insurance', highlighted: false },
    { id: 'changes', highlighted: false },
  ];
}
