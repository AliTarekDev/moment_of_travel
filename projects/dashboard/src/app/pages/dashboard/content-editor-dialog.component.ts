import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CatalogItem } from '../../core/api.models';
import { NewTourComponent } from './new-tour.component';
export interface ContentEditorData { item?: CatalogItem; }
@Component({
  selector: 'app-content-editor-dialog', standalone: true, imports: [NewTourComponent],
  template: '<app-new-tour [item]="data.item" (back)="dialogRef.close()" (tourSaved)="dialogRef.close(true)" />',
  styles: ':host { display: block; width: min(1050px, 94vw); max-height: 90vh; overflow: auto; }',
})
export class ContentEditorDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) readonly data: ContentEditorData, readonly dialogRef: MatDialogRef<ContentEditorDialogComponent, boolean>) {}
}
