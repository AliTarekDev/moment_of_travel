import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TranslatePipe } from '../../i18n/translate.pipe';

@Component({
  selector: 'app-tour-photo-dialog',
  standalone: true,
  imports: [MatDialogModule, TranslatePipe],
  template: `
    <div class="photo-viewer">
      <header>
        <h2 id="tour-photo-title" dir="auto">{{ data.title }}</h2>
        <button type="button" mat-dialog-close [aria-label]="'itineraryPhoto.close' | t"><span aria-hidden="true">×</span></button>
      </header>
      <img [src]="data.image" [alt]="data.title" />
    </div>
  `,
  styles: `
    :host { display: block; }
    .photo-viewer { background: #21191f; color: #fff; }
    header { display: flex; align-items: center; justify-content: space-between; gap: 24px; padding: 16px 20px; }
    h2 { margin: 0; color: #fff; font-family: var(--website-heading-font); font-size: 22px; line-height: 1.4; overflow-wrap: anywhere; }
    button { flex-shrink: 0; display: grid; place-items: center; width: 44px; height: 44px; padding: 0; border: 1px solid #ffffff60; border-radius: 50%; background: transparent; color: #fff; font: 32px/1 Arial, sans-serif; cursor: pointer; }
    button:hover { background: #ffffff20; }
    button:focus-visible { outline: 3px solid var(--brand-gold); outline-offset: 3px; }
    img { display: block; width: 100%; height: auto; max-height: min(70svh, 800px); object-fit: contain; }
    @media (max-width: 600px) { h2 { font-size: 18px; } header { gap: 12px; padding: 14px; } }
  `,
})
export class TourPhotoDialogComponent {
  readonly data = inject<{ image: string; title: string }>(MAT_DIALOG_DATA);
}
