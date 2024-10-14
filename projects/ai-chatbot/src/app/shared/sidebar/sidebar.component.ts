import { Component, HostBinding, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { IconComponent } from '@ngx-templates/shared/icon';
import { ThemeSwitchComponent } from '@ngx-templates/shared/theme';

import { FooterComponent } from './footer/footer.component';
import { ChatbotService } from '../../data-access/chatbot.service';

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
  expanded = signal<boolean>(false);

  @HostBinding('class.expanded')
  get isExpanded() {
    return this.expanded();
  }
}
