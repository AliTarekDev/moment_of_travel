import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
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
  imports: [CommonModule, CarouselModule],
  templateUrl: './luxury-gallery-section.component.html',
  styleUrl: './luxury-gallery-section.component.scss',
})
export class LuxuryGallerySectionComponent {
  readonly languages = inject(LanguageService);

  readonly carouselOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 650,
    nav: true,
    navText: ['‹', '›'],
    margin: 22,
    items: 4,
    rtl: true,
    autoplay: true,
    autoplayTimeout: 4500,
    autoplayHoverPause: true,
    responsive: {
      0: { items: 1 },
      560: { items: 2 },
      900: { items: 3 },
      1180: { items: 4 },
    },
  };

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
        'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1500&q=86',
    },
    {
      titleEn: 'Private temple moments',
      titleAr: 'لحظات خاصة بين المعابد',
      locationEn: 'Luxor',
      locationAr: 'الأقصر',
      image:
        'https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=1500&q=86',
    },
    {
      titleEn: 'Red Sea luxury escape',
      titleAr: 'ملاذ فاخر على البحر الأحمر',
      locationEn: 'Red Sea',
      locationAr: 'البحر الأحمر',
      image:
        'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1500&q=86',
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
      titleEn: 'Desert stillness and stars',
      titleAr: 'هدوء الصحراء والنجوم',
      locationEn: 'Western Desert',
      locationAr: 'الصحراء الغربية',
      image:
        'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1500&q=86',
    },
  ];
}
