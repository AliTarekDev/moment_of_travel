import { DOCUMENT } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AR } from './ar';
import { EN } from './en';

export type Language = 'ar' | 'en';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly dictionaries: Record<Language, unknown> = { ar: AR, en: EN };
  readonly language = signal<Language>('en');

  constructor() { this.applyDocumentLanguage('en'); }

  toggle(): void {
    const language: Language = this.language() === 'ar' ? 'en' : 'ar';
    const tree = this.router.parseUrl(this.router.url);
    const primary = tree.root.children['primary'];
    const segments = primary?.segments.map(segment => segment.path) ?? [];
    if (segments[0] === 'ar' || segments[0] === 'en') segments[0] = language;
    else segments.unshift(language);
    this.setLanguage(language);
    void this.router.navigate(['/', ...segments], {
      queryParams: tree.queryParams,
      fragment: tree.fragment ?? undefined
    });
  }

  setLanguage(language: Language): void {
    this.language.set(language);
    this.applyDocumentLanguage(language);
  }

  private applyDocumentLanguage(language: Language): void {
    this.document.documentElement.lang = language;
    this.document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }

  translate(path: string): string {
    let value: unknown = this.dictionaries[this.language()];
    for (const part of path.split('.')) value = (value as Record<string, unknown>)?.[part];
    return typeof value === 'string' ? value : path;
  }
}
