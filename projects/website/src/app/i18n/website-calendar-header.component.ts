import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCalendar, MatCalendarHeader, MatDatepickerIntl } from '@angular/material/datepicker';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronDown, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

// Keep Material's calendar navigation, date bounds and localized labels while replacing its icons.
@Component({
  selector: 'app-website-calendar-header',
  standalone: true,
  imports: [MatButtonModule, FontAwesomeModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="calendar-controls">
      <span class="cdk-visually-hidden" aria-live="polite">{{ periodButtonDescription }}</span>
      <button mat-button type="button" class="calendar-period" (click)="currentPeriodClicked()" [attr.aria-label]="periodButtonLabel">
        <span>{{ periodButtonText }}</span>
        <fa-icon [icon]="icons.down" [class.is-inverted]="calendar.currentView !== 'month'" aria-hidden="true" />
      </button>
      <button mat-icon-button type="button" [disabled]="!previousEnabled()" (click)="previousClicked()" [attr.aria-label]="prevButtonLabel">
        <fa-icon class="calendar-direction" [icon]="icons.previous" aria-hidden="true" />
      </button>
      <button mat-icon-button type="button" [disabled]="!nextEnabled()" (click)="nextClicked()" [attr.aria-label]="nextButtonLabel">
        <fa-icon class="calendar-direction" [icon]="icons.next" aria-hidden="true" />
      </button>
    </div>
  `,
  styles: [`
    .calendar-controls { display: flex; align-items: center; padding: 8px; }
    .calendar-period { margin-inline-end: auto; }
    .calendar-period fa-icon { display: inline-block; margin-inline-start: 8px; font-size: 12px; }
    .is-inverted { transform: rotate(180deg); }
    .calendar-direction { display: inline-block; }
    :host-context([dir='rtl']) .calendar-direction { transform: scaleX(-1); }
  `],
})
export class WebsiteCalendarHeaderComponent extends MatCalendarHeader<Date> {
  readonly icons = { down: faChevronDown, previous: faChevronLeft, next: faChevronRight };

  constructor() {
    super(inject(MatDatepickerIntl), inject(MatCalendar<Date>), inject(DateAdapter<Date>), inject(MAT_DATE_FORMATS), inject(ChangeDetectorRef));
  }
}
