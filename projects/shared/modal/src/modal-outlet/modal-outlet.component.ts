import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Renderer2,
  effect,
  inject,
} from '@angular/core';
import { ModalService } from '../modal.service';
import { ModalComponent } from '../modal/modal.component';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'ngx-modal-outlet',
  imports: [ModalComponent],
  templateUrl: './modal-outlet.component.html',
  styleUrl: './modal-outlet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalOutletComponent {
  private _doc = inject(DOCUMENT);
  private _modalService = inject(ModalService);
  private _renderer = inject(Renderer2);

  modals = this._modalService.modals;

  constructor() {
    effect(() => {
      const body = this._doc.body;

      if (this.modals().size) {
        this._renderer.setStyle(body, 'overflow', 'hidden');
      } else {
        this._renderer.setStyle(body, 'overflow', null);
      }
    });
  }

  @HostListener('document:keydown.escape')
  closeCurrentVisibleModal() {
    this._modalService.closeCurrent();
  }
}
