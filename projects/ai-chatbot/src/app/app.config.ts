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
    // Drop the `withFetchMock` implementation argument in order to
    // perform actual network requests via the native Fetch API.
    provideGeminiApi({ mockedData: false }),
    provideFetchMockState(),
    provideFetchApi(withFetchMock(acbRequestResponseMock)),
  ],
};
