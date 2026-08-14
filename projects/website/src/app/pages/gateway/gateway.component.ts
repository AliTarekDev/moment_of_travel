import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageSwitchComponent } from '../../i18n/language-switch.component';
import { TranslatePipe } from '../../i18n/translate.pipe';

@Component({
  selector: 'app-gateway',
  standalone: true,
  imports: [RouterLink, LanguageSwitchComponent, TranslatePipe],
  templateUrl: './gateway.component.html',
  styleUrl: './gateway.component.scss'
})
export class GatewayComponent {}
