import { WebsiteDatepickerIntl } from '../../i18n/website-datepicker-intl';
import { WebsiteCalendarHeaderComponent } from '../../i18n/website-calendar-header.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowDown, faCalendarDays, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DateAdapter, ErrorStateMatcher, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerIntl, MatDatepickerModule } from '@angular/material/datepicker';
import { TranslatePipe } from '../../i18n/translate.pipe';
import { CurrencyPipe } from '@angular/common';
import { Component, ViewChild, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroupDirective, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { catchError, finalize, map, of, startWith, switchMap } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TourPhotoDialogComponent } from './tour-photo-dialog.component';
import { LanguageService } from '../../i18n/language.service';
import { BookingApiService } from '../../services/booking-api.service';
import { TravelNavComponent } from '../travel/travel-nav.component';
import { GalleryImage, LuxuryGallerySectionComponent } from '../travel/sections/luxury-gallery-section.component';
import { CatalogApiService, PublicCatalogItem } from '../../services/catalog-api.service';
import { localizedTourField, tourContent, tourDayCount, TourDay } from './tour-content';

function localToday(): string {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
function bookingDate(control: AbstractControl): ValidationErrors | null {
  const value = control.value as Date | null;
  return !value || (value instanceof Date && !Number.isNaN(value.getTime()) && calendarDate(value) >= localToday()) ? null : { bookingDate: true };
}
function calendarDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
function emailsMatch(control: AbstractControl): ValidationErrors | null {
  return control.get('email')?.value.trim().toLowerCase() === control.get('confirmEmail')?.value.trim().toLowerCase() ? null : { emailMismatch: true };
}

@Component({
  selector: 'app-tour-details', standalone: true,
  providers: [provideNativeDateAdapter(), { provide: MatDatepickerIntl, useClass: WebsiteDatepickerIntl }],
  imports: [MatDialogModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, CurrencyPipe, TranslatePipe, RouterLink, ReactiveFormsModule, TravelNavComponent, LuxuryGallerySectionComponent, MatSnackBarModule, FontAwesomeModule],
  templateUrl: './tour-details.component.html', styleUrls: ['./tour-details.component.scss', './tour-itinerary.scss', './tour-booking.scss'],
})
export class TourDetailsComponent {
  readonly calendarHeader = WebsiteCalendarHeaderComponent;
  readonly icons = { arrowDown: faArrowDown, calendar: faCalendarDays, location: faLocationDot };
  readonly confirmEmailMatcher: ErrorStateMatcher = {
    isErrorState: (control, parent) => !!(control && (control.touched || parent?.submitted) && (control.invalid || control.parent?.hasError('emailMismatch'))),
  };
  readonly languages = inject(LanguageService);
  private readonly photoDialog = inject(MatDialog);

  viewDayPhoto(day: TourDay): void {
    this.photoDialog.open(TourPhotoDialogComponent, {
      data: { image: this.dayImage(day), title: day.title },
      width: '1100px', maxWidth: '96vw', maxHeight: '94dvh',
      ariaLabelledBy: 'tour-photo-title',
      direction: this.languages.language() === 'ar' ? 'rtl' : 'ltr',
      autoFocus: 'first-tabbable', restoreFocus: true,
    });
  }
  private readonly catalog = inject(CatalogApiService);
  private readonly state = toSignal(inject(ActivatedRoute).paramMap.pipe(
    switchMap(params => this.catalog.publishedTour(params.get('slug') ?? '').pipe(
      map(tour => ({ tour, loading: false, error: false })),
      catchError(response => of({ tour: null, loading: false, error: response.status !== 404 })),
      startWith({ tour: null, loading: true, error: false }),
    )),
  ), { initialValue: { tour: null, loading: true, error: false } });
  readonly loadingTour = computed(() => this.state().loading);
  readonly tourLoadError = computed(() => this.state().error);
  private readonly api = inject(BookingApiService);
  private readonly snackBar = inject(MatSnackBar);
  readonly tour = computed(() => this.state().tour);
  readonly content = computed(() => this.tour() ? tourContent(this.tour()!, this.languages.language()) : { introduction: '', days: [] });
  readonly itinerary = computed(() => this.content().days.map(day => ({
    ...day, paragraphs: day.text.split(/\n\s*\n/).map(text => text.trim()).filter(Boolean),
  })));

  readonly galleryImages = computed<GalleryImage[]>(() => {
    const tour = this.tour();
    const language = this.languages.language();
    if (tour?.gallery?.length) return tour.gallery.map(photo => ({
      image: photo.imageUrl,
      caption: language === 'ar' ? photo.captionAr || photo.captionEn : photo.captionEn || photo.captionAr,
    }));
    // Keep future catalog entries specific to their own itinerary too.
    return [...new Map(this.itinerary().map(day => {
      const image = this.dayImage(day);
      return [image, { image, caption: day.title }] as const;
    })).values()];
  });

  dayImage(day: TourDay): string {
    if (day.imageUrl) return day.imageUrl;
    const subject = day.title.toLowerCase();
    if (/arrival|arrive|الوصول/.test(subject)) return '/18.jpg';
    if (/departure|depart|المغادرة/.test(subject)) return '/16.jpg';
    if (/abu simbel|أبو سمبل|ابو سمبل/.test(subject)) return '/7.jpg';
    if (/giza|pyramid|saqqara|dahshur|sphinx|جيزة|أهرام|اهرام|سقارة|دهشور|الهول/.test(subject)) return '/pyramid.JPG';
    if (/valley|وادي/.test(subject)) return '/17.jpg';
    if (/hatshepsut|حتشبسوت/.test(subject)) return '/19.jpg';
    if (/philae|فيلة/.test(subject)) return '/15.jpg';
    if (/nile|sail|cruise|aswan|philae|نيل|إبحار|ابحار|أسوان|اسوان|فيلة/.test(subject)) return '/8.jpg';
    if (/temple|luxor|karnak|edfu|kom ombo|معبد|معابد|أقصر|الأقصر|كرنك|إدفو|ادفو|أمبو/.test(subject)) return '/6.jpg';
    return this.tour()?.imageUrl || '/cover.jpg';
  }
  local(tour: PublicCatalogItem, field: 'title' | 'summary' | 'description' | 'location'): string { return localizedTourField(tour, field, this.languages.language()); }
  days(tour: PublicCatalogItem): number | null { return tourDayCount(tour); }
  readonly pending = signal(false);
  readonly submitted = signal(false);
  @ViewChild('bookingForm') private bookingForm?: FormGroupDirective;
  get today(): Date { return new Date(`${localToday()}T00:00:00`); }
  readonly form = inject(FormBuilder).nonNullable.group({
    firstName: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(59)]],
    lastName: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(60)]],
    email: ['', [Validators.required, Validators.email]],
    confirmEmail: ['', [Validators.required, Validators.email]],
    mobile: ['', [Validators.required, Validators.pattern(/^[+\d][\d\s().-]{6,39}$/)]],
    bookingDate: [null as Date | null, [Validators.required, bookingDate]],
    groupNumber: [1, [Validators.required, Validators.min(1), Validators.max(50), Validators.pattern(/^\d+$/)]],
    notes: ['', Validators.maxLength(2000)],
  }, { validators: emailsMatch });
  constructor() {
    const dates = inject(DateAdapter);
    effect(() => dates.setLocale(this.languages.language() === 'ar' ? 'ar-SA' : 'en-GB'));
    effect(() => {
      this.tour();
      this.resetBookingForm();
    }, { allowSignalWrites: true });
  }
  invalid(name: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[name];
    return control.invalid && (control.touched || this.submitted());
  }
  scrollToBooking(event: MouseEvent, section: HTMLElement): void {
    event.preventDefault();
    const reducedMotion = section.ownerDocument.defaultView?.matchMedia('(prefers-reduced-motion: reduce)').matches;
    section.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'start' });
  }
  book(): void {
    if (this.pending()) return;
    this.submitted.set(true);
    this.form.controls.bookingDate.updateValueAndValidity();
    this.form.markAllAsTouched();
    const tour = this.tour();
    if (!tour || this.form.invalid) return;
    const values = this.form.getRawValue();
    this.pending.set(true);
    this.api.create({
      customerName: `${values.firstName.trim()} ${values.lastName.trim()}`,
      customerEmail: values.email.trim(), customerPhone: values.mobile.trim(),
      serviceType: 'tour', destination: tour.titleEn.slice(0, 140),
      departureDate: calendarDate(values.bookingDate!), travelers: Number(values.groupNumber),
      customerNotes: values.notes.trim() || undefined,
    }).pipe(finalize(() => this.pending.set(false))).subscribe({
      next: () => {
        if (this.tour()?.slug !== tour.slug) return;
        this.resetBookingForm();
        this.showBookingToast('tourUi.bookingToastSuccess');
      },
      error: () => {
        if (this.tour()?.slug === tour.slug) this.showBookingToast('tourUi.weCouldNotSendYourRequestPleaseTryAgain');
      },
    });
  }

  private resetBookingForm(): void {
    // Reset the directive too, so Material does not show errors on the empty form.
    if (this.bookingForm) this.bookingForm.resetForm();
    else this.form.reset();
    this.submitted.set(false);
  }

  private showBookingToast(messageKey: string): void {
    this.snackBar.open(
      this.languages.translate(messageKey),
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
  }
}
