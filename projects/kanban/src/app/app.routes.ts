import { Routes } from '@angular/router';
import { BoardComponent } from './board/board.component';

export enum RoutePrefix {
  Home = '',
  Card = 'c',
}

export const APP_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: RoutePrefix.Home,
        component: BoardComponent,
      },
      {
        path: RoutePrefix.Card + '/:id',
        component: BoardComponent,
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];
