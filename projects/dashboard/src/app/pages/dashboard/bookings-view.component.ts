import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { Booking, BookingStatus } from '../../core/api.models';

@Component({
  selector: 'app-bookings-view', standalone: true, imports: [CommonModule, FormsModule, FontAwesomeModule],
  template: `<section class="panel full-panel"><div class="filters"><label class="search"><span><fa-icon [icon]="searchIcon" /></span><input [(ngModel)]="search" (ngModelChange)="searchChange.emit($event)" (keyup.enter)="refreshRequested.emit()" placeholder="ابحث برقم الحجز أو المسافر أو الوجهة" /></label><select [(ngModel)]="statusFilter" (ngModelChange)="statusFilterChange.emit($event); refreshRequested.emit()"><option value="">جميع الحالات</option><option *ngFor="let status of statuses" [value]="status">{{ label(status) }}</option></select><button type="button" class="secondary" (click)="refreshRequested.emit()">تطبيق الفلاتر</button><span class="result-count">معروض {{ bookings.length }}</span></div>
  <div class="table-wrap table-wrap--large"><table><thead><tr><th>رقم الحجز</th><th>المسافر</th><th>الخدمة</th><th>تاريخ السفر</th><th>القيمة</th><th>الحالة</th><th>الدفع</th><th>المسؤول</th></tr></thead><tbody><tr *ngFor="let booking of bookings" (click)="bookingSelected.emit(booking)"><td><strong>{{ booking.reference }}</strong><small>{{ booking.createdAt | date:'d MMM y' }}</small></td><td><strong>{{ booking.customerName }}</strong><small>{{ booking.customerEmail }}</small></td><td><strong>{{ booking.destination }}</strong><small>{{ label(booking.serviceType) }} · {{ booking.travelers }}</small></td><td>{{ booking.departureDate ? (booking.departureDate | date:'d MMM y') : 'مرن' }}</td><td>{{ booking.totalAmount ? (booking.totalAmount | currency:booking.currency:'symbol':'1.0-0') : 'لم يُسعّر' }}</td><td><span class="status" [attr.data-status]="booking.status">{{ label(booking.status) }}</span></td><td><span class="payment" [attr.data-payment]="booking.paymentStatus">{{ label(booking.paymentStatus) }}</span></td><td><span *ngIf="booking.assignedTo; else noOwner">{{ booking.assignedTo.fullName }}</span><ng-template #noOwner><small>غير مُسند</small></ng-template></td></tr><tr *ngIf="!bookings.length"><td colspan="8" class="empty">لا توجد حجوزات مطابقة لهذه الفلاتر.</td></tr></tbody></table></div></section>`,
})
export class BookingsViewComponent {
  @Input() bookings: Booking[] = [];
  @Input() search = '';
  @Input() statusFilter: BookingStatus | '' = '';
  @Output() searchChange = new EventEmitter<string>();
  @Output() statusFilterChange = new EventEmitter<BookingStatus | ''>();
  @Output() refreshRequested = new EventEmitter<void>();
  @Output() bookingSelected = new EventEmitter<Booking>();
  readonly searchIcon = faMagnifyingGlass;
  readonly statuses: BookingStatus[] = ['new','reviewing','quoted','confirmed','completed','cancelled'];
  label(value:string):string { return ({new:'جديد',reviewing:'قيد المراجعة',quoted:'تم إرسال عرض',confirmed:'مؤكد',completed:'مكتمل',cancelled:'ملغي',unpaid:'غير مدفوع',pending:'قيد الدفع',partially_paid:'مدفوع جزئياً',paid:'مدفوع',refunded:'مسترد',flight:'طيران',hotel:'فندق',tour:'رحلة سياحية',cruise:'رحلة بحرية',car:'تأجير سيارة',private_aviation:'طيران خاص'} as Record<string,string>)[value] ?? value; }
}
