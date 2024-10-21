import {
  Component,
  computed,
  HostBinding,
  inject,
  signal,
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

// TO-DOS FOR NEXT WEEK
// 2. Bug with inability to cancel a request

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

  private _routerEvents = toSignal(this._router.events);

  selectedChat = computed(() => {
    const isNavEnd = this._routerEvents() instanceof NavigationEnd;
    if (isNavEnd || this.chatbot.chats().size) {
      // We can't access the route param from the sidebar since it's out of scope.
      // We rely on the URL composition where the chat ID is last.
      return this._location.path().split('/').pop() || '';
    }
    return '';
  });

  constructor() {
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
