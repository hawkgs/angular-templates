import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideFetchApi, withFetchMock } from '@ngx-templates/shared/fetch';
import { acbRequestResponseMock } from './shared/utils/acb-request-response-mock';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideClientHydration(),
    // Drop the `withFetchMock` implementation argument in order to
    // perform actual network requests via the native Fetch API.
    provideFetchApi(withFetchMock(acbRequestResponseMock)),
  ],
};
