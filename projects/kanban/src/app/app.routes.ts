import { Routes } from '@angular/router';
import { BoardComponent } from './board/board.component';

export const APP_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: BoardComponent,
      },
    ],
  },
];
