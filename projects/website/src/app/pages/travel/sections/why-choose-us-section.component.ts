
import { Component, inject } from '@angular/core';
import { LanguageService } from '../../../i18n/language.service';

interface FeatureCard {
  titleEn: string;
  titleAr: string;
  textEn: string;
  textAr: string;
  image: string;
}

@Component({
  selector: 'app-why-choose-us-section',
  standalone: true,
  imports: [],
  templateUrl: './why-choose-us-section.component.html',
  styleUrl: './why-choose-us-section.component.scss',
})
export class WhyChooseUsSectionComponent {
  readonly languages = inject(LanguageService);

  readonly cards: FeatureCard[] = [
    {
      titleEn: 'VIP landmark access',
      titleAr: 'وصول خاص للمعالم',
      textEn: 'Private timing, quieter routes, and curated access to Egypt’s timeless icons.',
      textAr: 'توقيت خاص ومسارات أكثر هدوءاً ووصول منتقى إلى أيقونات مصر الخالدة.',
      image: 'https://images.unsplash.com/photo-1560157368-946d9c8f7cb6?auto=format&fit=crop&w=900&q=84',
    },
    {
      titleEn: 'Expert Egyptologists',
      titleAr: 'خبراء مصريات متخصصون',
      textEn: 'Go beyond dates and monuments with guides who turn history into a living story.',
      textAr: 'تجربة أعمق من التواريخ والآثار مع مرشدين يحولون التاريخ إلى قصة حية.',
      image: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=900&q=84',
    },
    {
      titleEn: 'Five-star comfort',
      titleAr: 'راحة خمس نجوم',
      textEn: 'Handpicked hotels, private transfers, and seamless care from arrival to farewell.',
      textAr: 'فنادق مختارة وتنقلات خاصة ورعاية سلسة من لحظة الوصول حتى الوداع.',
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=900&q=84',
    },
  ];
}
