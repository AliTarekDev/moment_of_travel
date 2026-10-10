import { TranslatePipe } from '../../../i18n/translate.pipe';

import { Component, inject } from '@angular/core';
import { LanguageService } from '../../../i18n/language.service';

interface FeatureCard {
  id: string;
  titleKey: string;
  textKey: string;
  image: string;
}

@Component({
  selector: 'app-why-choose-us-section',
  standalone: true,
  imports: [TranslatePipe, ],
  templateUrl: './why-choose-us-section.component.html',
  styleUrl: './why-choose-us-section.component.scss',
})
export class WhyChooseUsSectionComponent {
  readonly languages = inject(LanguageService);

  readonly cards: FeatureCard[] = [
    {
      id: 'exclusive-visits',
      titleKey: "siteCopy.vipLandmarkAccess",
      textKey: "siteCopy.privateTimingQuieterRoutesAndCuratedAccessTo",
      image: 'https://images.unsplash.com/photo-1560157368-946d9c8f7cb6?auto=format&fit=crop&w=900&q=84',
    },
    {
      id: 'expert-egyptologists',
      titleKey: "siteCopy.expertEgyptologists",
      textKey: "siteCopy.goBeyondDatesAndMonumentsWithGuidesWho",
      image: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=900&q=84',
    },
    {
      id: 'five-star-hotels',
      titleKey: "siteCopy.fiveStarComfort",
      textKey: "siteCopy.handpickedHotelsPrivateTransfersAndSeamlessCareFrom",
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=900&q=84',
    },
  ];
}
