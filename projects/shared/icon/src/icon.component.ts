/* eslint-disable @angular-eslint/no-host-metadata-property */
import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation, input } from '@angular/core';

export type IconName =
  | 'Angular'
  | 'Cart'
  | 'LightMode'
  | 'DarkMode'
  | 'Routine'
  | 'Search'
  | 'Downloading'
  | 'ChevronRight'
  | 'Delete'
  | 'NoPhoto'
  | 'Close'
  | 'ArrowDown'
  | 'Download'
  | 'Gemini'
  | 'Link'
  | 'Lightbulb';

export type IconSize = 'sm' | 'md' | 'lg' | 'xlg' | 'xxlg';

// Powered by Material Symbols
@Component({
  selector: 'ngx-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg class="svg" [ngClass]="[size()]">
      <use [attr.xlink:href]="'/assets/icons-sprite.svg#' + name()"></use>
    </svg>
  `,
  styleUrls: ['./icon.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'ngx-icon',
  },
})
export class IconComponent {
  name = input.required<IconName>();
  size = input<IconSize>('md');
}
