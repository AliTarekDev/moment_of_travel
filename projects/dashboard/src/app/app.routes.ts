import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then((component) => component.LoginComponent),
    title: 'تسجيل الدخول — Moment of Travel',
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then((component) => component.DashboardComponent),
    title: 'لوحة العمليات — Moment of Travel',
  },
  { path: '**', redirectTo: '' },
];
