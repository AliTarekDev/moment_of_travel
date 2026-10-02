import { Routes } from '@angular/router';
import { AviationComponent } from './pages/aviation/aviation.component';
import { TravelComponent } from './pages/travel/travel.component';
import { languageGuard } from './i18n/language.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'en' },
  {
    path: ':lang',
    canActivate: [languageGuard],
    children: [
      {
        path: '',
        component: TravelComponent,
        title: 'Moment of Travel — Discover the world your way',
      },
      {
        path: 'aviation',
        component: AviationComponent,
        title: 'Moment of Travel — Beyond every horizon',
      },
      {
        path: 'travel',
        pathMatch: 'full',
        redirectTo: '',
      },
    ],
  },
  { path: '**', redirectTo: 'en' },
];
