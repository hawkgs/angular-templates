import { Routes } from '@angular/router';
import { GalleryComponent } from './gallery/gallery.component';

export const APP_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: GalleryComponent,
      },
      {
        path: 'img/:idx',
        component: GalleryComponent,
      },
    ],
  },
];
