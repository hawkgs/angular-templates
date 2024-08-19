import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { windowProvider } from '@ngx-templates/shared/services';
import { fetchMock, provideFetchApi } from '@ngx-templates/shared/fetch';
import { geminiApiMock } from './shared/utils/gemini-api-mock';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideClientHydration(),
    windowProvider,
    // Drop the `fetchMock` implementation argument in order to
    // perform actual network requests via the native Fetch API.
    provideFetchApi(fetchMock(geminiApiMock, { requestDelay: 2000 })),
  ],
};
