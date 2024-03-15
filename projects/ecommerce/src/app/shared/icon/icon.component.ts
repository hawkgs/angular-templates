/* eslint-disable @angular-eslint/no-host-metadata-property */
import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation, input } from '@angular/core';

export type IconName = 'Cart';
export type IconSize = 'sm' | 'md' | 'lg' | 'xlg' | 'xxlg';

@Component({
  selector: 'ec-icon',
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
    class: 'ec-icon',
  },
})
export class IconComponent {
  name = input.required<IconName>();
  size = input<IconSize>('md');
}
