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
        title: 'Ancient Paths — Discover the world your way',
      },
      {
        path: 'features/exclusive-visits',
        loadComponent: () => import('./pages/features/exclusive-visits/exclusive-visits.component').then(module => module.ExclusiveVisitsComponent),
        title: 'Ancient Paths — Exclusive visits',
      },
      {
        path: 'features/five-star-hotels',
        loadComponent: () => import('./pages/features/five-star-hotels/five-star-hotels.component').then(module => module.FiveStarHotelsComponent),
        title: 'Ancient Paths — Five-star hotels',
      },
      {
        path: 'features/tailor-made-itineraries',
        loadComponent: () => import('./pages/features/tailor-made-itineraries/tailor-made-itineraries.component').then(module => module.TailorMadeItinerariesComponent),
        title: 'Ancient Paths — Tailor-made itineraries',
      },
      {
        path: 'contact',
        loadComponent: () => import('./pages/contact/contact.component').then(module => module.ContactComponent),
        title: 'Ancient Paths — Contact us',
      },
      {
        path: 'tours',
        loadComponent: () => import('./pages/tours/tours.component').then(module => module.ToursComponent),
        title: 'Ancient Paths — Tours',
      },
      {
        path: 'tours/:slug',
        loadComponent: () => import('./pages/tours/tour-details.component').then(module => module.TourDetailsComponent),
        title: 'Ancient Paths — Tour details',
      },
      {
        path: 'aviation',
        component: AviationComponent,
        title: 'Ancient Paths — Beyond every horizon',
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
