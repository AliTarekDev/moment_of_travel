import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { LanguageService } from './language.service';
import { TranslatePipe } from './translate.pipe';

@Component({
  selector: 'app-language-switch', standalone: true, imports: [TranslatePipe, FontAwesomeModule],
  template: '<button type="button" (click)="languages.toggle()" [attr.aria-label]="\'language.switch\' | t"><span><fa-icon [icon]="globe" aria-hidden="true" /></span>{{ \'language.switch\' | t }}</button>',
  styles: [`button{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:44px;padding:10px 16px;border:1px solid currentColor;border-radius:999px;background:transparent;color:inherit;font:700 14px/1.4 'Inter',sans-serif;cursor:pointer;transition:background .2s}button:hover{background:rgba(92,58,88,.08)}button:focus-visible{outline:3px solid #b58b27;outline-offset:4px}span{font-size:18px}`]
})
export class LanguageSwitchComponent {
  readonly globe = faGlobe;
  constructor(public readonly languages: LanguageService) {}
}
