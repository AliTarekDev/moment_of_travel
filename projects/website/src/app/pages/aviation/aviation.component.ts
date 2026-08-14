import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageSwitchComponent } from '../../i18n/language-switch.component';
import { TranslatePipe } from '../../i18n/translate.pipe';

@Component({
  selector: 'app-aviation',
  standalone: true,
  imports: [RouterLink, LanguageSwitchComponent, TranslatePipe],
  templateUrl: './aviation.component.html',
  styleUrl: './aviation.component.scss'
})
export class AviationComponent {
  menuOpen = false;
}
