import { Component, inject } from '@angular/core';
import { ModalService } from '../modal.service';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'ngx-modal-outlet',
  standalone: true,
  imports: [ModalComponent],
  templateUrl: './modal-outlet.component.html',
  styleUrl: './modal-outlet.component.css',
})
export class ModalOutletComponent {
  private _modalService = inject(ModalService);
  modals = this._modalService.modals;
}
