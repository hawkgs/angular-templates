import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { windowProvider } from '@ngx-templates/shared/services';
import {
  provideFetchApi,
  provideFetchMockState,
  withFetchMock,
} from '@ngx-templates/shared/fetch';
import { APP_ROUTES } from './app.routes';

import { acbRequestResponseMock } from './shared/utils/acb-request-response-mock';
import { provideGeminiApi } from './shared/utils/gemini-api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideClientHydration(),
    provideRouter(APP_ROUTES),
    windowProvider,
    // Drop the `withFetchMock` implementation argument along with
    // `provideGeminiApi` and `provideFetchMockState` in order to
    // perform actual network requests via the native Fetch
    // to your own API (set URL in /environments).
    //
    // Keep in mind that the Fetch mock can use internally the
    // actual Gemini API (api/gemini.js).
    // In essence: App => Fetch mock => Gemini API (mocked or real).
    // In order to do that, start-api:gemini and change mockedData
    // config parameter to `false`.
    provideGeminiApi({ mockedData: true }),
    provideFetchMockState(),
    provideFetchApi(withFetchMock(acbRequestResponseMock)),
  ],
};
