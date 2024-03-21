import { Component, inject } from '@angular/core';
import { ToastComponent } from './toast/toast.component';
import { ToastsService } from './toasts.service';

@Component({
  selector: 'ec-toast-feed',
  standalone: true,
  imports: [ToastComponent],
  templateUrl: './toast-feed.component.html',
  styleUrl: './toast-feed.component.scss',
})
export class ToastFeedComponent {
  toasts = inject(ToastsService);
}
