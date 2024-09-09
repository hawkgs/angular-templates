import { ApplicationConfig } from '@angular/core';
import {
  RouteReuseStrategy,
  provideRouter,
  withViewTransitions,
} from '@angular/router';
import {
  provideClientHydration,
  withPartialHydration,
} from '@angular/platform-browser';
import { windowProvider } from '@ngx-templates/shared/services';
import { fetchMock, provideFetchApi } from '@ngx-templates/shared/fetch';

import { APP_ROUTES } from './app.routes';
import { CategoriesService } from './data-access/categories.service';
import { ProductsService } from './data-access/products.service';
import { CartService } from './data-access/cart.service';
import { CachedRouteReuseStrategy } from './shared/cached-route-reuse-strategy.service';
import { ecommerceRequestResponseMock } from './shared/utils/request-response-mock';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(APP_ROUTES, withViewTransitions()),
    provideClientHydration(withPartialHydration()),
    // Drop the `fetchMock` implementation argument in order to
    // perform actual network requests via the native Fetch API.
    provideFetchApi(fetchMock(ecommerceRequestResponseMock)),
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
