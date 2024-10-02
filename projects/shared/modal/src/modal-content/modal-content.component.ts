import { Component, input } from '@angular/core';
import { IconComponent } from '@ngx-templates/shared/icon';
import { ModalController } from '../modal.controller';

@Component({
  selector: 'ngx-modal-content',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './modal-content.component.html',
  styleUrl: './modal-content.component.scss',
})
export class ModalContentComponent<T> {
  controller = input.required<ModalController<T>>();
}
