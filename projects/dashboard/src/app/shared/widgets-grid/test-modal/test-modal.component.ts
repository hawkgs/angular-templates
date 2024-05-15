import { Component, inject } from '@angular/core';
import {
  ModalContentComponent,
  ModalController,
  ModalService,
} from '@ngx-templates/shared/modal';

@Component({
  selector: 'db-test-modal',
  standalone: true,
  imports: [ModalContentComponent],
  template: `
    <ngx-modal-content [controller]="ctrl">
      <ng-container title>Second Modal</ng-container>
      <ng-container content>
        Second content.
        <button (click)="modals.closeAll()">Close All</button>
      </ng-container>
    </ngx-modal-content>
  `,
})
export class TestModalComponent {
  ctrl = inject(ModalController);
  modals = inject(ModalService);
}
