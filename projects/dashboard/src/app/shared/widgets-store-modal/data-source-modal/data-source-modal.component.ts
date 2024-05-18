import { Component, inject } from '@angular/core';
import {
  ModalContentComponent,
  ModalController,
} from '@ngx-templates/shared/modal';

@Component({
  selector: 'db-data-source-modal',
  standalone: true,
  imports: [ModalContentComponent],
  templateUrl: './data-source-modal.component.html',
  styleUrl: './data-source-modal.component.scss',
})
export class DataSourceModalComponent {
  ctrl: ModalController<string> = inject(ModalController);
}
