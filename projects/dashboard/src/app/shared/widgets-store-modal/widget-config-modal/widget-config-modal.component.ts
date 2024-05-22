import { Component, inject, signal } from '@angular/core';
import {
  MODAL_DATA,
  ModalContentComponent,
  ModalController,
} from '@ngx-templates/shared/modal';
import { SELECTOR_COMPONENTS } from '@ngx-templates/shared/selector';
import { ButtonComponent } from '@ngx-templates/shared/button';

export type WidgetConfigData = {
  supportedSizes: number[];
  supportedDataSource: string;
};

export type WidgetConfigResponse = {
  size: number;
  dataSource: string;
};

@Component({
  selector: 'db-widget-config-modal',
  standalone: true,
  imports: [ButtonComponent, ModalContentComponent, SELECTOR_COMPONENTS],
  templateUrl: './widget-config-modal.component.html',
  styleUrl: './widget-config-modal.component.scss',
})
export class WidgetConfigModalComponent {
  data = inject(MODAL_DATA) as WidgetConfigData;
  ctrl: ModalController<WidgetConfigResponse> = inject(ModalController);

  dataSource = signal<string>('test1');
  size = signal<string>('1');
  iterate = (size: number) => new Array(size);

  addWidget() {
    this.ctrl.close({
      dataSource: this.dataSource(),
      size: parseInt(this.size(), 10),
    });
  }
}
