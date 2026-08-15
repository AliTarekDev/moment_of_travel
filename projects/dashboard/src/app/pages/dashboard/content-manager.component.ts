import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { finalize } from 'rxjs';
import { CatalogDivision, CatalogItem, CatalogPayload, CatalogStatus, UserRole } from '../../core/api.models';
import { OperationsApiService } from '../../core/operations-api.service';
import { ContentEditorDialogComponent } from './content-editor-dialog.component';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog.component';

@Component({
  selector: 'app-content-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatTableModule],
  template: `
    <section class="content-toolbar">
      <div><span>إدارة ما يظهر للعملاء</span><h2>الرحلات والمحتوى</h2><p>العنصر المنشور يظهر مباشرة في القسم المختار بالموقع.</p></div>
      <button mat-flat-button class="primary" type="button" (click)="openEditor()">+ إضافة محتوى</button>
    </section>
    <div class="alert" *ngIf="error">{{ error }}<button type="button" (click)="error=''">×</button></div>
    <section class="panel">
      <div class="filters">
        <input [(ngModel)]="search" (keyup.enter)="load()" placeholder="ابحث بالعنوان أو الرابط" />
        <select [(ngModel)]="division" (change)="load()"><option value="">كل الأقسام</option><option value="travel">وكالة السفر</option><option value="aviation">الطيران</option></select>
        <select [(ngModel)]="status" (change)="load()"><option value="">كل الحالات</option><option value="draft">مسودة</option><option value="published">منشور</option><option value="archived">مؤرشف</option></select>
        <button type="button" (click)="load()">بحث</button>
      </div>
      <div class="loading" *ngIf="loading">جارٍ تحميل المحتوى…</div>
      <div class="table-wrap" *ngIf="!loading">
        <table mat-table [dataSource]="items">
          <ng-container matColumnDef="content"><th mat-header-cell *matHeaderCellDef>المحتوى</th><td mat-cell *matCellDef="let item"><div class="item"><img *ngIf="item.imageUrl" [src]="item.imageUrl" alt="" /><span *ngIf="!item.imageUrl">M</span><div><strong>{{ item.titleAr }}</strong><small>{{ item.titleEn }}</small></div></div></td></ng-container>
          <ng-container matColumnDef="division"><th mat-header-cell *matHeaderCellDef>القسم</th><td mat-cell *matCellDef="let item">{{ label(item.division) }}<small>{{ label(item.type) }}</small></td></ng-container>
          <ng-container matColumnDef="price"><th mat-header-cell *matHeaderCellDef>السعر</th><td mat-cell *matCellDef="let item">{{ item.price ? (item.price | number:'1.0-2') + ' ' + item.currency : 'حسب الطلب' }}</td></ng-container>
          <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>الحالة</th><td mat-cell *matCellDef="let item"><span class="status" [attr.data-status]="item.status">{{ label(item.status) }}</span><small *ngIf="item.featured">مميّز</small></td></ng-container>
          <ng-container matColumnDef="updated"><th mat-header-cell *matHeaderCellDef>آخر تحديث</th><td mat-cell *matCellDef="let item">{{ item.updatedAt | date:'d MMM y، HH:mm' }}</td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef>الإجراءات</th><td mat-cell *matCellDef="let item" class="actions"><button type="button" (click)="openEditor(item)">تعديل</button><button *ngIf="role==='admin'" type="button" class="delete" (click)="remove(item)">حذف</button></td></ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr><tr mat-row *matRowDef="let row; columns:columns"></tr>
        </table>
        <p class="empty" *ngIf="!items.length">لا يوجد محتوى مطابق. ابدأ بإضافة أول رحلة أو عرض.</p>
      </div>
    </section>
  `,
  styles: [`
    :host{display:block;color:#2d3936}.content-toolbar{display:flex;justify-content:space-between;align-items:center;gap:20px;margin-bottom:18px}.content-toolbar>div>span{color:#9c646d;font-size:9px;font-weight:900;letter-spacing:.12em}.content-toolbar h2{margin:6px 0 3px;font:500 24px Georgia,serif}.content-toolbar p{margin:0;color:#818a87;font-size:10px}.primary{background:#8f5761!important;color:#fff!important}.panel{overflow:hidden;border:1px solid #e0ddd6;border-radius:16px;background:rgba(255,255,255,.82)}
    .filters{display:flex;gap:10px;padding:17px}.filters input{flex:1}.filters input,.filters select{border:1px solid #dad7d0;border-radius:9px;padding:10px 12px;background:#fff;font:inherit;font-size:10px}.filters button,.actions button{border:0;border-radius:8px;padding:9px 13px;background:#e9e4dd;color:#4b5754;font:inherit;font-size:9px;font-weight:800;cursor:pointer}.table-wrap{overflow-x:auto}table{width:100%;min-width:850px}.mat-mdc-header-cell{background:#f8f6f2;color:#858e8b;font-size:9px}.mat-mdc-cell{font-size:10px;border-bottom-color:#ece9e3}.item{display:flex;align-items:center;gap:11px}.item>img,.item>span{width:45px;height:40px;border-radius:9px;object-fit:cover;background:#ece4df;display:grid;place-items:center;color:#945f67;font-weight:900}.item div{display:grid;gap:3px}.item small,td>small{display:block;color:#999f9d;font-size:8px;margin-top:3px}.status{display:inline-flex;border-radius:12px;padding:5px 9px;font-size:8px;font-weight:900;background:#ebecea}.status[data-status=published]{background:#e2eee9;color:#4f7d69}.status[data-status=draft]{background:#f4ebd9;color:#927039}.status[data-status=archived]{background:#e8e8ef;color:#686884}.actions{white-space:nowrap}.actions .delete{margin-right:6px;background:#f4e2e3;color:#9f4e55}.loading,.empty{padding:40px;text-align:center;color:#89928f;font-size:10px}.alert{display:flex;justify-content:space-between;margin-bottom:14px;border:1px solid #e6c8c9;border-radius:10px;padding:11px 14px;background:#f9e9e9;color:#8f484f;font-size:10px}.alert button{border:0;background:none;color:inherit}.empty{margin:0}
    @media(max-width:700px){.content-toolbar{align-items:flex-start;flex-direction:column}.filters{flex-wrap:wrap}.filters input{flex-basis:100%}.filters select{flex:1}}
  `],
})
export class ContentManagerComponent implements OnInit {
  @Input({ required: true }) role!: UserRole;
  readonly columns = ['content', 'division', 'price', 'status', 'updated', 'actions'];
  items: CatalogItem[] = [];
  division: CatalogDivision | '' = '';
  status: CatalogStatus | '' = '';
  search = '';
  loading = true;
  error = '';

