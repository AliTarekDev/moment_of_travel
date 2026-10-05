import { TranslatePipe } from '../../i18n/translate.pipe';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LanguageService } from '../../i18n/language.service';
import { BookingApiService } from '../../services/booking-api.service';
import { TravelNavComponent } from '../travel/travel-nav.component';
import { TOURS } from './tour-data';
import { TOUR_ITINERARIES } from './tour-itineraries';

function localToday(): string {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
function bookingDate(control: AbstractControl): ValidationErrors | null {
  const value = control.value as string;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !value || (/^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value && value >= localToday()) ? null : { bookingDate: true };
}
function emailsMatch(control: AbstractControl): ValidationErrors | null {
  return control.get('email')?.value.trim().toLowerCase() === control.get('confirmEmail')?.value.trim().toLowerCase() ? null : { emailMismatch: true };
}

@Component({
  selector: 'app-tour-details', standalone: true,
  imports: [TranslatePipe, RouterLink, ReactiveFormsModule, TravelNavComponent, MatSnackBarModule],
  templateUrl: './tour-details.component.html', styleUrl: './tour-details.component.scss',
})
export class TourDetailsComponent {
  readonly languages = inject(LanguageService);
  private readonly params = toSignal(inject(ActivatedRoute).paramMap);
  private readonly api = inject(BookingApiService);
  private readonly snackBar = inject(MatSnackBar);
  readonly tour = computed(() => TOURS.find(tour => tour.slug === this.params()?.get('slug')));
  readonly itinerary = computed(() => TOUR_ITINERARIES[this.tour()?.slug ?? ''] ?? []);
  readonly pending = signal(false);
  readonly reference = signal('');
  readonly error = signal(false);
  readonly submitted = signal(false);
  get today(): string { return localToday(); }
  readonly form = inject(FormBuilder).nonNullable.group({
    firstName: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(59)]],
    lastName: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(60)]],
    email: ['', [Validators.required, Validators.email]],
    confirmEmail: ['', [Validators.required, Validators.email]],
    mobile: ['', [Validators.required, Validators.pattern(/^[+\d][\d\s().-]{6,39}$/)]],
    bookingDate: ['', [Validators.required, bookingDate]],
    groupNumber: [1, [Validators.required, Validators.min(1), Validators.max(50), Validators.pattern(/^\d+$/)]],
    notes: ['', Validators.maxLength(2000)],
  }, { validators: emailsMatch });
  constructor() {
    effect(() => {
      this.tour();
      this.form.reset();
      this.reference.set('');
      this.error.set(false);
      this.submitted.set(false);
    }, { allowSignalWrites: true });
  }
  invalid(name: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[name];
    return control.invalid && (control.touched || this.submitted());
  }
  book(): void {
    if (this.pending() || this.reference()) return;
    this.submitted.set(true);
    this.form.controls.bookingDate.updateValueAndValidity();
    this.form.markAllAsTouched();
    const tour = this.tour();
    if (!tour || this.form.invalid) return;
    const values = this.form.getRawValue();
    this.error.set(false);
    this.pending.set(true);
    this.api.create({
      customerName: `${values.firstName.trim()} ${values.lastName.trim()}`,
      customerEmail: values.email.trim(), customerPhone: values.mobile.trim(),
      serviceType: 'tour', destination: this.languages.translate(tour.titleKey),
      departureDate: values.bookingDate, travelers: Number(values.groupNumber),
      customerNotes: values.notes.trim() || undefined,
    }).pipe(finalize(() => this.pending.set(false))).subscribe({
      next: result => {
        if (this.tour()?.slug !== tour.slug) return;
        this.reference.set(result.reference);
        this.snackBar.open(
          this.languages.translate('tourUi.bookingToastSuccess'),
          this.languages.translate('tourUi.dismiss'),
          {
            duration: 7000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            direction: this.languages.language() === 'ar' ? 'rtl' : 'ltr',
            panelClass: ['booking-success-toast'],
            politeness: 'polite',
          },
        );
      },
      error: () => { if (this.tour()?.slug === tour.slug) this.error.set(true); },
    });
  }
}
