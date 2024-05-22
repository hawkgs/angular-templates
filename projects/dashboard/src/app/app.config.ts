import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideDataSources } from './data';

// TODO(Georgi): Investigate why hydration breaks due to
// dynamically-loaded widgets.
export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideDataSources()],
};
