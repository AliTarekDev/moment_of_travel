import { bootstrapApplication } from '@angular/platform-browser';
import { NavigationEnd, NavigationError, NavigationSkipped, Router } from '@angular/router';
import { filter, firstValueFrom } from 'rxjs';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .then(async app => {
    const router = app.injector.get(Router);
    if (!router.lastSuccessfulNavigation) {
      const result = await firstValueFrom(router.events.pipe(filter(event =>
        event instanceof NavigationEnd || event instanceof NavigationError || event instanceof NavigationSkipped,
      )));
      if (result instanceof NavigationError) throw result.error;
    }

    // Wait for the first routed view to render after its lazy bundles resolve.
    requestAnimationFrame(() => document.getElementById('website-loader')?.remove());
  })
  .catch(error => {
    console.error(error);
    document.getElementById('website-loader')?.setAttribute('data-error', '');
    const message = document.getElementById('website-loader-text');
    if (message) message.textContent = 'Ancient Paths could not load.';
    document.getElementById('website-loader-retry')?.removeAttribute('hidden');
  });
