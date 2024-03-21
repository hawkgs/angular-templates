import { Component, input } from '@angular/core';
import { Toast } from '../toast';

@Component({
  selector: 'ec-toast',
  standalone: true,
  imports: [],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})
export class ToastComponent {
  toast = input.required<Toast>();
}
