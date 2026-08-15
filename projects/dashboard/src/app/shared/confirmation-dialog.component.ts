import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

export interface LocalizedDialogText {
  ar: string;
  en: string;
}

export interface ConfirmationDialogData {
  title: LocalizedDialogText;
  content: LocalizedDialogText;
  confirmLabel?: LocalizedDialogText;
  cancelLabel?: LocalizedDialogText;
  danger?: boolean;
}

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, FontAwesomeModule],
  template: `
    <div class="confirm-dialog" [dir]="language === 'ar' ? 'rtl' : 'ltr'">
      <div class="warning" [class.danger]="data.danger !== false">
        <fa-icon [icon]="warningIcon" />
      </div>
      <h2 mat-dialog-title>{{ text(data.title) }}</h2>
      <mat-dialog-content>{{ text(data.content) }}</mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="dialogRef.close(false)">{{ text(data.cancelLabel ?? defaults.cancel) }}</button>
        <button mat-flat-button type="button" class="confirm" (click)="dialogRef.close(true)">{{ text(data.confirmLabel ?? defaults.confirm) }}</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .confirm-dialog { width:min(430px,calc(100vw - 42px)); padding:27px 27px 18px; text-align:center; color:#2d3936; }
    .warning { width:62px; height:62px; margin:0 auto 10px; display:grid; place-items:center; border-radius:50%; background:#fff1db; color:#b87822; font-size:27px; box-shadow:0 0 0 8px #fff8ed; }
    .warning.danger { background:#f9e2e4; color:#a9434d; box-shadow:0 0 0 8px #fdf1f2; }
    h2[mat-dialog-title] { margin:17px 0 7px; padding:0; font:600 22px/1.3 Georgia,serif; }
    mat-dialog-content { padding:0 6px 21px!important; color:#727c79; font-size:12px; line-height:1.75; }
    mat-dialog-actions { min-height:auto; gap:8px; padding:0; }
    mat-dialog-actions button { min-width:105px; border-radius:9px; }
    .confirm { background:#9b4f57!important; color:#fff!important; }
  `],
})
export class ConfirmationDialogComponent {
  readonly warningIcon = faTriangleExclamation;
  readonly language: 'ar' | 'en';
  readonly defaults = {
    confirm: { ar: 'نعم، احذف', en: 'Yes, delete' },
    cancel: { ar: 'إلغاء', en: 'Cancel' },
  } satisfies Record<string, LocalizedDialogText>;

  constructor(
    @Inject(MAT_DIALOG_DATA) readonly data: ConfirmationDialogData,
    @Inject(DOCUMENT) document: Document,
    readonly dialogRef: MatDialogRef<ConfirmationDialogComponent, boolean>,
  ) {
    this.language = document.documentElement.lang.toLowerCase().startsWith('en') ? 'en' : 'ar';
  }

  text(value: LocalizedDialogText): string {
    return value[this.language];
  }
}
