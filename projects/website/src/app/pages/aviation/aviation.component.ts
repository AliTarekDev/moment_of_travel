import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faArrowRight, faArrowUpRightFromSquare, faBars, faGem, faKitMedical, faPlane, faPlay, faUsers } from '@fortawesome/free-solid-svg-icons';
import { LanguageSwitchComponent } from '../../i18n/language-switch.component';
import { TranslatePipe } from '../../i18n/translate.pipe';
import { BookingApiService } from '../../services/booking-api.service';
import { CatalogApiService, PublicCatalogItem } from '../../services/catalog-api.service';
import { LanguageService } from '../../i18n/language.service';

@Component({
  selector: 'app-aviation',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, LanguageSwitchComponent, TranslatePipe, MatButtonModule, MatInputModule, FontAwesomeModule],
  templateUrl: './aviation.component.html',
  styleUrl: './aviation.component.scss'
})
export class AviationComponent {
  private readonly forms = inject(FormBuilder);
  private readonly bookingApi = inject(BookingApiService);
  private readonly catalogApi = inject(CatalogApiService);
  readonly languages = inject(LanguageService);
  menuOpen = false;
  requestSubmitting = false;
  requestReference = '';
  requestError = false;
  catalogItems: PublicCatalogItem[] = [];
  readonly minimumDate = new Date().toISOString().slice(0, 10);
  readonly icons = {
    arrowLeft: faArrowLeft,
    arrowRight: faArrowRight,
    external: faArrowUpRightFromSquare,
    bars: faBars,
    charter: faPlane,
    management: faGem,
    group: faUsers,
    missions: faKitMedical,
    play: faPlay,
  };
  readonly requestForm = this.forms.nonNullable.group({
    customerName: ['', [Validators.required, Validators.minLength(2)]],
    customerEmail: ['', [Validators.required, Validators.email]],
    customerPhone: ['', [Validators.required, Validators.minLength(7)]],
    departureCity: ['', [Validators.required, Validators.minLength(2)]],
    destinationCity: ['', [Validators.required, Validators.minLength(2)]],
    departureDate: ['', Validators.required],
    travelers: [2, [Validators.required, Validators.min(1), Validators.max(50)]],
  });

  constructor() {
    this.catalogApi.published('aviation').subscribe({ next: ({ data }) => (this.catalogItems = data) });
  }

  local(item: PublicCatalogItem, field: 'title' | 'summary' | 'location'): string {
    const suffix = this.languages.language() === 'ar' ? 'Ar' : 'En';
    return String(item[`${field}${suffix}` as keyof PublicCatalogItem] ?? '');
  }

  selectCatalogItem(item: PublicCatalogItem): void {
    this.requestForm.patchValue({ destinationCity: this.local(item, 'location') || this.local(item, 'title'), departureDate: item.startDate ?? '' });
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  submitRequest(): void {
    if (this.requestForm.invalid || this.requestSubmitting) {
      this.requestForm.markAllAsTouched();
      return;
    }
    const value = this.requestForm.getRawValue();
    this.requestSubmitting = true;
    this.requestError = false;
    this.bookingApi
      .create({
        customerName: value.customerName,
        customerEmail: value.customerEmail,
        customerPhone: value.customerPhone,
        serviceType: 'private_aviation',
        destination: `${value.departureCity.trim()} → ${value.destinationCity.trim()}`,
        departureCity: value.departureCity.trim(),
        departureDate: value.departureDate,
        tripType: 'one_way',
        includesTickets: true,
        travelers: value.travelers,
      })
      .pipe(finalize(() => (this.requestSubmitting = false)))
      .subscribe({
        next: ({ reference }) => {
          this.requestReference = reference;
          this.requestForm.reset({ travelers: 2 });
        },
        error: () => (this.requestError = true),
      });
  }
}
