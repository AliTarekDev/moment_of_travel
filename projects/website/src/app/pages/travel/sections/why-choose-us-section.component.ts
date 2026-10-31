import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGem, faHandHoldingHeart, faLandmark, faShieldHalved } from '@fortawesome/free-solid-svg-icons';
import { TranslatePipe } from '../../../i18n/translate.pipe';

@Component({
  selector: 'app-why-choose-us-section',
  standalone: true,
  imports: [TranslatePipe, FontAwesomeModule],
  templateUrl: './why-choose-us-section.component.html',
  styleUrl: './why-choose-us-section.component.scss',
})
export class WhyChooseUsSectionComponent {
  readonly strengths = [
    { key: 'comfort', id: 'five-star-hotels', icon: faGem },
    { key: 'hospitality', id: 'personalized-hospitality', icon: faHandHoldingHeart },
    { key: 'culture', id: 'expert-egyptologists', icon: faLandmark },
    { key: 'confidence', id: 'travel-confidence', icon: faShieldHalved },
  ] as const;
}
