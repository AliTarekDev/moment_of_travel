import { BidiModule } from '@angular/cdk/bidi';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TourItineraryEditorComponent, emptyTourDay } from '../../shared/tour-itinerary-editor.component';
import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { finalize } from 'rxjs';
import { CatalogItem, CatalogPayload } from '../../core/api.models';
import { editableTourContent } from '../../shared/tour-edit-model';
import { OperationsApiService } from '../../core/operations-api.service';
import { TranslatePipe } from '../../i18n/translate.pipe';
import { CatalogImageUploadComponent } from '../../shared/catalog-image-upload.component';

@Component({
  selector: 'app-new-tour', standalone: true, imports: [BidiModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatCheckboxModule, TourItineraryEditorComponent, FormsModule, TranslatePipe, CatalogImageUploadComponent],
  templateUrl: './new-tour.component.html', styleUrl: './new-tour.component.scss',
})
export class NewTourComponent implements OnInit {
  @Input() item?: CatalogItem;
  @Output() readonly tourSaved = new EventEmitter<void>();
  private readonly api = inject(OperationsApiService);
  @Output() readonly back = new EventEmitter<void>();
  readonly languages = ['Ar', 'En'] as const;
  readonly fields = [
    { key: 'title', label: 'name', required: true, max: 180, rows: 1 },
    { key: 'summary', label: 'summary', required: true, max: 700, rows: 3 },
    { key: 'description', label: 'description', required: false, max: 6000, rows: 6 },
    { key: 'location', label: 'location', required: false, max: 180, rows: 1 },
  ] as const;
  days = [emptyTourDay()];
  model = this.emptyTour();
  saving = false;
  imageUploading = false;
  imageValid = true;
  saved = false;
  attempted = false;
  error = false;
  readonly nonBlank = /[\s\S]*\S[\s\S]*\S[\s\S]*/;
  ngOnInit(): void {
    if (!this.item) return;
    const content = editableTourContent(this.item);
    this.days = content.days;
    const { id, createdAt, updatedAt, ...payload } = this.item;
    this.model = { ...this.emptyTour(), ...payload, price: this.item.price === null ? null : Number(this.item.price), durationDays: content.duration, descriptionAr: content.descriptionAr, descriptionEn: content.descriptionEn };
  }
  fieldKey(field: typeof this.fields[number]['key'], language: 'Ar' | 'En') {
    return `${field}${language}` as 'titleAr' | 'titleEn' | 'summaryAr' | 'summaryEn' | 'descriptionAr' | 'descriptionEn' | 'locationAr' | 'locationEn';
  }
  private emptyTour(): CatalogPayload {
    return { division: 'travel', type: 'trip', status: 'draft', durationDays: 1, itinerary: [], slug: '', titleAr: '', titleEn: '', summaryAr: '', summaryEn: '', descriptionAr: '', descriptionEn: '', locationAr: '', locationEn: '', imageUrl: '', price: null, currency: 'EGP', startDate: null, endDate: null, featured: false, sortOrder: 0 };
  }
  another(): void { this.model = this.emptyTour(); this.days = [emptyTourDay()]; this.saved = false; this.error = false; this.attempted = false; }
  save(form: NgForm): void {
    if (this.saving || this.saved || this.imageUploading || !this.imageValid) return;
    this.attempted = true;
    if (form.invalid || this.days.length !== this.model.durationDays) { form.control.markAllAsTouched(); return; }
    this.error = false;
    const payload = { ...this.model };
    payload.imageUrl = payload.imageUrl?.trim() || null;
    payload.startDate = null;
    payload.endDate = null;
    payload.slug = payload.slug?.trim() || undefined;
    for (const field of this.fields) for (const language of this.languages) {
      const key = this.fieldKey(field.key, language);
      payload[key] = payload[key]?.trim() ?? '';
    }
    payload.itinerary = this.days.map(day => ({ titleAr: day.titleAr.trim(), titleEn: day.titleEn.trim(), textAr: day.textAr.trim(), textEn: day.textEn.trim() }));
    this.saving = true;
    const request = this.item ? this.api.updateCatalogItem(this.item.id, payload) : this.api.createCatalogItem(payload);
    request.pipe(finalize(() => this.saving = false)).subscribe({
      next: () => { this.saved = true; this.tourSaved.emit(); },
      error: () => this.error = true,
    });
  }
}
