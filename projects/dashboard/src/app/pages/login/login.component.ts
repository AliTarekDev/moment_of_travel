import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly forms = inject(FormBuilder);
  loading = false;
  error = '';
  readonly form = this.forms.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
  ) {}

  submit(): void {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.error = '';
    const { email, password } = this.form.getRawValue();
    this.auth
      .login(email, password)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => void this.router.navigateByUrl('/'),
        error: () => (this.error = 'تعذر تسجيل الدخول. تأكد من البريد الإلكتروني وكلمة المرور.'),
      });
  }
}