  constructor(private readonly api: OperationsApiService, private readonly dialog: MatDialog) {}
  ngOnInit(): void { this.load(); }
  load(): void { this.loading=true; this.error=''; this.api.catalog({division:this.division,status:this.status,search:this.search}).pipe(finalize(()=>this.loading=false)).subscribe({next:r=>this.items=r.data,error:()=>this.error='تعذر تحميل المحتوى. تأكد من تشغيل API وتطبيق migration 003.'}); }
  openEditor(item?: CatalogItem): void { const ref=this.dialog.open(ContentEditorDialogComponent,{data:{item},direction:'rtl',maxWidth:'96vw',panelClass:'content-editor-dialog'}); ref.afterClosed().subscribe((payload?:CatalogPayload)=>{if(!payload)return; const request=item?this.api.updateCatalogItem(item.id,payload):this.api.createCatalogItem(payload); request.subscribe({next:()=>this.load(),error:()=>this.error='تعذر حفظ المحتوى. راجع الحقول وتأكد من صحة رابط الصورة والتواريخ.'});}); }
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
      this.api.deleteCatalogItem(item.id).subscribe({ next: () => this.load(), error: () => (this.error = 'تعذر حذف المحتوى.') });
    });
  }
  label(value:string):string { return ({travel:'وكالة السفر',aviation:'الطيران',trip:'رحلة',offer:'عرض',destination:'وجهة',hotel:'فندق',flight:'طيران',service:'خدمة',draft:'مسودة',published:'منشور',archived:'مؤرشف'} as Record<string,string>)[value]??value; }
}
