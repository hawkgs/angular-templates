import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { ToastComponent } from '../toast/toast.component';
import { ToastsService } from '../toasts.service';
import { ToastType } from '../types';

@Component({
  selector: 'ngx-toast-outlet',
  imports: [ToastComponent],
  templateUrl: './toast-outlet.component.html',
  styleUrl: './toast-outlet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastOutletComponent {
  toasts = inject(ToastsService);

  default = computed(() =>
    this.toasts.value().filter((t) => t.config.type === ToastType.Default),
  );

  notifications = computed(() =>
    this.toasts.value().filter((t) => t.config.type === ToastType.Notification),
  );
}
