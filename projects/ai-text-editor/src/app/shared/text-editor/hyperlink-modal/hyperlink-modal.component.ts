import { Component, inject } from '@angular/core';
import {
  ModalContentComponent,
  ModalController,
} from '@ngx-templates/shared/modal';

@Component({
  selector: 'ate-hyperlink-modal',
  standalone: true,
  imports: [ModalContentComponent],
  templateUrl: './hyperlink-modal.component.html',
  styleUrl: './hyperlink-modal.component.scss',
})
export class HyperlinkModalComponent {
  ctrl: ModalController<string> = inject(ModalController);
}
