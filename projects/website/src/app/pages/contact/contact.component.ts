import { AnimateOnScrollDirective } from '../../shared/animate-on-scroll.directive';
import { ActivatedRoute } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRight, faEnvelope, faLocationDot, faPhone } from '@fortawesome/free-solid-svg-icons';
import { finalize } from 'rxjs';
import { LanguageService } from '../../i18n/language.service';
import { TranslatePipe } from '../../i18n/translate.pipe';
import { BookingApiService } from '../../services/booking-api.service';
import { TravelNavComponent } from '../travel/travel-nav.component';
import { FaqSectionComponent } from './faq-section.component';

export interface ExcursionContactData {
  excursionTitle: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [AnimateOnScrollDirective, NgTemplateOutlet, ReactiveFormsModule, FontAwesomeModule, TranslatePipe, TravelNavComponent, MatDialogModule, MatSnackBarModule, FaqSectionComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  readonly languages = inject(LanguageService);
  readonly excursion = inject<ExcursionContactData>(MAT_DIALOG_DATA, { optional: true });
  private readonly dialog = inject(MatDialogRef<ContactComponent>, { optional: true });
  private readonly api = inject(BookingApiService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);
  readonly icons = { email: faEnvelope, phone: faPhone, location: faLocationDot, send: faArrowRight };
  readonly pending = signal(false);
  readonly submitted = signal(false);
  readonly form = inject(FormBuilder).nonNullable.group({
    name: ['', [Validators.required, Validators.pattern(/\S(?:[\s\S]*\S)/), Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    phone: ['', [Validators.required, Validators.pattern(/^[+\d][\d\s().-]{6,39}$/)]],
    message: ['', this.excursion
      ? [Validators.maxLength(2000)]
      : [Validators.required, Validators.pattern(/\S/), Validators.maxLength(2000)]],
  });

  constructor() {
    if (this.excursion) return;
    inject(ActivatedRoute).queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      const hotel = params.get('hotel');
      if (hotel && ['menaHouse', 'nilePlaza'].includes(hotel)) {
        this.form.controls.message.setValue(this.languages.translate('fiveStarHotels.requestMessage') + ' ' + this.languages.translate('fiveStarHotels.hotels.' + hotel + '.name'));
      }
      const experience = params.get('experience');
      if (experience && ['giza', 'luxor', 'nile', 'celebration'].includes(experience)) {
        this.form.controls.message.setValue(this.languages.translate('exclusiveVisits.requestMessage') + ' ' + this.languages.translate('exclusiveVisits.cards.' + experience + '.title'));
      }
    });
  }

  invalid(field: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.touched || this.submitted());
  }

  send(): void {
    if (this.pending()) return;
    this.submitted.set(true);
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const values = this.form.getRawValue();
    this.pending.set(true);
    if (this.dialog) this.dialog.disableClose = true;
    // General travel enquiries share the existing dashboard enquiry inbox.
    // One traveller is the API's required minimum, not a confirmed group size.
    this.api.create({
      customerName: values.name.trim(),
      customerEmail: values.email.trim(),
      customerPhone: values.phone.trim(),
      serviceType: 'tour',
      destination: this.excursion ? `Egypt — ${this.excursion.excursionTitle}` : 'Egypt — Contact enquiry',
      travelers: 1,
      customerNotes: values.message.trim() || undefined,
    }).pipe(takeUntilDestroyed(this.destroyRef), finalize(() => {
      this.pending.set(false);
      if (this.dialog) this.dialog.disableClose = false;
    })).subscribe({
      next: () => {
        this.form.reset();
        this.submitted.set(false);
        this.showToast('contactPage.success');
        this.dialog?.close();
      },
      error: () => this.showToast('contactPage.sendError'),
    });
  }

  private showToast(messageKey: string): void {
    this.snackBar.open(this.languages.translate(messageKey), this.languages.translate('tourUi.dismiss'), {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      direction: this.languages.language() === 'ar' ? 'rtl' : 'ltr',
      panelClass: ['booking-success-toast'],
      politeness: 'polite',
    });
  }
}
