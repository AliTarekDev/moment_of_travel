import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { finalize } from 'rxjs';
import { CatalogPayload } from '../../core/api.models';
import { OperationsApiService } from '../../core/operations-api.service';
import { TranslatePipe } from '../../i18n/translate.pipe';

@Component({
  selector: 'app-new-tour', standalone: true, imports: [FormsModule, TranslatePipe],
  templateUrl: './new-tour.component.html', styleUrl: './new-tour.component.scss',
})
export class NewTourComponent {
  private readonly api = inject(OperationsApiService);
  @Output() readonly back = new EventEmitter<void>();
  readonly languages = ['Ar', 'En'] as const;
  readonly fields = [
    { key: 'title', label: 'name', required: true, max: 180, rows: 1 },
    { key: 'summary', label: 'summary', required: true, max: 700, rows: 3 },
    { key: 'description', label: 'description', required: false, max: 6000, rows: 6 },
    { key: 'location', label: 'location', required: false, max: 180, rows: 1 },
  ] as const;
  model = this.emptyTour();
  saving = false;
  saved = false;
  attempted = false;
  error = false;
  get dateInvalid(): boolean { return !!(this.model.startDate && this.model.endDate && this.model.endDate < this.model.startDate); }
  fieldKey(field: typeof this.fields[number]['key'], language: 'Ar' | 'En') {
    return `${field}${language}` as 'titleAr' | 'titleEn' | 'summaryAr' | 'summaryEn' | 'descriptionAr' | 'descriptionEn' | 'locationAr' | 'locationEn';
  }
  private emptyTour(): CatalogPayload {
    return { division: 'travel', type: 'trip', status: 'draft', slug: '', titleAr: '', titleEn: '', summaryAr: '', summaryEn: '', descriptionAr: '', descriptionEn: '', locationAr: '', locationEn: '', imageUrl: '', price: null, currency: 'EGP', startDate: null, endDate: null, featured: false, sortOrder: 0 };
  }
  another(): void { this.model = this.emptyTour(); this.saved = false; this.error = false; this.attempted = false; }
  save(form: NgForm): void {
    if (this.saving || this.saved) return;
    this.attempted = true;
    if (form.invalid || this.dateInvalid) { form.control.markAllAsTouched(); return; }
    this.saving = true;
    this.error = false;
    const payload = { ...this.model };
    payload.imageUrl = payload.imageUrl?.trim() || null;
    payload.startDate = payload.startDate || null;
    payload.endDate = payload.endDate || null;
    payload.slug = payload.slug?.trim() || undefined;
    for (const field of this.fields) for (const language of this.languages) {
      const key = this.fieldKey(field.key, language);
      payload[key] = payload[key]?.trim() ?? '';
    }
    this.api.createCatalogItem(payload).pipe(finalize(() => this.saving = false)).subscribe({
      next: () => this.saved = true,
      error: () => this.error = true,
    });
  }
}
