import { BidiModule } from '@angular/cdk/bidi';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ControlContainer, FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '../i18n/translate.pipe';

export interface EditableTourDay { titleAr: string; titleEn: string; textAr: string; textEn: string; }
export const emptyTourDay = (): EditableTourDay => ({ titleAr: '', titleEn: '', textAr: '', textEn: '' });

@Component({
  selector: 'app-tour-itinerary-editor', standalone: true,
  imports: [BidiModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, TranslatePipe],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
  template: `
    <section class="itinerary-editor">
      <header><div><h3>{{ 'newTour.itinerary' | t }}</h3><p>{{ 'newTour.itineraryHelp' | t }}</p></div>
        <mat-form-field appearance="outline"><mat-label>{{ 'newTour.duration' | t }}</mat-label><input matInput [disabled]="disabled" type="number" name="durationDays" [ngModel]="durationDays" (ngModelChange)="setDuration($event)" required min="1" max="30" step="1" pattern="[0-9]+" /><mat-hint>{{ 'newTour.durationHelp' | t }}</mat-hint></mat-form-field>
      </header>
      @if (days.length !== durationDays) { <p role="alert" class="error">{{ 'newTour.durationMismatch' | t }}</p> }
      @for (day of days; track day; let index = $index) {
        <article class="day-card">
          <div class="day-heading"><span>{{ 'newTour.day' | t }} {{ index + 1 }}</span><button mat-button type="button" (click)="remove(index)" [disabled]="disabled || days.length <= 1">{{ 'newTour.removeDay' | t }}</button></div>
          <div class="languages">
            @for (language of ['Ar', 'En']; track language) {
              <section>
                <h4>{{ (language === 'Ar' ? 'newTour.arabic' : 'newTour.english') | t }}</h4>
                <mat-form-field appearance="outline"><mat-label>{{ 'newTour.dayTitle' | t }}</mat-label><input matInput [attr.dir]="language === 'Ar' ? 'rtl' : 'ltr'" [disabled]="disabled" [name]="'dayTitle' + language + index" [(ngModel)]="day[language === 'Ar' ? 'titleAr' : 'titleEn']" required minlength="2" maxlength="180" [pattern]="nonBlank" /></mat-form-field>
                <mat-form-field appearance="outline"><mat-label>{{ 'newTour.dayDetails' | t }}</mat-label><textarea matInput [attr.dir]="language === 'Ar' ? 'rtl' : 'ltr'" [disabled]="disabled" [name]="'dayText' + language + index" [(ngModel)]="day[language === 'Ar' ? 'textAr' : 'textEn']" required minlength="2" maxlength="3000" rows="4" [pattern]="nonBlank"></textarea><mat-hint>{{ 'newTour.dayDescriptionHelp' | t }}</mat-hint></mat-form-field>
              </section>
            }
          </div>
        </article>
      }
      <button mat-stroked-button type="button" (click)="add()" [disabled]="disabled || days.length >= 30">+ {{ 'newTour.addDay' | t }}</button>
    </section>
  `,
  styles: `:host { display:block; } .itinerary-editor { margin-block:32px; } header { display:flex; align-items:start; justify-content:space-between; gap:24px; } h3,h4 { margin:0 0 12px; } p { font-size:12px; color:#746572; line-height:1.8; } header mat-form-field { min-width:200px; } .day-card { margin-block:22px; border:1px solid #e5dce4; border-radius:18px; overflow:hidden; background:#fff; } .day-heading { display:flex; align-items:center; justify-content:space-between; padding:12px 20px; background:#f5eff5; color:#5c3a58; font-weight:700; } .languages { display:grid; grid-template-columns:1fr 1fr; gap:24px; padding:24px; } mat-form-field { display:block; width:100%; } .error { color:#a12b40; } @media(max-width:750px) { header { flex-direction:column; } .languages { grid-template-columns:1fr; padding:18px; } }`,
})
export class TourItineraryEditorComponent {
  @Input() days: EditableTourDay[] = [];
  @Input() disabled = false;
  @Output() readonly daysChange = new EventEmitter<EditableTourDay[]>();
  @Input() durationDays: number | null | undefined = 1;
  @Output() readonly durationDaysChange = new EventEmitter<number | null>();
  readonly nonBlank = /[\s\S]*\S[\s\S]*\S[\s\S]*/;
  setDuration(value: number | null): void {
    this.durationDays = value;
    this.durationDaysChange.emit(value);
    if (!value || !Number.isInteger(value) || value < 1 || value > 30) return;
    const days = [...this.days];
    while (days.length < value) days.push(emptyTourDay());
    // Never silently discard descriptions when duration is reduced.
    while (days.length > value && Object.values(days[days.length - 1]).every(text => !text.trim())) days.pop();
    this.days = days;
    this.daysChange.emit(days);
  }
  add(): void {
    if (this.days.length >= 30) return;
    this.days = [...this.days, emptyTourDay()];
    this.daysChange.emit(this.days);
    this.durationDays = this.days.length;
    this.durationDaysChange.emit(this.days.length);
  }
  remove(index: number): void {
    if (this.days.length <= 1) return;
    this.days = this.days.filter((_day, position) => position !== index);
    this.daysChange.emit(this.days);
    this.durationDays = this.days.length;
    this.durationDaysChange.emit(this.days.length);
  }
}
