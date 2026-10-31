import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { TranslatePipe } from '../../../i18n/translate.pipe';

@Component({
  selector: 'app-tour-categories-section',
  standalone: true,
  imports: [TranslatePipe, FontAwesomeModule],
  templateUrl: './tour-categories-section.component.html',
  styleUrl: './tour-categories-section.component.scss',
})
export class TourCategoriesSectionComponent {
  readonly icons = { arrowRight: faArrowRight };
}
