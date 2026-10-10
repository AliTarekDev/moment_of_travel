import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRight, faEnvelope, faLocationDot, faPhone } from '@fortawesome/free-solid-svg-icons';
import { finalize } from 'rxjs';
import { LanguageService } from '../../i18n/language.service';
import { TranslatePipe } from '../../i18n/translate.pipe';
import { BookingApiService } from '../../services/booking-api.service';
import { TravelNavComponent } from '../travel/travel-nav.component';
import { FaqSectionComponent } from './faq-section.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, FontAwesomeModule, TranslatePipe, TravelNavComponent, MatSnackBarModule, FaqSectionComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  readonly languages = inject(LanguageService);
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
    message: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(2000)]],
  });

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
    // General travel enquiries share the existing dashboard enquiry inbox.
    // One traveller is the API's required minimum, not a confirmed group size.
    this.api.create({
      customerName: values.name.trim(),
      customerEmail: values.email.trim(),
      customerPhone: values.phone.trim(),
      serviceType: 'tour',
      destination: 'Egypt — Contact enquiry',
      travelers: 1,
      customerNotes: values.message.trim(),
    }).pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.pending.set(false))).subscribe({
      next: () => {
        this.form.reset();
        this.submitted.set(false);
        this.showToast('contactPage.success');
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
