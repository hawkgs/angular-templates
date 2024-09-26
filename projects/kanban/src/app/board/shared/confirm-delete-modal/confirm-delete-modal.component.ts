import { Component, inject } from '@angular/core';
import {
  MODAL_DATA,
  ModalContentComponent,
  ModalController,
} from '@ngx-templates/shared/modal';
import { ButtonComponent } from '@ngx-templates/shared/button';

export type ConfirmDeleteData = {
  entity: string;
};

@Component({
  selector: 'kb-confirm-delete-modal',
  standalone: true,
  imports: [ModalContentComponent, ButtonComponent],
  templateUrl: './confirm-delete-modal.component.html',
  styleUrl: './confirm-delete-modal.component.scss',
})
export class ConfirmDeleteModalComponent {
  data = inject<ConfirmDeleteData>(MODAL_DATA);
  ctrl = inject(ModalController);
}
