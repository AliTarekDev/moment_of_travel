import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LanguageService } from '../../../i18n/language.service';
import { TranslatePipe } from '../../../i18n/translate.pipe';
import { TravelNavComponent } from '../../travel/travel-nav.component';
import { TripPlannerComponent } from './trip-planner.component';
@Component({
  selector: 'app-tailor-made-itineraries', standalone: true,
  imports: [RouterLink, TranslatePipe, TravelNavComponent, MatDialogModule, MatSnackBarModule],
  templateUrl: './tailor-made-itineraries.component.html', styleUrl: './tailor-made-itineraries.component.scss',
})
export class TailorMadeItinerariesComponent {
  readonly languages = inject(LanguageService);
  private readonly dialogs = inject(MatDialog);
  openPlanner(): void {
    if (this.dialogs.getDialogById('tailor-made-planner')) return;
    this.dialogs.open(TripPlannerComponent, {
      id: 'tailor-made-planner', panelClass: 'tailor-planner-dialog', width: '100vw', height: '100dvh', maxWidth: '100vw', maxHeight: '100dvh',
      position: { top: '0', left: '0' }, direction: this.languages.language() === 'ar' ? 'rtl' : 'ltr',
      autoFocus: '#question-title', restoreFocus: true, closeOnNavigation: true,
      ariaLabel: this.languages.translate('tailorMade.plannerLabel'),
    });
  }
}
