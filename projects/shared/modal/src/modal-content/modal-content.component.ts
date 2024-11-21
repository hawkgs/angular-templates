import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconComponent } from '@ngx-templates/shared/icon';
import { ModalController } from '../modal.controller';

@Component({
  selector: 'ngx-modal-content',
  imports: [IconComponent],
  templateUrl: './modal-content.component.html',
  styleUrl: './modal-content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalContentComponent<T> {
  controller = input.required<ModalController<T>>();
}
