import { Component, inject } from '@angular/core';
import {
  MODAL_DATA,
  ModalContentComponent,
  ModalController,
  ModalService,
} from '@ngx-templates/shared/modal';
import { TestModalComponent } from '../test-modal/test-modal.component';

@Component({
  selector: 'db-widgets-store-modal',
  standalone: true,
  imports: [ModalContentComponent],
  templateUrl: './widgets-store-modal.component.html',
  styleUrl: './widgets-store-modal.component.scss',
})
export class WidgetsStoreModalComponent {
  data = inject(MODAL_DATA) as string;
  ctrl = inject(ModalController);
  modals = inject(ModalService);

  openNew() {
    this.modals.createModal(TestModalComponent);
  }
}
