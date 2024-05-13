import { Component, inject } from '@angular/core';
import { ToastComponent } from '../toast/toast.component';
import { ToastsService } from '../toasts.service';

@Component({
  selector: 'ngx-toast-outlet',
  standalone: true,
  imports: [ToastComponent],
  templateUrl: './toast-outlet.component.html',
  styleUrl: './toast-outlet.component.scss',
})
export class ToastOutletComponent {
  toasts = inject(ToastsService);
}
