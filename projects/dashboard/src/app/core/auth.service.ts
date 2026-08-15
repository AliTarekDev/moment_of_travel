import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { StaffUser } from './api.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly userState = signal<StaffUser | null>(null);
  readonly user = this.userState.asReadonly();

  constructor(private readonly http: HttpClient) {}

  login(email: string, password: string): Observable<StaffUser> {
    return this.http
      .post<{ user: StaffUser }>('/api/auth/login', { email, password }, { withCredentials: true })
      .pipe(
        map((response) => response.user),
        tap((user) => this.userState.set(user)),
      );
  }

  checkSession(): Observable<boolean> {
    return this.http.get<{ user: StaffUser }>('/api/auth/me', { withCredentials: true }).pipe(
      tap((response) => this.userState.set(response.user)),
      map(() => true),
      catchError(() => {
        this.userState.set(null);
        return of(false);
      }),
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>('/api/auth/logout', {}, { withCredentials: true }).pipe(
      tap(() => this.userState.set(null)),
    );
  }
}
