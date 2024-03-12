import { Routes } from '@angular/router';
import { ProductsComponent } from './products.component';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: '',
    component: ProductsComponent,
    data: {
      // We want to reuse the ProductsComponent when navigating back from product details.
      // See CachedRouteReuseStrategy for more details.
      reuseFrom: ['products/:id/:slug'],
    },
  },
  {
    path: ':id/:slug',
    loadComponent: () =>
      import('./product-details/product-details.component').then(
        (cmp) => cmp.ProductDetailsComponent,
      ),
  },
];
