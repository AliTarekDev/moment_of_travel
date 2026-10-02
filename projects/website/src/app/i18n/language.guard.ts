import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Language, LanguageService } from './language.service';

export const languageGuard: CanActivateFn = route => {
  const language = route.paramMap.get('lang');
  if (language !== 'ar' && language !== 'en') {
    return inject(Router).createUrlTree(['/en']);
  }
  inject(LanguageService).setLanguage(language as Language);
  return true;
};
