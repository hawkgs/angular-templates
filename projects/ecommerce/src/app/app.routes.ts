import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductsListService } from './products/data-access/products-list.service';

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
        providers: [ProductsListService],
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
