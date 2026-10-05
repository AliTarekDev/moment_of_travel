import { TranslatePipe } from '../../../i18n/translate.pipe';

import { Component, inject } from '@angular/core';

import { LanguageService } from '../../../i18n/language.service';

interface GalleryImage {
  titleKey: string;
  locationKey: string;
  image: string;
}

@Component({
  selector: 'app-luxury-gallery-section',
  standalone: true,
  imports: [TranslatePipe, ],
  templateUrl: './luxury-gallery-section.component.html',
  styleUrl: './luxury-gallery-section.component.scss',
})
export class LuxuryGallerySectionComponent {
  readonly languages = inject(LanguageService);



  readonly images: GalleryImage[] = [
    {
      titleKey: "siteCopy.goldenHourAtThePyramids",
      locationKey: "siteCopy.giza",
      image:
        'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1500&q=86',
    },
    {
      titleKey: "siteCopy.timelessNileSailing",
      locationKey: "siteCopy.luxorToAswan",
      image:
        'https://images.unsplash.com/photo-1623674567450-b600b67864a6?auto=format&fit=crop&w=1500&q=86',
    },
    {
      titleKey: "siteCopy.privateTempleMoments",
      locationKey: "siteCopy.luxor",
      image:
        'https://images.pexels.com/photos/15188316/pexels-photo-15188316.jpeg?auto=compress&cs=tinysrgb&w=1000',
    },
    {
      titleKey: "siteCopy.redSeaLuxuryEscape",
      locationKey: "siteCopy.redSea",
      image:
        'https://images.unsplash.com/photo-1593385069384-2e2006c5508e?auto=format&fit=crop&w=1500&q=86',
    },
    {
      titleKey: "siteCopy.oldCairoPrivateDiscoveries",
      locationKey: "siteCopy.cairo",
      image:
        'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1500&q=86',
    },
    {
      titleKey: "siteCopy.goldenDesertHorizons",
      locationKey: "siteCopy.gizaDesert",
      image:
        'https://images.unsplash.com/photo-1560157368-946d9c8f7cb6?auto=format&fit=crop&w=1500&q=86',
    },
  ];
}
