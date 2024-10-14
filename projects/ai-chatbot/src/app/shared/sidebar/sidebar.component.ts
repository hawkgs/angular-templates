import { Component, HostBinding, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { IconComponent } from '@ngx-templates/shared/icon';
import { ThemeSwitchComponent } from '@ngx-templates/shared/theme';
import { LocalStorage } from '@ngx-templates/shared/services';

import { FooterComponent } from './footer/footer.component';
import { ChatbotService } from '../../data-access/chatbot.service';

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

  expanded = signal<boolean>(false);

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
