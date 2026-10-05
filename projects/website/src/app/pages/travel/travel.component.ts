import { DOCUMENT } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faFacebookF, faInstagram, faLinkedinIn, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import {
  faArrowLeft,
  faArrowRight,
  faArrowRightArrowLeft,
  faArrowUpRightFromSquare,
  faBars,
  faCar,
  faCheck,
  faHeart,
  faHandshake,
  faHotel,
  faKaaba,
  faLocationDot,
  faMapLocationDot,
  faMugHot,
  faPlane,
  faPassport,
  faShip,
  faStar,
  faTicket,
  faWaterLadder,
  faWifi,
} from '@fortawesome/free-solid-svg-icons';
import { TranslatePipe } from '../../i18n/translate.pipe';
import { LanguageService } from '../../i18n/language.service';
import { BookingApiService, BookingServiceType } from '../../services/booking-api.service';
import { CatalogApiService, PublicCatalogItem } from '../../services/catalog-api.service';
import { LuxuryGallerySectionComponent } from './sections/luxury-gallery-section.component';
import { LuxuryIntroSectionComponent } from './sections/luxury-intro-section.component';
import { PlanTourCtaSectionComponent } from './sections/plan-tour-cta-section.component';
import { SignatureToursSectionComponent } from './sections/signature-tours-section.component';
import { TourCategoriesSectionComponent } from './sections/tour-categories-section.component';
import { TravelNavComponent } from './travel-nav.component';
import { WhyChooseUsSectionComponent } from './sections/why-choose-us-section.component';

type SearchTab = 'Flights' | 'Hotels' | 'Cars' | 'Cruise' | 'Tours';

interface Destination {
  city: string;
  country: string;
  price: number;
  image: string;
}

interface Listing {
  name: string;
  location: string;
  rating: number;
  reviews: number;
  price: number;
  image: string;
  tag: string;
}

