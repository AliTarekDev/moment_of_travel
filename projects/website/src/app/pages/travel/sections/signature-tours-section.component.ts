import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { LanguageService } from '../../../i18n/language.service';

interface SignatureTour {
  titleEn: string;
  titleAr: string;
  days: string;
  textEn: string;
  textAr: string;
  image: string;
}

@Component({
  selector: 'app-signature-tours-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './signature-tours-section.component.html',
  styleUrl: './signature-tours-section.component.scss',
})
export class SignatureToursSectionComponent {
  readonly languages = inject(LanguageService);

  readonly tours: SignatureTour[] = [
    {
      titleEn: 'Cairo, Pyramids & Grand Egyptian Museum',
      titleAr: 'القاهرة والأهرامات والمتحف المصري الكبير',
      days: '5 days',
      textEn: 'A refined introduction to ancient Egypt with private pyramid access, museum highlights, and Nile-side dining.',
      textAr: 'مدخل فاخر إلى مصر القديمة مع تجربة خاصة للأهرامات وأبرز مقتنيات المتحف وعشاء على النيل.',
      image: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1000&q=84',
    },
    {
      titleEn: 'Nile Cruise from Luxor to Aswan',
      titleAr: 'رحلة نيلية من الأقصر إلى أسوان',
      days: '8 days',
      textEn: 'Sail between temples, tombs, and golden river views aboard a handpicked luxury Nile vessel.',
      textAr: 'إبحار بين المعابد والمقابر ومناظر النيل الذهبية على متن مركب نيلي فاخر مختار بعناية.',
      image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1000&q=84',
    },
    {
      titleEn: 'Egypt Family Luxury Adventure',
      titleAr: 'مغامرة عائلية فاخرة في مصر',
      days: '9 days',
      textEn: 'A family-friendly itinerary balancing expert storytelling, comfortable pacing, private transfers, and memorable discoveries.',
      textAr: 'برنامج عائلي يوازن بين الحكاية المتخصصة والإيقاع المريح والتنقلات الخاصة والاكتشافات المميزة.',
      image: 'https://images.unsplash.com/photo-1608429835892-30be51ea4d6c?auto=format&fit=crop&w=1000&q=84',
    },
    {
      titleEn: 'Red Sea, Desert & Ancient Wonders',
      titleAr: 'البحر الأحمر والصحراء وروائع الحضارة',
      days: '10 days',
      textEn: 'Combine historic Cairo, desert stillness, and a five-star Red Sea finale designed for complete restoration.',
      textAr: 'اجمع بين القاهرة التاريخية وهدوء الصحراء وختام فاخر على البحر الأحمر لاستعادة كاملة للنشاط.',
      image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1000&q=84',
    },
  ];
}
