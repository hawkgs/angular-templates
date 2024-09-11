import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
// import { provideClientHydration } from '@angular/platform-browser';

import { APP_ROUTES } from './app.routes';
import { fetchMock, provideFetchApi } from '../../../shared/fetch';
import { kanbanRequestResponseMock } from './shared/utils/kb-request-response-mock';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(APP_ROUTES),
    // Second part of the comment: https://github.com/angular/angular/issues/51157#issuecomment-1648664873
    // provideClientHydration(),
    provideFetchApi(fetchMock(kanbanRequestResponseMock)),
  ],
};
