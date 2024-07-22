import { Component, inject } from '@angular/core';
import {
  ModalContentComponent,
  ModalController,
} from '@ngx-templates/shared/modal';

@Component({
  selector: 'ate-confirm-clear-modal',
  standalone: true,
  imports: [ModalContentComponent],
  templateUrl: './confirm-clear-modal.component.html',
  styleUrl: './confirm-clear-modal.component.scss',
})
export class ConfirmClearModalComponent {
  ctrl: ModalController<boolean> = inject(ModalController);
}
