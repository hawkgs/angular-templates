import { Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';

export const APP_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ChatComponent,
      },
      {
        path: 'chat/:id',
        component: ChatComponent,
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];
