import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { finalize } from 'rxjs';
import { CatalogItem, CatalogStatus, UserRole } from '../../core/api.models';
import { OperationsApiService } from '../../core/operations-api.service';
import { TranslatePipe } from '../../i18n/translate.pipe';
import { ContentEditorDialogComponent } from './content-editor-dialog.component';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog.component';
@Component({
  selector: 'app-content-manager', standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, TranslatePipe],
  templateUrl: './content-manager.component.html', styleUrl: './content-manager.component.scss',
})
export class ContentManagerComponent implements OnInit {
  @Input({ required: true }) role!: UserRole;
  @Output() readonly addRequested = new EventEmitter<void>();
  items: CatalogItem[] = [];
  status: CatalogStatus | '' = '';
  search = '';
  loading = true;
  error = '';
  constructor(private readonly api: OperationsApiService, private readonly dialog: MatDialog) {}
  ngOnInit(): void { this.load(); }
  load(): void {
    this.loading = true; this.error = '';
    this.api.catalog({ division: 'travel', type: 'trip', status: this.status, search: this.search }).pipe(finalize(() => this.loading = false)).subscribe({ next: response => this.items = response.data, error: () => this.error = 'dashboard.loadToursError' });
  }
  openEditor(item: CatalogItem): void {
    this.dialog.open(ContentEditorDialogComponent, { data: { item }, direction: document.documentElement.lang.startsWith('en') ? 'ltr' : 'rtl', maxWidth: '96vw', panelClass: 'content-editor-dialog' }).afterClosed().subscribe(saved => { if (saved) this.load(); });
  }
  remove(item: CatalogItem): void {
    if (this.role !== 'admin') return;
    this.dialog.open(ConfirmationDialogComponent, {
      direction: document.documentElement.lang.startsWith('en') ? 'ltr' : 'rtl',
      data: {
        title: { ar: 'هل أنت متأكد أنك تريد الحذف؟', en: 'Are you sure you want to delete?' },
        content: {
          ar: `سيتم حذف «${item.titleAr}» نهائياً. استخدم الأرشفة بدلاً من الحذف إذا كان المحتوى قد نُشر من قبل.`,
          en: `“${item.titleEn}” will be permanently deleted. Archive it instead if it has already been published.`,
        },
        danger: true,
      },
    }).afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.api.deleteCatalogItem(item.id).subscribe({ next: () => this.load(), error: () => (this.error = 'dashboard.deleteTourError') });
    });
  }

}
