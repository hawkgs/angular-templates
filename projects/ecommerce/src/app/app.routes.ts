import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const APP_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: HomeComponent,
      },
      {
        path: 'products',
        loadChildren: () =>
          import('./products/products.routes').then((rt) => rt.PRODUCTS_ROUTES),
      },
      {
        path: 'cart',
        loadComponent: () =>
          import('./cart/cart.component').then((cmp) => cmp.CartComponent),
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];