@Component({
  selector: 'app-travel',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    MatButtonModule,
    MatInputModule,
    FontAwesomeModule,
    LuxuryIntroSectionComponent,
    WhyChooseUsSectionComponent,
    SignatureToursSectionComponent,
    PlanTourCtaSectionComponent,
    LuxuryGallerySectionComponent,
    TravelNavComponent,
    TourCategoriesSectionComponent
],
  templateUrl: './travel.component.html',
  styleUrl: './travel.component.scss'
})
export class TravelComponent {
  private readonly forms = inject(FormBuilder);
  private readonly bookingApi = inject(BookingApiService);
  private readonly document = inject(DOCUMENT);
  private readonly route = inject(ActivatedRoute);
  readonly languages = inject(LanguageService);
  private readonly catalogApi = inject(CatalogApiService);
  activeTab: SearchTab = 'Tours';
  bookingSubmitting = false;
  bookingReference = '';
  bookingError = '';
  catalogItems: PublicCatalogItem[] = [];
  listingOffset = 0;
  readonly favourites = new Set<string>();
  readonly minimumDate = new Date().toISOString().slice(0, 10);
  readonly searchTabs: SearchTab[] = ['Flights', 'Hotels', 'Cars', 'Cruise', 'Tours'];
  readonly egyptDestinations = [
    { nameEn: 'Cairo & Giza', nameAr: 'القاهرة والجيزة', captionEn: 'Where history comes alive', captionAr: 'حيث ينبض التاريخ', image: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1000&q=85' },
    { nameEn: 'Luxor', nameAr: 'الأقصر', captionEn: 'Timeless temples', captionAr: 'معابد خالدة', image: 'https://images.pexels.com/photos/15188316/pexels-photo-15188316.jpeg?auto=compress&cs=tinysrgb&w=1000' },
    { nameEn: 'The Nile', nameAr: 'نهر النيل', captionEn: 'Take the scenic route', captionAr: 'رحلة بين أجمل المناظر', image: 'https://images.unsplash.com/photo-1623674567450-b600b67864a6?auto=format&fit=crop&w=1000&q=85' },
    { nameEn: 'Red Sea', nameAr: 'البحر الأحمر', captionEn: 'A little closer to paradise', captionAr: 'خطوة أقرب إلى الجنة', image: 'https://images.unsplash.com/photo-1593385069384-2e2006c5508e?auto=format&fit=crop&w=1000&q=85' },
    { nameEn: 'Old Cairo', nameAr: 'القاهرة القديمة', captionEn: 'Stories around every corner', captionAr: 'حكاية في كل ركن', image: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1000&q=85' },
  ];
  readonly icons = {
    arrowLeft: faArrowLeft,
    arrowRight: faArrowRight,
    external: faArrowUpRightFromSquare,
    bars: faBars,
    check: faCheck,
    heart: faHeart,
    handshake: faHandshake,
    kaaba: faKaaba,
    location: faLocationDot,
    coffee: faMugHot,
    pool: faWaterLadder,
    star: faStar,
    passport: faPassport,
    ticket: faTicket,
    swap: faArrowRightArrowLeft,
    wifi: faWifi,
    facebook: faFacebookF,
    instagram: faInstagram,
    x: faXTwitter,
    linkedin: faLinkedinIn,
  };
  private readonly tabIcons: Record<SearchTab, IconDefinition> = {
    Flights: faPlane,
    Hotels: faHotel,
    Cars: faCar,
    Cruise: faShip,
    Tours: faMapLocationDot,
  };
  readonly bookingForm = this.forms.nonNullable.group({
    customerName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(120)]],
    customerEmail: ['', [Validators.required, Validators.email]],
    customerPhone: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(40)]],
    serviceType: ['tour' as BookingServiceType, Validators.required],
    destination: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(140)]],
    departureCity: ['', Validators.maxLength(140)],
    departureDate: [''],
    returnDate: [''],
    tripType: ['round_trip' as 'one_way' | 'round_trip'],
    urgent: [false],
    includesTickets: [true],
    includesHotels: [false],
    includesTransport: [false],
    travelers: [1, [Validators.required, Validators.min(1), Validators.max(50)]],
    customerNotes: ['', Validators.maxLength(2000)],
  });

  readonly destinations: Destination[] = [
    { city: 'Tokyo', country: 'Japan', price: 899, image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=900&q=82' },
    { city: 'New York', country: 'United States', price: 1199, image: 'https://images.unsplash.com/photo-1522083165195-3424ed129620?auto=format&fit=crop&w=900&q=82' },
    { city: 'London', country: 'United Kingdom', price: 749, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=900&q=82' },
    { city: 'Sydney', country: 'Australia', price: 1099, image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=900&q=82' },
    { city: 'Paris', country: 'France', price: 949, image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=82' },
    { city: 'Santorini', country: 'Greece', price: 1299, image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=82' }
  ];

  readonly listings: Listing[] = [
    { name: 'Hotel Plaza Athenee', location: 'Barcelona, Spain', rating: 5, reviews: 400, price: 500, tag: 'Trending', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=82' },
    { name: 'The Luxe Haven', location: 'London, England', rating: 4.8, reviews: 360, price: 420, tag: 'Popular', image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=900&q=82' },
    { name: 'The Urban Retreat', location: 'Edinburgh, Scotland', rating: 4.7, reviews: 285, price: 380, tag: 'Best value', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=82' },
    { name: 'Oceanview Resort', location: 'Bali, Indonesia', rating: 4.9, reviews: 510, price: 550, tag: 'Trending', image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=900&q=82' }
  ];

  constructor() {
    const destination = this.route.snapshot.queryParamMap.get('destination');
    if (destination) {
      this.bookingForm.patchValue({
        serviceType: 'tour',
        destination,
        customerNotes: this.route.snapshot.queryParamMap.get('notes') ?? '',
      });
    }
    this.catalogApi.published('travel').subscribe({ next: ({ data }) => (this.catalogItems = data) });
  }

  setTab(tab: SearchTab): void {
    this.activeTab = tab;
    const mapping: Record<SearchTab, BookingServiceType> = {
      Flights: 'flight',
      Hotels: 'hotel',
      Cars: 'car',
      Cruise: 'cruise',
      Tours: 'tour',
    };
    this.bookingForm.controls.serviceType.setValue(mapping[tab]);
  }

  get isFlightRequest(): boolean {
    return this.bookingForm.controls.serviceType.value === 'flight';
  }

  iconForTab(tab: SearchTab): IconDefinition {
    return this.tabIcons[tab];
  }

  scrollToBooking(): void {
    const reducedMotion = this.document.defaultView?.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.document.getElementById('booking')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  }

  // Bare fragments resolve against the root <base> and otherwise reset /ar to /en.
  @HostListener('click', ['$event'])
  onSectionLink(event: MouseEvent): void {
    if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const anchor = (event.target as Element | null)?.closest?.('a[href^="#"]');
    const section = this.document.getElementById(anchor?.getAttribute('href')?.slice(1) ?? '');
    if (!section) return;
    event.preventDefault();
    const reducedMotion = this.document.defaultView?.matchMedia('(prefers-reduced-motion: reduce)').matches;
    section.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  }

  swapRoute(): void {
    const origin = this.bookingForm.controls.departureCity.value;
    this.bookingForm.controls.departureCity.setValue(this.bookingForm.controls.destination.value);
    this.bookingForm.controls.destination.setValue(origin);
  }

  selectDestination(item: Destination): void {
    this.bookingForm.patchValue({ serviceType: 'tour', destination: `${item.city}, ${item.country}` });
    this.scrollToBooking();
  }

  selectHotel(item: Listing): void {
    this.bookingForm.patchValue({ serviceType: 'hotel', destination: item.location, customerNotes: item.name });
    this.scrollToBooking();
  }

  selectOffer(destination: string, notes: string): void {
    this.bookingForm.patchValue({ serviceType: 'tour', destination, customerNotes: notes });
    this.scrollToBooking();
  }

  selectCatalogItem(item: PublicCatalogItem): void {
    const typeMap: Partial<Record<PublicCatalogItem['type'], BookingServiceType>> = { hotel: 'hotel', flight: 'flight', trip: 'tour', destination: 'tour' };
    this.bookingForm.patchValue({
      serviceType: typeMap[item.type] ?? 'tour',
      destination: this.local(item, 'location') || this.local(item, 'title'),
      departureDate: item.startDate ?? '',
      customerNotes: this.local(item, 'summary'),
    });
    this.scrollToBooking();
  }

  local(item: PublicCatalogItem, field: 'title' | 'summary' | 'location'): string {
    const suffix = this.languages.language() === 'ar' ? 'Ar' : 'En';
    return String(item[`${field}${suffix}` as keyof PublicCatalogItem] ?? '');
  }

  rotateListings(direction: -1 | 1): void {
    this.listingOffset = (this.listingOffset + direction + this.listings.length) % this.listings.length;
  }

  get visibleListings(): Listing[] {
    return this.listings.map((_, index) => this.listings[(index + this.listingOffset) % this.listings.length]);
  }

  toggleFavourite(name: string): void {
    this.favourites.has(name) ? this.favourites.delete(name) : this.favourites.add(name);
  }

  submitBooking(): void {
    if (this.bookingForm.invalid || this.bookingSubmitting) {
      this.bookingForm.markAllAsTouched();
      return;
    }
    const flightDetailsMissing =
      this.isFlightRequest &&
      (!this.bookingForm.controls.departureCity.value.trim() ||
        !this.bookingForm.controls.departureDate.value ||
        (this.bookingForm.controls.tripType.value === 'round_trip' && !this.bookingForm.controls.returnDate.value));
    if (flightDetailsMissing) {
      this.bookingError = 'travel.bookingFlightRequired';
      return;
    }
    this.bookingSubmitting = true;
    this.bookingError = '';
    this.bookingReference = '';
    const value = this.bookingForm.getRawValue();
    this.bookingApi
      .create({
        ...value,
        departureCity: value.departureCity.trim() || undefined,
        departureDate: value.departureDate || undefined,
        returnDate: value.tripType === 'round_trip' ? value.returnDate || undefined : undefined,
        tripType: this.isFlightRequest ? value.tripType : undefined,
        customerNotes: value.customerNotes.trim() || undefined,
      })
      .pipe(finalize(() => (this.bookingSubmitting = false)))
      .subscribe({
        next: (result) => {
          this.bookingReference = result.reference;
          this.bookingForm.reset({
            serviceType: value.serviceType,
            travelers: 1,
            tripType: 'round_trip',
            urgent: false,
            includesTickets: true,
            includesHotels: false,
            includesTransport: false,
          });
        },
        error: () => (this.bookingError = 'travel.bookingError'),
      });
  }
}
