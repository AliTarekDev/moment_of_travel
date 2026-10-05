
import { Component, Inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CatalogItem, CatalogPayload } from '../../core/api.models';

export interface ContentEditorData {
  item?: CatalogItem;
}

@Component({
  selector: 'app-content-editor-dialog',
  standalone: true,
  imports: [FormsModule, MatDialogModule, MatButtonModule],
  template: `
    <div class="editor" dir="rtl">
      <header>
        <div><span>إدارة المحتوى</span><h2>{{ data.item ? 'تعديل العنصر' : 'إضافة رحلة أو محتوى' }}</h2></div>
        <button type="button" class="close" (click)="dialogRef.close()" aria-label="إغلاق">×</button>
      </header>
      <form #form="ngForm" (ngSubmit)="submit(form)">
        <section class="settings-grid">
          <label><span>مكان الظهور</span><select required name="division" [(ngModel)]="model.division"><option value="travel">وكالة السفر</option><option value="aviation">الطيران</option></select></label>
          <label><span>نوع المحتوى</span><select required name="type" [(ngModel)]="model.type"><option value="trip">رحلة</option><option value="offer">عرض</option><option value="destination">وجهة</option><option value="hotel">فندق</option><option value="flight">طيران</option><option value="service">خدمة</option></select></label>
          <label><span>حالة النشر</span><select required name="status" [(ngModel)]="model.status"><option value="draft">مسودة</option><option value="published">منشور</option><option value="archived">مؤرشف</option></select></label>
        </section>

        <div class="languages">
          <section>
            <h3>المحتوى العربي</h3>
            <label><span>العنوان</span><input required minlength="2" maxlength="180" name="titleAr" [(ngModel)]="model.titleAr" /></label>
            <label><span>نبذة قصيرة</span><textarea required minlength="2" maxlength="700" rows="3" name="summaryAr" [(ngModel)]="model.summaryAr"></textarea></label>
            <label><span>التفاصيل</span><textarea maxlength="6000" rows="5" name="descriptionAr" [(ngModel)]="model.descriptionAr"></textarea></label>
            <label><span>الموقع أو الوجهة</span><input maxlength="180" name="locationAr" [(ngModel)]="model.locationAr" /></label>
          </section>
          <section dir="ltr">
            <h3>English content</h3>
            <label><span>Title</span><input required minlength="2" maxlength="180" name="titleEn" [(ngModel)]="model.titleEn" /></label>
            <label><span>Short summary</span><textarea required minlength="2" maxlength="700" rows="3" name="summaryEn" [(ngModel)]="model.summaryEn"></textarea></label>
            <label><span>Description</span><textarea maxlength="6000" rows="5" name="descriptionEn" [(ngModel)]="model.descriptionEn"></textarea></label>
            <label><span>Location / destination</span><input maxlength="180" name="locationEn" [(ngModel)]="model.locationEn" /></label>
          </section>
        </div>

        <section class="details-grid">
          <label class="wide"><span>رابط الصورة (HTTPS)</span><input type="url" name="imageUrl" placeholder="https://..." [(ngModel)]="model.imageUrl" /></label>
          <label><span>السعر</span><input type="number" min="0" step="0.01" name="price" [(ngModel)]="model.price" /></label>
          <label><span>العملة</span><select name="currency" [(ngModel)]="model.currency"><option value="SAR">SAR</option><option value="EGP">EGP</option><option value="USD">USD</option><option value="EUR">EUR</option></select></label>
          <label><span>تاريخ البداية</span><input type="date" name="startDate" [(ngModel)]="model.startDate" /></label>
          <label><span>تاريخ النهاية</span><input type="date" name="endDate" [(ngModel)]="model.endDate" /></label>
          <label><span>ترتيب الظهور</span><input type="number" min="-10000" max="10000" name="sortOrder" [(ngModel)]="model.sortOrder" /></label>
          <label class="check"><input type="checkbox" name="featured" [(ngModel)]="model.featured" /><span>إبرازه في أول القائمة</span></label>
        </section>
        @if (dateInvalid) {
          <p class="validation">تاريخ النهاية يجب ألا يسبق تاريخ البداية.</p>
        }
        <footer><button mat-button type="button" (click)="dialogRef.close()">إلغاء</button><button mat-flat-button class="save" type="submit">حفظ المحتوى</button></footer>
      </form>
    </div>
    `,
  styles: [`
    :host { display:block; color:#2d3a37; } * { box-sizing:border-box; } .editor { width:min(920px, calc(100vw - 34px)); max-height:90vh; overflow:auto; background:#f8f5ef; }
    header { position:sticky; top:0; z-index:2; display:flex; justify-content:space-between; align-items:flex-start; padding:22px 25px; border-bottom:1px solid #e1ddd5; background:#f8f5ef; }
    header span { color:#9c646d; font-size:10px; font-weight:900; } h2 { margin:6px 0 0; font:500 23px Georgia,serif; } .close { border:0; background:none; color:#77817e; font-size:26px; cursor:pointer; }
    form { padding:22px 25px 0; } .settings-grid,.details-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:13px; } .languages { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin:20px 0; }
    .languages section { display:grid; align-content:start; gap:12px; border:1px solid #e1ddd5; border-radius:14px; padding:17px; background:#fff; } h3 { margin:0 0 3px; font:600 15px Georgia,serif; }
    label { display:grid; gap:6px; color:#5d6865; font-size:10px; font-weight:800; } input,select,textarea { width:100%; border:1px solid #d9d5cd; border-radius:9px; padding:10px 11px; background:#fff; color:#34413e; font:inherit; font-weight:400; outline:none; } textarea { resize:vertical; line-height:1.55; }
    input:focus,select:focus,textarea:focus { border-color:#a76a73; box-shadow:0 0 0 3px rgba(163,101,111,.09); } .wide { grid-column:span 2; } .check { display:flex; align-items:center; flex-direction:row; align-self:end; min-height:39px; } .check input { width:auto; }
    .validation { color:#9f4e55; font-size:10px; } footer { position:sticky; bottom:0; display:flex; justify-content:flex-end; gap:8px; margin:22px -25px 0; padding:15px 25px; border-top:1px solid #e1ddd5; background:#fff; } .save { background:#8f5761!important; color:#fff!important; }
    @media(max-width:700px){ .languages,.settings-grid,.details-grid{grid-template-columns:1fr}.wide{grid-column:auto} form{padding-inline:16px} header{padding-inline:16px} footer{margin-inline:-16px;padding-inline:16px} }
  `],
})
export class ContentEditorDialogComponent {
  readonly model: CatalogPayload;
  dateInvalid = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) readonly data: ContentEditorData,
    readonly dialogRef: MatDialogRef<ContentEditorDialogComponent, CatalogPayload>,
  ) {
    const item = data.item;
    this.model = {
      slug: item?.slug ?? '', division: item?.division ?? 'travel', type: item?.type ?? 'trip', status: item?.status ?? 'draft',
      titleAr: item?.titleAr ?? '', titleEn: item?.titleEn ?? '', summaryAr: item?.summaryAr ?? '', summaryEn: item?.summaryEn ?? '',
      descriptionAr: item?.descriptionAr ?? null, descriptionEn: item?.descriptionEn ?? null, locationAr: item?.locationAr ?? null,
      locationEn: item?.locationEn ?? null, imageUrl: item?.imageUrl ?? null, price: item?.price ? Number(item.price) : null,
      currency: item?.currency ?? 'SAR', startDate: item?.startDate ?? null, endDate: item?.endDate ?? null,
      featured: item?.featured ?? false, sortOrder: item?.sortOrder ?? 0,
    };
  }

  submit(form: NgForm): void {
    this.dateInvalid = !!(this.model.startDate && this.model.endDate && this.model.endDate < this.model.startDate);
    if (form.invalid || this.dateInvalid) { form.control.markAllAsTouched(); return; }
    this.dialogRef.close(this.model);
  }
}
