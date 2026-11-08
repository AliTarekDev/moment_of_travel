import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../../i18n/language.service';
import { TranslatePipe } from '../../../i18n/translate.pipe';

@Component({
  selector: 'app-why-choose-us-section',
  standalone: true,
  imports: [TranslatePipe, RouterLink],
  templateUrl: './why-choose-us-section.component.html',
  styleUrl: './why-choose-us-section.component.scss',
})
export class WhyChooseUsSectionComponent {
  readonly languages = inject(LanguageService);
  readonly experiences = [
    { id: 'exclusive-visits', title: 'whyAncientPaths.discovery.title', text: 'whyAncientPaths.discovery.text', image: '/pyramid.JPG', alt: 'siteCopy.pyramidImageAlt', route: 'features/exclusive-visits' },
    { id: 'personalized-hospitality', title: 'whyAncientPaths.hospitality.title', text: 'whyAncientPaths.hospitality.text', image: '/2.jpg', alt: 'whyAncientPaths.imageAlt', route: 'contact' },
    { id: 'five-star-hotels', title: 'whyAncientPaths.comfort.title', text: 'whyAncientPaths.comfort.text', image: '/18.jpg', alt: 'gallery.nileView', route: 'features/five-star-hotels' },
    { id: 'tailored-experiences', title: 'tailorMade.page.title', text: 'tailorMade.page.introText', image: '/4.jpg', alt: 'tailorMade.page.title', route: 'features/tailor-made-itineraries' },
  ] as const;
}
