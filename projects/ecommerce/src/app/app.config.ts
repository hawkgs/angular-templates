import { ApplicationConfig } from '@angular/core';
import {
  RouteReuseStrategy,
  provideRouter,
  withViewTransitions,
} from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { windowProvider } from '@ngx-templates/shared/services';
import { provideFetchApi } from '@ngx-templates/shared/fetch';

import { APP_ROUTES } from './app.routes';
import { CategoriesService } from './data-access/categories.service';
import { ProductsService } from './data-access/products.service';
import { CartService } from './data-access/cart.service';
import { CachedRouteReuseStrategy } from './shared/cached-route-reuse-strategy.service';
import { fetchMock } from './shared/utils/fetch-mock';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(APP_ROUTES, withViewTransitions()),
    provideClientHydration(),
    // Drop the `fetchMock` implementation argument in order to
    // perform actual network requests via the native Fetch API.
    provideFetchApi(fetchMock),
    windowProvider,
    CategoriesService,
    ProductsService,
    CartService,
    {
      provide: RouteReuseStrategy,
      useClass: CachedRouteReuseStrategy,
    },
  ],
};
