import {
  Component,
  effect,
  HostBinding,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { CommonModule, Location } from '@angular/common';

import { IconComponent } from '@ngx-templates/shared/icon';
import { ThemeSwitchComponent } from '@ngx-templates/shared/theme';
import { LocalStorage } from '@ngx-templates/shared/services';

import { FooterComponent } from './footer/footer.component';
import { ChatbotService } from '../../data-access/chatbot.service';
import { toSignal } from '@angular/core/rxjs-interop';

const SIDEBAR_STATE_KEY = 'acb-sb-expanded';

@Component({
  selector: 'acb-sidebar',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    IconComponent,
    FooterComponent,
    ThemeSwitchComponent,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  chatbot = inject(ChatbotService);
  private _storage = inject(LocalStorage);
  private _location = inject(Location);
  private _router = inject(Router);

  expanded = signal<boolean>(false);
  selectedChat = signal<string>('');

  constructor() {
    const routerEvents = toSignal(this._router.events);

    effect(() => {
      const event = routerEvents();

      if (event instanceof NavigationEnd) {
        // We can't access the route param from the sidebar since it's out of scope.
        // We rely on the URL composition where the chat ID is last.
        const chatId = this._location.path().split('/').pop() || '';
        untracked(() => this.selectedChat.set(chatId));
      }
    });

    const expanded = this._storage.get(SIDEBAR_STATE_KEY) === 'true';
    this.expanded.set(expanded);
  }

  toggle() {
    const expanded = !this.expanded();
    this.expanded.set(expanded);
    this._storage.set(SIDEBAR_STATE_KEY, expanded.toString());
  }

  @HostBinding('class.expanded')
  get isExpanded() {
    return this.expanded();
  }
}
