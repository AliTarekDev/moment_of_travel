import { Injectable, effect, inject } from '@angular/core';
import { MatDatepickerIntl } from '@angular/material/datepicker';
import { LanguageService } from './language.service';

@Injectable()
export class WebsiteDatepickerIntl extends MatDatepickerIntl {
  constructor() {
    super();
    const languages = inject(LanguageService);
    effect(() => {
      languages.language();
      this.openCalendarLabel = languages.translate('calendar.open');
      this.closeCalendarLabel = languages.translate('calendar.close');
      this.calendarLabel = languages.translate('calendar.calendar');
      this.prevMonthLabel = languages.translate('calendar.previousMonth');
      this.nextMonthLabel = languages.translate('calendar.nextMonth');
      this.prevYearLabel = languages.translate('calendar.previousYear');
      this.nextYearLabel = languages.translate('calendar.nextYear');
      this.prevMultiYearLabel = languages.translate('calendar.previousMultiYear');
      this.nextMultiYearLabel = languages.translate('calendar.nextMultiYear');
      this.switchToMonthViewLabel = languages.translate('calendar.switchToMonth');
      this.switchToMultiYearViewLabel = languages.translate('calendar.switchToMultiYear');
      this.changes.next();
    });
  }
}