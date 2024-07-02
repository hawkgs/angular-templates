import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { windowProvider } from '@ngx-templates/shared/services';
import { APP_ROUTES } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(APP_ROUTES),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideClientHydration(),
    windowProvider,
  ],
};
