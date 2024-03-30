/* eslint-disable @angular-eslint/no-host-metadata-property */
/* eslint-disable @angular-eslint/component-selector */
import { Component, HostBinding, input } from '@angular/core';

type ButtonType = 'primary' | 'secondary';

@Component({
  selector: 'button[ec-button]',
  standalone: true,
  imports: [],
  template: '<ng-content></ng-content>',
  styleUrl: './button.component.scss',
  host: {
    class: 'ec-button',
  },
})
export class ButtonComponent {
  btnType = input.required<ButtonType>();
  size = input<'compact' | 'large'>('compact');

  @HostBinding('class.large-size-btn')
  get isLarge() {
    return this.size() === 'large';
  }

  @HostBinding('class.primary-btn')
  get isPrimary() {
    return this.btnType() === 'primary';
  }

  @HostBinding('class.secondary-btn')
  get isSecondary() {
    return this.btnType() === 'secondary';
  }
}
