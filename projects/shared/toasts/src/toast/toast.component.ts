import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '@ngx-templates/shared/icon';

import { Toast } from '../toast';
import { ToastType } from '../types';

const TYPE_TO_CLASS: { [key in ToastType]: string } = {
  default: 'def-type',
  notification: 'ntf-type',
};

@Component({
  selector: 'ngx-toast',
  imports: [CommonModule, IconComponent],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent {
  toast = input.required<Toast>();

  ToastType = ToastType;
  TYPE_TO_CLASS = TYPE_TO_CLASS;
}
