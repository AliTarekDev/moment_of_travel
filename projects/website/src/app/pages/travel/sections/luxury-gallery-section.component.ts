
import { Component, inject } from '@angular/core';

import { LanguageService } from '../../../i18n/language.service';

interface GalleryImage {
  titleEn: string;
  titleAr: string;
  locationEn: string;
  locationAr: string;
  image: string;
}

@Component({
  selector: 'app-luxury-gallery-section',
  standalone: true,
  imports: [],
  templateUrl: './luxury-gallery-section.component.html',
  styleUrl: './luxury-gallery-section.component.scss',
})
export class LuxuryGallerySectionComponent {
  readonly languages = inject(LanguageService);



  readonly images: GalleryImage[] = [
    {
      titleEn: 'Golden hour at the pyramids',
      titleAr: 'الساعة الذهبية عند الأهرامات',
      locationEn: 'Giza',
      locationAr: 'الجيزة',
      image:
        'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1500&q=86',
    },
    {
      titleEn: 'Timeless Nile sailing',
      titleAr: 'إبحار خالد على النيل',
      locationEn: 'Luxor to Aswan',
      locationAr: 'من الأقصر إلى أسوان',
      image:
        'https://images.unsplash.com/photo-1623674567450-b600b67864a6?auto=format&fit=crop&w=1500&q=86',
    },
    {
      titleEn: 'Private temple moments',
      titleAr: 'لحظات خاصة بين المعابد',
      locationEn: 'Luxor',
      locationAr: 'الأقصر',
      image:
        'https://images.pexels.com/photos/15188316/pexels-photo-15188316.jpeg?auto=compress&cs=tinysrgb&w=1000',
    },
    {
      titleEn: 'Red Sea luxury escape',
      titleAr: 'ملاذ فاخر على البحر الأحمر',
      locationEn: 'Red Sea',
      locationAr: 'البحر الأحمر',
      image:
        'https://images.unsplash.com/photo-1593385069384-2e2006c5508e?auto=format&fit=crop&w=1500&q=86',
    },
    {
      titleEn: 'Old Cairo private discoveries',
      titleAr: 'اكتشافات خاصة في القاهرة القديمة',
      locationEn: 'Cairo',
      locationAr: 'القاهرة',
      image:
        'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1500&q=86',
    },
    {
      titleEn: 'Golden desert horizons',
      titleAr: 'آفاق الصحراء الذهبية',
      locationEn: 'Giza Desert',
      locationAr: 'صحراء الجيزة',
      image:
        'https://images.unsplash.com/photo-1560157368-946d9c8f7cb6?auto=format&fit=crop&w=1500&q=86',
    },
  ];
}
