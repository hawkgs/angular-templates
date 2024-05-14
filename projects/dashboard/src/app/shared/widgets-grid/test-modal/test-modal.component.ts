import { Component, inject } from '@angular/core';
import { ModalController, ModalService } from '@ngx-templates/shared/modal';

@Component({
  selector: 'db-test-modal',
  standalone: true,
  imports: [],
  template:
    'another <button (click)="ctrl.close()">close</button> <button (click)="modals.closeAll()">close all</button>',
})
export class TestModalComponent {
  ctrl = inject(ModalController);
  modals = inject(ModalService);
}
