import { Routes } from '@angular/router';
import { GalleryComponent } from './gallery/gallery.component';

export enum RoutePrefix {
  Home = '',
  Image = 'img',
}

export const APP_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: RoutePrefix.Home,
        component: GalleryComponent,
      },
      {
        path: RoutePrefix.Image + '/:idx',
        component: GalleryComponent,
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];
