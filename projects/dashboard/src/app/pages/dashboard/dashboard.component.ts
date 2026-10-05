import { DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NewTourComponent } from './new-tour.component';
import { TranslatePipe } from '../../i18n/translate.pipe';

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowRightFromBracket,
  faBars,
  faCalendarCheck,
  faHouse,
  faLayerGroup,
  faPlus,
  faRotate,
  faUsers,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { finalize, forkJoin } from 'rxjs';
import {
  Booking,
  BookingStatus,
  DashboardSummary,
  PaymentStatus,
  StaffUser,
  UserRole,
} from '../../core/api.models';
import { AuthService } from '../../core/auth.service';
import { OperationsApiService } from '../../core/operations-api.service';
import { StaffDetailsDialogComponent, StaffDetailsDialogResult } from './staff-details-dialog.component';
import { ContentManagerComponent } from './content-manager.component';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog.component';
import { OverviewViewComponent } from './overview-view.component';
import { BookingsViewComponent } from './bookings-view.component';
import { TeamViewComponent } from './team-view.component';
import { BookingDrawerComponent } from './booking-drawer.component';

type View = 'newTour' | 'overview' | 'bookings' | 'content' | 'team';

@Component({
  selector: 'app-dashboard',
  providers: [TranslatePipe],
  standalone: true,
  imports: [NewTourComponent, TranslatePipe, MatButtonModule, MatTooltipModule, FontAwesomeModule, ContentManagerComponent, OverviewViewComponent, BookingsViewComponent, TeamViewComponent, BookingDrawerComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
  private readonly translation = inject(TranslatePipe);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  activeView: View = 'overview';
  menuOpen = false;
  loading = true;
  saving = false;
  deletingUserId = '';
  error = '';
  search = '';
  statusFilter: BookingStatus | '' = '';
  summary: DashboardSummary | null = null;
  bookings: Booking[] = [];
  users: StaffUser[] = [];
  selectedBooking: Booking | null = null;
  showNewUser = false;
  newUser = { fullName: '', email: '', password: '', role: 'reception' as UserRole };

  readonly icons = {
    add: faPlus,
    bookings: faCalendarCheck,
    close: faXmark,
    home: faHouse,
    content: faLayerGroup,
    logout: faArrowRightFromBracket,
    menu: faBars,
    refresh: faRotate,
    team: faUsers,
  };
  private readonly labels: Record<string, string> = {
    admin: 'مسؤول النظام',
    manager: 'مدير',
    reception: 'موظف استقبال',
    accountant: 'محاسب',
    new: 'جديد',
    reviewing: 'قيد المراجعة',
    quoted: 'تم إرسال عرض',
    confirmed: 'مؤكد',
    completed: 'مكتمل',
    cancelled: 'ملغي',
    unpaid: 'غير مدفوع',
    pending: 'قيد الدفع',
    partially_paid: 'مدفوع جزئياً',
    paid: 'مدفوع',
    refunded: 'مسترد',
    flight: 'طيران',
    hotel: 'فندق',
    tour: 'رحلة سياحية',
    cruise: 'رحلة بحرية',
    car: 'تأجير سيارة',
    private_aviation: 'طيران خاص',
    one_way: 'ذهاب فقط',
    round_trip: 'ذهاب وعودة',
  };

  constructor(
    readonly auth: AuthService,
    private readonly api: OperationsApiService,
    private readonly router: Router,
    private readonly dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      const view = this.route.snapshot.data['view'] ?? params.get('view');
      if (['overview', 'bookings', 'content', 'team', 'newTour'].includes(view ?? '')) {
        const allowed = !(view === 'team' && !this.canSeeTeam)
          && !(['content', 'newTour'].includes(view) && !this.canManageContent);
        if (allowed) this.activeView = view as View;
      }
    });
    this.refresh();
  }

  get user(): StaffUser | null {
    return this.auth.user();
  }

  get canEditBookings(): boolean {
    return this.user?.role !== 'accountant';
  }

  get canManagePayments(): boolean {
    return ['admin', 'manager', 'accountant'].includes(this.user?.role ?? '');
  }

  get canSeeTeam(): boolean {
    return ['admin', 'manager'].includes(this.user?.role ?? '');
  }

  get canManageContent(): boolean {
    return ['admin', 'manager'].includes(this.user?.role ?? '');
  }

  get pageTitle(): string {
    if (this.activeView === 'overview') return `مرحباً، ${this.user?.fullName?.split(' ')[0] || 'فريق العمل'}`;
    if (this.activeView === 'bookings') return 'إدارة الحجوزات';
    if (this.activeView === 'newTour') return this.translation.transform('newTour.title');
    if (this.activeView === 'content') return this.translation.transform('dashboard.tours');
    return 'فريق العمل';
  }

  refresh(): void {
    this.loading = true;
    this.error = '';
    forkJoin({
      summary: this.api.summary(),
      bookings: this.api.bookings({ status: this.statusFilter, search: this.search }),
      users: this.api.users(),
    })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: ({ summary, bookings, users }) => {
          this.summary = summary;
          this.bookings = bookings.data;
          this.users = users;
          if (this.selectedBooking) {
            const updated = this.bookings.find((booking) => booking.id === this.selectedBooking?.id);
            this.selectedBooking = updated ? { ...updated } : null;
          }
        },
        error: () => (this.error = 'تعذر تحميل بيانات العمليات. تأكد من تشغيل الخادم وقاعدة البيانات.'),
      });
  }

  changeView(view: View): void {
    if ((view === 'team' && !this.canSeeTeam) || ((view === 'newTour' || view === 'content') && !this.canManageContent)) return;
    if (view === 'newTour') { void this.router.navigate(['/tours/new']); }
    else if (this.route.snapshot.data['view'] === 'newTour') { void this.router.navigate(['/'], { queryParams: { view } }); }
    this.activeView = view;
    this.menuOpen = false;
  }

  selectBooking(booking: Booking): void {
    this.selectedBooking = { ...booking };
  }

  closeBooking(): void {
    this.selectedBooking = null;
  }

  saveBooking(): void {
    const booking = this.selectedBooking;
    if (!booking || !this.canEditBookings || this.saving) return;
    this.saving = true;
    this.error = '';
    const totalAmount = booking.totalAmount === null || booking.totalAmount === '' ? undefined : Number(booking.totalAmount);
    this.api
      .updateBooking(booking.id, {
        status: booking.status,
        assignedToId: booking.assignedToId ?? undefined,
        internalNotes: booking.internalNotes ?? '',
        totalAmount,
        currency: booking.currency,
      })
      .pipe(finalize(() => (this.saving = false)))
      .subscribe({
        next: (updated) => {
          this.replaceBooking(updated);
          this.selectedBooking = { ...updated };
          this.reloadSummary();
        },
        error: () => (this.error = 'تعذر حفظ الحجز. راجع البيانات وحاول مرة أخرى.'),
      });
  }

  setPayment(paymentStatus: PaymentStatus): void {
    const booking = this.selectedBooking;
    if (!booking || !this.canManagePayments || this.saving) return;
    this.saving = true;
    this.api
      .updatePayment(booking.id, paymentStatus)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe({
        next: (updated) => {
          this.replaceBooking(updated);
          this.selectedBooking = { ...updated };
          this.reloadSummary();
        },
        error: () => (this.error = 'تعذر تحديث حالة الدفع.'),
      });
  }

  createUser(): void {
    if (this.user?.role !== 'admin' || this.saving) return;
    this.saving = true;
    this.error = '';
    this.api
      .createUser(this.newUser)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe({
        next: (user) => {
          this.users = [...this.users, user];
          this.newUser = { fullName: '', email: '', password: '', role: 'reception' };
          this.showNewUser = false;
        },
        error: () => (this.error = 'تعذر إنشاء حساب الموظف. تحقق من البريد الإلكتروني ومتطلبات كلمة المرور.'),
      });
  }

  viewUser(member: StaffUser): void {
    if (!this.canSeeTeam) return;
    this.api.user(member.id).subscribe({
      next: (details) => {
        const dialogRef = this.dialog.open(StaffDetailsDialogComponent, {
          width: '520px',
          maxWidth: 'calc(100vw - 32px)',
          direction: 'rtl',
          data: {
            member: details,
            canDelete: this.user?.role === 'admin' && this.user.id !== details.id,
            canEdit: this.user?.role === 'admin',
            isCurrentUser: this.user?.id === details.id,
          },
        });
        dialogRef.afterClosed().subscribe((result: StaffDetailsDialogResult) => {
          if (result?.action === 'delete') this.deleteUser(details);
          if (result?.action === 'updated') {
            this.users = this.users.map((member) => (member.id === result.member.id ? result.member : member));
          }
        });
      },
      error: () => (this.error = 'تعذر تحميل تفاصيل الموظف.'),
    });
  }

  deleteUser(member: StaffUser): void {
    if (this.user?.role !== 'admin' || this.user.id === member.id || this.deletingUserId) return;
    this.dialog.open(ConfirmationDialogComponent, {
      direction: document.documentElement.lang.startsWith('en') ? 'ltr' : 'rtl',
      data: {
        title: { ar: 'هل أنت متأكد أنك تريد الحذف؟', en: 'Are you sure you want to delete?' },
        content: {
          ar: `سيتم حذف حساب الموظف ${member.fullName} نهائياً، ولا يمكن التراجع عن هذا الإجراء.`,
          en: `${member.fullName}'s staff account will be permanently deleted. This action cannot be undone.`,
        },
        danger: true,
      },
    }).afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.deletingUserId = member.id;
      this.error = '';
      this.api.deleteUser(member.id).pipe(finalize(() => (this.deletingUserId = ''))).subscribe({
        next: () => (this.users = this.users.filter((user) => user.id !== member.id)),
        error: () => (this.error = 'تعذر حذف الحساب. لا يمكنك حذف حسابك أو آخر مسؤول نظام نشط.'),
      });
    });
  }

  logout(): void {
    this.auth.logout().subscribe({ next: () => void this.router.navigateByUrl('/login') });
  }

  statusLabel(value: string): string {
    return this.labels[value] ?? value;
  }

  initials(name: string): string {
    return name.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase();
  }

  private replaceBooking(updated: Booking): void {
    this.bookings = this.bookings.map((booking) => (booking.id === updated.id ? updated : booking));
  }

  private reloadSummary(): void {
    this.api.summary().subscribe((summary) => (this.summary = summary));
  }
}
