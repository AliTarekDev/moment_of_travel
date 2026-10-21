import { Injectable, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
export type StepKind =
  | 'intro'
  | 'text'
  | 'email'
  | 'number'
  | 'date'
  | 'single'
  | 'multi'
  | 'textarea'
  | 'review';
export interface TripStep {
  id: string;
  kind: StepKind;
  field?: string;
  required?: boolean;
  help?: boolean;
  options?: readonly string[];
}
const yesNo = ['yes', 'no'];
export const TRIP_STEPS: readonly TripStep[] = [
  { id: 'intro', kind: 'intro' },
  { id: 'firstName', field: 'firstName', kind: 'text', required: true },
  { id: 'greeting', kind: 'intro' },
  { id: 'approach', kind: 'intro' },
  { id: 'pricing', kind: 'intro' },
  { id: 'ready', kind: 'intro' },
  { id: 'email', field: 'email', kind: 'email', required: true },
  { id: 'adults', field: 'adults', kind: 'number', required: true },
  { id: 'children', field: 'children', kind: 'number', required: true },
  { id: 'origin', field: 'origin', kind: 'text', required: true, help: true },
  { id: 'arrivalDate', field: 'arrivalDate', kind: 'date', required: true },
  { id: 'departureDate', field: 'departureDate', kind: 'date', required: true },
  {
    id: 'flightsBooked',
    field: 'flightsBooked',
    kind: 'single',
    required: true,
    options: yesNo,
  },
  { id: 'days', field: 'days', kind: 'text', required: true, help: true },
  { id: 'occasions', field: 'occasions', kind: 'textarea', help: true },
  {
    id: 'cairoSites',
    field: 'cairoSites',
    kind: 'multi',
    required: true,
    options: [
      'giza',
      'saqqara',
      'museums',
      'oldCairo',
      'citadel',
      'coptic',
      'other',
    ],
  },
  {
    id: 'luxor',
    field: 'luxor',
    kind: 'single',
    required: true,
    help: true,
    options: yesNo,
  },
  {
    id: 'aswan',
    field: 'aswan',
    kind: 'single',
    required: true,
    help: true,
    options: yesNo,
  },
  {
    id: 'abuSimbel',
    field: 'abuSimbel',
    kind: 'single',
    required: true,
    help: true,
    options: yesNo,
  },
  {
    id: 'cruise',
    field: 'cruise',
    kind: 'single',
    required: true,
    help: true,
    options: ['none', 'three', 'four', 'seven'],
  },
  {
    id: 'alexandria',
    field: 'alexandria',
    kind: 'single',
    required: true,
    help: true,
    options: yesNo,
  },
  { id: 'otherPlaces', field: 'otherPlaces', kind: 'textarea' },
  {
    id: 'experiences',
    field: 'experiences',
    kind: 'multi',
    required: true,
    help: true,
    options: ['camel', 'dance', 'felucca', 'balloon', 'other', 'none'],
  },
  { id: 'otherExperiences', field: 'otherExperiences', kind: 'textarea' },
  {
    id: 'vip',
    field: 'vip',
    kind: 'single',
    required: true,
    help: true,
    options: yesNo,
  },
  {
    id: 'hotels',
    field: 'hotels',
    kind: 'single',
    required: true,
    options: yesNo,
  },
  { id: 'notes', field: 'notes', kind: 'textarea' },
  { id: 'review', kind: 'review' },
];
@Injectable({ providedIn: 'root' })
export class TailorMadeDraft {
  private readonly fb = inject(FormBuilder);
  readonly index = signal(0);
  readonly reviewReached = signal(false);
  readonly form = this.fb.group({
    firstName: [
      '',
      [
        Validators.required,
        Validators.pattern(/\S/),
        Validators.maxLength(120),
      ],
    ],
    email: [
      '',
      [Validators.required, Validators.email, Validators.maxLength(180)],
    ],
    adults: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1),
      Validators.max(50),
      Validators.pattern(/^\d+$/),
    ]),
    children: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(49),
      Validators.pattern(/^\d+$/),
    ]),
    origin: [
      '',
      [
        Validators.required,
        Validators.pattern(/\S.*\S/),
        Validators.maxLength(140),
      ],
    ],
    arrivalDate: new FormControl<Date | null>(null, Validators.required),
    departureDate: new FormControl<Date | null>(null, Validators.required),
    flightsBooked: ['', Validators.required],
    days: [
      '',
      [
        Validators.required,
        Validators.pattern(/\S/),
        Validators.maxLength(120),
      ],
    ],
    occasions: ['', Validators.maxLength(800)],
    cairoSites: new FormControl<string[]>([], {
      nonNullable: true,
      validators: Validators.required,
    }),
    luxor: ['', Validators.required],
    aswan: ['', Validators.required],
    abuSimbel: ['', Validators.required],
    cruise: ['', Validators.required],
    alexandria: ['', Validators.required],
    otherPlaces: ['', Validators.maxLength(800)],
    experiences: new FormControl<string[]>([], {
      nonNullable: true,
      validators: Validators.required,
    }),
    otherExperiences: ['', Validators.maxLength(800)],
    vip: ['', Validators.required],
    hotels: ['', Validators.required],
    notes: ['', Validators.maxLength(1200)],
  });
  reset(): void {
    this.form.reset({ cairoSites: [], experiences: [] });
    this.index.set(0);
    this.reviewReached.set(false);
  }
}
export function localCalendarDate(date: Date): string {
  return (
    date.getFullYear() +
    '-' +
    String(date.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(date.getDate()).padStart(2, '0')
  );
}
