import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowTrendUp, faCalendarCheck, faCheck, faCircleDollarToSlot } from '@fortawesome/free-solid-svg-icons';
import { Booking, DashboardSummary } from '../../core/api.models';

@Component({
  selector: 'app-overview-view',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  template: `
    <section class="stat-grid" *ngIf="summary as totals">
      <article class="stat-card stat-card--accent"><div><span>إجمالي الحجوزات</span><strong>{{ totals.total }}</strong><small>جميع مراحل الحجوزات</small></div><i><fa-icon [icon]="icons.trend" /></i></article>
      <article class="stat-card"><div><span>طلبات جديدة</span><strong>{{ totals.statusCounts.new }}</strong><small>في انتظار أول رد</small></div><i><fa-icon [icon]="icons.bookings" /></i></article>
      <article class="stat-card"><div><span>حجوزات مؤكدة</span><strong>{{ totals.statusCounts.confirmed }}</strong><small>جاهزة للتنفيذ</small></div><i><fa-icon [icon]="icons.check" /></i></article>
      <article class="stat-card"><div><span>الإيراد المدفوع</span><strong>{{ totals.paidRevenue | currency:totals.currency:'symbol':'1.0-0' }}</strong><small>الحجوزات المسجلة كمدفوعة</small></div><i><fa-icon [icon]="icons.money" /></i></article>
    </section>
    <section class="overview-grid">
      <article class="panel bookings-panel">
        <div class="panel-heading"><div><span class="eyebrow">متابعة مباشرة</span><h2>أحدث الطلبات</h2></div><button type="button" class="text-button" (click)="viewAll.emit()">عرض الكل ←</button></div>
        <div class="table-wrap"><table><thead><tr><th>رقم الحجز</th><th>المسافر</th><th>الرحلة</th><th>الحالة</th><th>المسؤول</th></tr></thead><tbody>
          <tr *ngFor="let booking of bookings | slice:0:7" (click)="bookingSelected.emit(booking)"><td><strong>{{ booking.reference }}</strong><small>{{ booking.createdAt | date:'d MMM, HH:mm' }}</small></td><td><strong>{{ booking.customerName }}</strong><small>{{ booking.travelers }} مسافر</small></td><td><strong>{{ booking.destination }}</strong><small>{{ label(booking.serviceType) }}</small></td><td><span class="status" [attr.data-status]="booking.status">{{ label(booking.status) }}</span></td><td><span class="owner" *ngIf="booking.assignedTo; else unassigned">{{ booking.assignedTo.fullName }}</span><ng-template #unassigned><small>غير مُسند</small></ng-template></td></tr>
          <tr *ngIf="!bookings.length"><td colspan="5" class="empty">لا توجد طلبات حجز حتى الآن. ستظهر طلبات الموقع الجديدة هنا.</td></tr>
        </tbody></table></div>
      </article>
      <article class="panel pulse-panel" *ngIf="summary as totals"><div class="panel-heading"><div><span class="eyebrow">نظرة سريعة</span><h2>مراحل الحجوزات</h2></div></div><div class="pulse-list"><div><span><i class="dot dot--new"></i>جديد</span><b>{{ totals.statusCounts.new }}</b></div><div><span><i class="dot dot--reviewing"></i>قيد المراجعة</span><b>{{ totals.statusCounts.reviewing }}</b></div><div><span><i class="dot dot--quoted"></i>تم إرسال عرض</span><b>{{ totals.statusCounts.quoted }}</b></div><div><span><i class="dot dot--confirmed"></i>مؤكد</span><b>{{ totals.statusCounts.confirmed }}</b></div><div><span><i class="dot dot--completed"></i>مكتمل</span><b>{{ totals.statusCounts.completed }}</b></div></div><div class="principle"><span>قاعدة الخدمة</span><blockquote>يجب إسناد كل طلب جديد إلى موظف وتحديد موعد للرد الأول.</blockquote></div></article>
    </section>
  `,
})
export class OverviewViewComponent {
  @Input() summary: DashboardSummary | null = null;
  @Input() bookings: Booking[] = [];
  @Output() viewAll = new EventEmitter<void>();
  @Output() bookingSelected = new EventEmitter<Booking>();
  readonly icons = { trend: faArrowTrendUp, bookings: faCalendarCheck, check: faCheck, money: faCircleDollarToSlot };
  label(value: string): string { return ({new:'جديد',reviewing:'قيد المراجعة',quoted:'تم إرسال عرض',confirmed:'مؤكد',completed:'مكتمل',cancelled:'ملغي',flight:'طيران',hotel:'فندق',tour:'رحلة سياحية',cruise:'رحلة بحرية',car:'تأجير سيارة',private_aviation:'طيران خاص'} as Record<string,string>)[value] ?? value; }
}
