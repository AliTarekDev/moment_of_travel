import { Component, ElementRef, ViewChild, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerIntl, MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, provideNativeDateAdapter } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';
import { LanguageService } from '../../../i18n/language.service';
import { TranslatePipe } from '../../../i18n/translate.pipe';
import { WebsiteDatepickerIntl } from '../../../i18n/website-datepicker-intl';
import { BookingApiService, TailorMadeRequest } from '../../../services/booking-api.service';
import { TRIP_STEPS, TailorMadeDraft, localCalendarDate } from './tailor-made.model';

@Component({
  selector: 'app-trip-planner', standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe, MatFormFieldModule, MatInputModule, MatRadioModule, MatCheckboxModule, MatDatepickerModule],
  providers: [provideNativeDateAdapter(), { provide: MatDatepickerIntl, useClass: WebsiteDatepickerIntl }],
  templateUrl: './trip-planner.component.html', styleUrl: './trip-planner.component.scss',
})
export class TripPlannerComponent {
  readonly languages = inject(LanguageService);
  readonly draft = inject(TailorMadeDraft);
  private readonly api = inject(BookingApiService);
  private readonly dialog = inject(MatDialogRef<TripPlannerComponent>);
  private readonly toast = inject(MatSnackBar);
  constructor() { inject(DateAdapter).setLocale(this.languages.language() === 'ar' ? 'ar-EG' : 'en-GB'); }
  readonly steps = TRIP_STEPS;
  readonly step = computed(() => this.steps[this.draft.index()]);
  readonly progress = computed(() => Math.round(this.draft.index() / (this.steps.length - 1) * 100));
  readonly canReturnToReview = computed(() => this.draft.reviewReached() && this.step().kind !== 'review');
  readonly pending = signal(false); readonly error = signal(false); readonly attempted = signal(false); readonly reference = signal('');
  @ViewChild('questionTitle') title?: ElementRef<HTMLElement>;
  @ViewChild('scrollArea') scrollArea?: ElementRef<HTMLElement>;
  get name(): string { return this.draft.form.controls.firstName.value?.trim() ?? ''; }
  get today(): Date { const date = new Date(); date.setHours(0, 0, 0, 0); return date; }
  get minDate(): Date { return this.step().id === 'departureDate' ? this.draft.form.controls.arrivalDate.value ?? this.today : this.today; }
  control(key = this.step().field!): FormControl { return this.draft.form.get(key) as FormControl; }
  optionKey(option: string, id = this.step().id): string { return 'tailorMade.options.' + (['yes', 'no'].includes(option) ? (id === 'hotels' || id === 'vip' ? id + '.' + option : option) : id + '.' + option); }
  selected(option: string): boolean { return (this.control().value as string[]).includes(option); }
  toggle(option: string, checked: boolean): void {
    const control = this.control(); let values = [...control.value as string[]];
    if (this.step().id === 'experiences' && option === 'none' && checked) values = [];
    if (this.step().id === 'experiences' && option !== 'none') values = values.filter(item => item !== 'none');
    control.setValue(checked ? [...values.filter(item => item !== option), option] : values.filter(item => item !== option));
    control.markAsTouched();
  }
  private valid(key: string): boolean {
    const control = this.control(key); control.updateValueAndValidity(); control.markAsTouched();
    if (key === 'arrivalDate' || key === 'departureDate') {
      const value = control.value as Date | null;
      if (value && (!(value instanceof Date) || Number.isNaN(value.getTime()) || value < this.today || (key === 'departureDate' && this.draft.form.controls.arrivalDate.value && value < this.draft.form.controls.arrivalDate.value))) control.setErrors({ travelDate: true });
    }
    if (key === 'adults' || key === 'children') { const v = this.draft.form.getRawValue(); if (Number(v.adults) + Number(v.children) > 50) control.setErrors({ groupSize: true }); }
    return control.valid;
  }
  next(): void { if (this.pending()) return; this.attempted.set(true); if (this.step().field && !this.valid(this.step().field!)) return; this.go(this.draft.index() + 1); }
  back(): void { if (!this.pending() && this.draft.index() > 0) this.go(this.draft.index() - 1); }
  edit(index: number): void { if (!this.pending()) this.go(index); }
  returnToReview(): void {
    if (this.pending() || !this.draft.reviewReached()) return;
    this.attempted.set(true);
    if (this.step().field && !this.valid(this.step().field!)) return;
    // An edit may invalidate another answer, such as departure date or group size.
    for (const [index, step] of this.steps.entries()) {
      if (step.field && !this.valid(step.field)) { this.go(index); this.attempted.set(true); return; }
    }
    this.go(this.steps.length - 1);
  }
  private go(index: number): void {
    this.draft.index.set(Math.max(0, Math.min(index, this.steps.length - 1))); this.attempted.set(false); this.error.set(false);
    if (this.step().kind === 'review') this.draft.reviewReached.set(true);
    this.title?.nativeElement.ownerDocument.defaultView?.requestAnimationFrame(() => { this.scrollArea?.nativeElement.scrollTo({ top: 0 }); this.title?.nativeElement.focus({ preventScroll: true }); });
  }
  close(): void { if (!this.pending()) this.dialog.close(); }
  answer(key: string): string {
    const value = this.control(key).value;
    if (value instanceof Date) return new Intl.DateTimeFormat(this.languages.language() === 'ar' ? 'ar-EG' : 'en-GB').format(value);
    if (Array.isArray(value)) return value.map(option => this.languages.translate(this.optionKey(option, key))).join(this.languages.language() === 'ar' ? '، ' : ', ');
    if (['flightsBooked', 'luxor', 'aswan', 'abuSimbel', 'cruise', 'alexandria', 'vip', 'hotels'].includes(key) && value) return this.languages.translate(this.optionKey(value, key));
    return value === null || value === '' ? this.languages.translate('tailorMade.notSpecified') : String(value);
  }
  submit(): void {
    if (this.pending() || this.reference()) return;
    for (const [index, step] of this.steps.entries()) if (step.field && !this.valid(step.field)) { this.go(index); this.attempted.set(true); return; }
    const v = this.draft.form.getRawValue();
    const request: TailorMadeRequest = { ...v, firstName: v.firstName!.trim(), email: v.email!.trim(), origin: v.origin!.trim(), days: v.days!.trim(), arrivalDate: localCalendarDate(v.arrivalDate!), departureDate: localCalendarDate(v.departureDate!), adults: Number(v.adults), children: Number(v.children), flightsBooked: v.flightsBooked!, luxor: v.luxor!, aswan: v.aswan!, abuSimbel: v.abuSimbel!, cruise: v.cruise!, alexandria: v.alexandria!, vip: v.vip!, hotels: v.hotels! };
    this.pending.set(true); this.error.set(false); this.dialog.disableClose = true;
    this.api.createTailorMade(request).pipe(finalize(() => { this.pending.set(false); this.dialog.disableClose = false; })).subscribe({
      next: result => { this.reference.set(result.reference); this.draft.reset(); this.toast.open(this.languages.translate('tailorMade.successTitle'), this.languages.translate('tourUi.dismiss'), { duration: 5000, panelClass: ['booking-success-toast'], direction: this.languages.language() === 'ar' ? 'rtl' : 'ltr' }); this.title?.nativeElement.focus(); },
      error: () => this.error.set(true),
    });
  }
}
