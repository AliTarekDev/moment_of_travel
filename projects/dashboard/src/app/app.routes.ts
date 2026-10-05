import { inject } from '@angular/core';
import { AuthService } from './core/auth.service';
import { Router, Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { firstValueFrom } from 'rxjs';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then((component) => component.LoginComponent),
    title: 'تسجيل الدخول — Ancient Paths',
  },
  {
    path: 'tours/new',
    canActivate: [async () => {
      const auth = inject(AuthService);
      const router = inject(Router);
      if (!auth.user() && !(await firstValueFrom(auth.checkSession()))) return router.createUrlTree(['/login']);
      return ['admin', 'manager'].includes(auth.user()?.role ?? '') || router.createUrlTree(['/']);
    }],
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(component => component.DashboardComponent),
    data: { view: 'newTour' },
    title: 'إضافة رحلة جديدة — Ancient Paths',
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then((component) => component.DashboardComponent),
    title: 'لوحة العمليات — Ancient Paths',
  },
  { path: '**', redirectTo: '' },
];
