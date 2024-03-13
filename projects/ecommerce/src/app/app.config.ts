import { ApplicationConfig } from '@angular/core';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';

import { APP_ROUTES } from './app.routes';
import { fetchMockApiProvider } from './shared/fetch';
import { CategoriesService } from './data-access/categories.service';
import { ProductsService } from './data-access/products.service';
import { CartService } from './data-access/cart.service';
import { CachedRouteReuseStrategy } from './shared/cached-route-reuse-strategy.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(APP_ROUTES),
    provideClientHydration(),
    // Substitute "fetchMockApiProvider" with "fetchApiProvider"
    // in order to perform actual network requests via the Fetch API
    fetchMockApiProvider,
    CategoriesService,
    ProductsService,
    CartService,
    {
      provide: RouteReuseStrategy,
      useClass: CachedRouteReuseStrategy,
    },
  ],
};
