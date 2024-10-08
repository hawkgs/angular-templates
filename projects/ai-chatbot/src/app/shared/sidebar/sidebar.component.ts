import { Component, HostBinding, signal } from '@angular/core';
import { IconComponent } from '@ngx-templates/shared/icon';
import { ThemeSwitchComponent } from '@ngx-templates/shared/theme';

import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'acb-sidebar',
  standalone: true,
  imports: [IconComponent, FooterComponent, ThemeSwitchComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  expanded = signal<boolean>(false);

  @HostBinding('class.expanded')
  get isExpanded() {
    return this.expanded();
  }
}
