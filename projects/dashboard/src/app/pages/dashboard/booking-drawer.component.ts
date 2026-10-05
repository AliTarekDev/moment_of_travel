import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Booking, BookingStatus, PaymentStatus, StaffUser } from '../../core/api.models';

@Component({
  selector:'app-booking-drawer', standalone:true, imports:[CommonModule,FormsModule],
  template:`<div class="drawer-scrim" (click)="closed.emit()"></div><aside class="booking-drawer"><header><div><span class="eyebrow">طلب حجز</span><h2>{{ booking.reference }}</h2></div><button type="button" (click)="closed.emit()" aria-label="إغلاق التفاصيل">×</button></header><div class="drawer-body"><section class="customer-card"><span>{{ initials(booking.customerName) }}</span><div><h3>{{ booking.customerName }}</h3><p>{{ booking.customerEmail }} · {{ booking.customerPhone }}</p></div></section>
  <div class="detail-grid">@if (booking.departureCity) {
    <div><span>مدينة المغادرة</span><strong>{{ booking.departureCity }}</strong></div>
    }<div><span>الوجهة</span><strong>{{ booking.destination }}</strong></div><div><span>الخدمة</span><strong>{{ label(booking.serviceType) }}</strong></div>@if (booking.tripType) {
    <div><span>نوع الرحلة</span><strong>{{ label(booking.tripType) }}</strong></div>
    }<div><span>تاريخ السفر</span><strong>{{ booking.departureDate ? (booking.departureDate | date:'d MMM y') : 'مرن' }}</strong></div>@if (booking.returnDate) {
    <div><span>تاريخ العودة</span><strong>{{ booking.returnDate | date:'d MMM y' }}</strong></div>
    }<div><span>عدد المسافرين</span><strong>{{ booking.travelers }}</strong></div><div><span>الخدمات المطلوبة</span><strong>{{ requestedServices() }}</strong></div>@if (booking.urgent) {
    <div><span>الأولوية</span><strong class="urgent-text">طلب مستعجل خلال 48 ساعة</strong></div>
  }</div>
  @if (booking.customerNotes) {
    <section class="notes"><span>ملاحظات العميل</span><p>{{ booking.customerNotes }}</p></section>
  }
  <label><span>حالة الحجز</span><select [(ngModel)]="booking.status" [disabled]="!canEdit">@for (status of statuses; track status) {
  <option [value]="status">{{ label(status) }}</option>
  }</select></label>
  <label><span>الموظف المسؤول</span><select [(ngModel)]="booking.assignedToId" [disabled]="!canEdit"><option [ngValue]="null">غير مُسند</option>@for (member of users; track member) {
  <option [ngValue]="member.id">{{ member.fullName }} · {{ label(member.role) }}</option>
  }</select></label>
  <div class="money-grid"><label><span>إجمالي عرض السعر</span><input type="number" min="0" step="0.01" [(ngModel)]="booking.totalAmount" [disabled]="!canEdit" /></label><label><span>العملة</span><select [(ngModel)]="booking.currency" [disabled]="!canEdit"><option value="EGP">جنيه مصري</option><option value="SAR">ريال سعودي</option><option value="USD">دولار أمريكي</option><option value="EUR">يورو</option></select></label></div>
  <label><span>حالة الدفع</span><select [ngModel]="booking.paymentStatus" (ngModelChange)="paymentChanged.emit($event)" [disabled]="!canManagePayments||saving">@for (payment of paymentStatuses; track payment) {
  <option [value]="payment">{{ label(payment) }}</option>
  }</select></label>
  <label><span>ملاحظات داخلية</span><textarea rows="5" [(ngModel)]="booking.internalNotes" [disabled]="!canEdit" placeholder="اكتب هنا تفاصيل التسليم والخطوات التالية"></textarea></label></div>
  <footer><small>آخر تحديث {{ booking.updatedAt | date:'d MMM y، HH:mm' }}</small>@if (canEdit) {
  <button type="button" class="primary" [disabled]="saving" (click)="saveRequested.emit()">{{ saving ? 'جارٍ الحفظ…' : 'حفظ التغييرات' }}</button>
  }</footer></aside>`,
})
export class BookingDrawerComponent {
  @Input({required:true}) booking!:Booking; @Input() users:StaffUser[]=[]; @Input() canEdit=false; @Input() canManagePayments=false; @Input() saving=false;
  @Output() closed=new EventEmitter<void>(); @Output() saveRequested=new EventEmitter<void>(); @Output() paymentChanged=new EventEmitter<PaymentStatus>();
  readonly statuses:BookingStatus[]=['new','reviewing','quoted','confirmed','completed','cancelled']; readonly paymentStatuses:PaymentStatus[]=['unpaid','pending','partially_paid','paid','refunded'];
  label(value:string):string{return ({admin:'مسؤول النظام',manager:'مدير',reception:'موظف استقبال',accountant:'محاسب',new:'جديد',reviewing:'قيد المراجعة',quoted:'تم إرسال عرض',confirmed:'مؤكد',completed:'مكتمل',cancelled:'ملغي',unpaid:'غير مدفوع',pending:'قيد الدفع',partially_paid:'مدفوع جزئياً',paid:'مدفوع',refunded:'مسترد',flight:'طيران',hotel:'فندق',tour:'رحلة سياحية',cruise:'رحلة بحرية',car:'تأجير سيارة',private_aviation:'طيران خاص',one_way:'ذهاب فقط',round_trip:'ذهاب وعودة'} as Record<string,string>)[value]??value;}
  initials(name:string):string{return name.split(' ').slice(0,2).map(part=>part[0]).join('').toUpperCase();}
  requestedServices():string{const values=[this.booking.includesTickets?'تذاكر':'',this.booking.includesHotels?'فنادق':'',this.booking.includesTransport?'مواصلات':''].filter(Boolean);return values.length?values.join('، '):'غير محدد';}
}
