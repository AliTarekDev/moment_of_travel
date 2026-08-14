import { Component } from '@angular/core';
import { LanguageService } from './language.service';
import { TranslatePipe } from './translate.pipe';

@Component({
  selector: 'app-language-switch', standalone: true, imports: [TranslatePipe],
  template: '<button type="button" (click)="languages.toggle()" [attr.aria-label]="\'language.switch\' | t"><span>◎</span>{{ \'language.switch\' | t }}</button>',
  styles: [`button{display:inline-flex;align-items:center;gap:7px;padding:9px 12px;border:1px solid currentColor;border-radius:999px;background:transparent;color:inherit;font:700 11px/1 'Inter',sans-serif;cursor:pointer}span{font-size:14px}`]
})
export class LanguageSwitchComponent { constructor(public readonly languages: LanguageService) {} }
