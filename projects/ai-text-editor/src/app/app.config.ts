import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { windowProvider } from '@ngx-templates/shared/services';
import { geminiApiMockProvider } from './gemini/gemini-api.provider';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideClientHydration(),
    windowProvider,
    // Refer to gemini-api.provider.ts for
    // more information how to employ Gemini API.
    geminiApiMockProvider(),
  ],
};
