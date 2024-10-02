import { Component, HostBinding, input } from '@angular/core';
import { IconComponent } from '@ngx-templates/shared/icon';
import { ModalController } from '../modal.controller';

type TextSize = 'standard' | 'compact';

@Component({
  selector: 'ngx-modal-content',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './modal-content.component.html',
  styleUrl: './modal-content.component.scss',
})
export class ModalContentComponent<T> {
  controller = input.required<ModalController<T>>();
  textSize = input<TextSize>('standard');

  @HostBinding('class.compact')
  get isTextCompact() {
    return this.textSize() === 'compact';
  }
}
