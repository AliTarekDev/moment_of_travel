import { BidiModule } from '@angular/cdk/bidi';
import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { LanguageService } from '../../i18n/language.service';
import { TranslatePipe } from '../../i18n/translate.pipe';
import { ContactComponent, ExcursionContactData } from '../contact/contact.component';
import { TravelNavComponent } from '../travel/travel-nav.component';

@Component({
  selector: 'app-optional-excursions',
  standalone: true,
  imports: [BidiModule, MatDialogModule, MatTabsModule, TranslatePipe, TravelNavComponent],
  templateUrl: './optional-excursions.component.html',
  styleUrl: './optional-excursions.component.scss',
})
export class OptionalExcursionsComponent {
  readonly languages = inject(LanguageService);
  private readonly dialog = inject(MatDialog);
  readonly detailSections: Partial<Record<string, readonly string[]>> = {
    dendera: ['treasures', 'journey', 'guidedTour', 'expedition'],
    queens: ['legacy', 'nefertari', 'expedition'],
    museum: ['treasures', 'choice', 'guidance'],
  };
  readonly photos: Partial<Record<string, { src: string; width: number; height: number }>> = {
    abdeen: { src: '/abdeen-palace.jpg', width: 959, height: 383 },
    wahtye: { src: '/saqqara-pyramid.jpg', width: 1280, height: 853 },
    abuSimbel: { src: '/abu-simbel-dome.jpg', width: 1280, height: 853 },
    dendera: { src: '/dendera-temple.jpg', width: 1280, height: 854 },
    queens: { src: '/valley-of-the-queens.jpg', width: 1280, height: 960 },
    coptic: { src: '/coptic-cairo.jpg', width: 1280, height: 709 },
    museum: { src: '/egyptian-museum.jpg', width: 1280, height: 881 },
    balloon: { src: '/luxor-balloon.jpg', width: 1280, height: 850 },
    pyramids: { src: '/meidum-pyramid.jpg', width: 1280, height: 960 },
    alexandria: { src: '/qaitbay-citadel.jpg', width: 1280, height: 848 },
    hotel: { src: '/five-star-hotels-luxor.webp', width: 1920, height: 960 },
    horemheb: { src: '/horemheb-tomb.jpg', width: 800, height: 600 },
    stepPyramid: { src: '/step-pyramid-interior.jpg', width: 1280, height: 960 },
    camel: { src: '/aswan-camel-ride.jpg', width: 1280, height: 853 },
    senenmut: { src: '/senenmut-tomb.jpg', width: 1280, height: 960 },
  };
  readonly excursions = [
    'abdeen', 'senenmut', 'wahtye', 'abuSimbel', 'museum', 'stepPyramid', 'dendera', 'balloon',
    'amenhotep', 'queens', 'camel', 'horemheb', 'coptic', 'pyramids', 'alexandria', 'hotel',
  ];

  inquire(title: string): void {
    this.dialog.open<ContactComponent, ExcursionContactData>(ContactComponent, {
      data: { excursionTitle: title },
      direction: this.languages.language() === 'ar' ? 'rtl' : 'ltr',
      panelClass: 'excursion-enquiry-dialog',
      autoFocus: 'first-heading',
      width: '600px',
      maxWidth: 'calc(100vw - 32px)',
      maxHeight: 'calc(100dvh - 32px)',
    });
  }
}
