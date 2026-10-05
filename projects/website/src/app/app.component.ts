import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './shared/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent],
  template: '<router-outlet /><app-footer />',
  styles: ':host { display: flex; flex-direction: column; min-height: 100vh; min-height: 100dvh; } app-footer { margin-top: auto; }'
})
export class AppComponent {}
