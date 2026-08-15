import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageSwitchComponent } from '../../i18n/language-switch.component';
import { TranslatePipe } from '../../i18n/translate.pipe';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRight, faLocationDot, faPlane } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-gateway',
  standalone: true,
  imports: [RouterLink, LanguageSwitchComponent, TranslatePipe, FontAwesomeModule],
  templateUrl: './gateway.component.html',
  styleUrl: './gateway.component.scss'
})
export class GatewayComponent {
  readonly icons = { arrow: faArrowRight, location: faLocationDot, plane: faPlane };
}
