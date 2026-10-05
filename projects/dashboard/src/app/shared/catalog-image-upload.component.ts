import { Component, DestroyRef, EventEmitter, Input, Output, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { OperationsApiService } from '../core/operations-api.service';
import { TranslatePipe } from '../i18n/translate.pipe';

@Component({
  selector: 'app-catalog-image-upload', standalone: true, imports: [TranslatePipe],
  template: `
    <label>{{ 'newTour.image' | t }}<input #picker type="file" accept="image/jpeg,image/png,image/webp" [disabled]="disabled || uploading" (change)="select(picker)" /></label>
    <small>{{ 'newTour.imageHelp' | t }}</small>
    @if (uploading) { <p role="status">{{ 'newTour.imageUploading' | t }}</p> }
    @if (errorKey) { <p class="error" role="alert">{{ errorKey | t }}</p> }
    @if (imageUrl) { <img [src]="imageUrl" [alt]="'newTour.imagePreview' | t" /> }
    @if (imageUrl || errorKey) { <button type="button" [disabled]="disabled || uploading" (click)="clear(picker)">{{ 'newTour.removeImage' | t }}</button> }
  `,
  styles: `:host { display: block; min-width: 0; } label { display: grid; gap: 8px; font-size: 12px; } input { width: 100%; box-sizing: border-box; border: 1px solid #cfc9c1; border-radius: 8px; padding: 10px; font: inherit; background: white; } small { display: block; margin-top: 8px; color: #68736f; } img { display: block; width: 100%; max-width: 300px; height: 180px; object-fit: cover; border-radius: 10px; margin-block: 12px; } .error { color: #9f3545; } button { border: 0; border-radius: 8px; background: #e9e4dd; padding: 8px 12px; cursor: pointer; }`,
})
export class CatalogImageUploadComponent {
  @Input() imageUrl: string | null = null;
  @Input() disabled = false;
  @Output() readonly imageUrlChange = new EventEmitter<string | null>();
  @Output() readonly uploadingChange = new EventEmitter<boolean>();
  @Output() readonly validChange = new EventEmitter<boolean>();
  private readonly api = inject(OperationsApiService);
  private readonly destroyRef = inject(DestroyRef);
  uploading = false;
  errorKey = '';
  select(input: HTMLInputElement): void {
    const file = input.files?.[0];
    if (!file || this.uploading) return;
    this.errorKey = '';
    this.validChange.emit(false);
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || !file.size || file.size > 5 * 1024 * 1024) {
      this.errorKey = 'newTour.imageInvalid';
      input.value = '';
      return;
    }
    this.uploading = true;
    this.uploadingChange.emit(true);
    this.api.uploadCatalogImage(file).pipe(takeUntilDestroyed(this.destroyRef), finalize(() => {
      this.uploading = false;
      this.uploadingChange.emit(false);
    })).subscribe({
      next: result => { this.imageUrlChange.emit(result.imageUrl); this.validChange.emit(true); },
      error: (error: HttpErrorResponse) => {
        const messages: Record<number, string> = {
          0: 'newTour.imageUploadOffline',
          400: 'newTour.imageInvalid',
          401: 'newTour.imageUploadSessionExpired',
          403: 'newTour.imageUploadForbidden',
          404: 'newTour.imageUploadUnavailable',
          413: 'newTour.imageInvalid',
        };
        this.errorKey = messages[error.status] ?? 'newTour.imageUploadError';
        input.value = '';
      },
    });
  }
  clear(input: HTMLInputElement): void {
    input.value = '';
    this.errorKey = '';
    this.imageUrlChange.emit(null);
    this.validChange.emit(true);
  }
}
