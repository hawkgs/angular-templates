import { Component, inject } from '@angular/core';
import { IconComponent } from '@ngx-templates/shared/icon';
import {
  ModalContentComponent,
  ModalController,
} from '@ngx-templates/shared/modal';

@Component({
  selector: 'kb-about-modal',
  standalone: true,
  imports: [IconComponent, ModalContentComponent],
  templateUrl: './about-modal.component.html',
  styleUrl: './about-modal.component.scss',
})
export class AboutModalComponent {
  ctrl = inject(ModalController);
}
