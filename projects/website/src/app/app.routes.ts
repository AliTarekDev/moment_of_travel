import { Routes } from '@angular/router';
import { AviationComponent } from './pages/aviation/aviation.component';
import { GatewayComponent } from './pages/gateway/gateway.component';
import { TravelComponent } from './pages/travel/travel.component';
import { languageGuard } from './i18n/language.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'ar' },
  {
    path: ':lang',
    canActivate: [languageGuard],
    children: [
      {
        path: '',
        component: GatewayComponent,
        title: 'Moment of Travel — Choose your journey',
      },
      {
        path: 'aviation',
        component: AviationComponent,
        title: 'Moment of Travel — Beyond every horizon',
      },
      {
        path: 'travel',
        component: TravelComponent,
        title: 'Moment of Travel — Discover the world your way',
      },
    ],
  },
  { path: '**', redirectTo: 'ar' },
];
