import { ApplicationConfig } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideDataSources } from './data/utils';

// TODO(Georgi): Investigate why hydration breaks due to
// dynamically-loaded widgets.
export const appConfig: ApplicationConfig = {
  providers: [provideDataSources()],
};
