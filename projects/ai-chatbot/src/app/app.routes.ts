import { Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';

export enum RoutePrefix {
  Home = '',
  Chat = 'chat',
}

export const APP_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: RoutePrefix.Home,
        component: ChatComponent,
      },
      {
        path: RoutePrefix.Chat + '/:id',
        component: ChatComponent,
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];
