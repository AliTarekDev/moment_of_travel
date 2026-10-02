import { Component } from '@angular/core';
import { LanguageService } from './language.service';
import { TranslatePipe } from './translate.pipe';

@Component({
  selector: 'app-language-switch', standalone: true, imports: [TranslatePipe],
  template: '<button type="button" (click)="languages.toggle()" [attr.aria-label]="\'language.switch\' | t"><span>◎</span>{{ \'language.switch\' | t }}</button>',
  styles: [`button{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:44px;padding:10px 16px;border:1px solid currentColor;border-radius:999px;background:transparent;color:inherit;font:700 14px/1.4 'Inter',sans-serif;cursor:pointer;transition:background .2s}button:hover{background:rgba(92,58,88,.08)}button:focus-visible{outline:3px solid #b58b27;outline-offset:4px}span{font-size:18px}`]
})
export class LanguageSwitchComponent { constructor(public readonly languages: LanguageService) {} }
