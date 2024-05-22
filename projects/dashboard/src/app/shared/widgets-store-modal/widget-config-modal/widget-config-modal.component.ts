import { Component, inject, signal } from '@angular/core';
import {
  MODAL_DATA,
  ModalContentComponent,
  ModalController,
} from '@ngx-templates/shared/modal';
import { SELECTOR_COMPONENTS } from '@ngx-templates/shared/selector';
import { ButtonComponent } from '@ngx-templates/shared/button';
import { DATA_SOURCES } from '../../../data/sources';
import { DataSourceType } from '../../../data/types';

export type WidgetConfigData = {
  supportedSizes: number[];
  supportedDataSource: string;
};

export type WidgetConfigResponse = {
  size: number;
  dataSourceId: string;
};

const SRC_TYPE_NAME = {
  [DataSourceType.List]: 'List',
  [DataSourceType.SingleValued]: 'Single-valued',
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

  SRC_TYPE_NAME = SRC_TYPE_NAME;

  sources = DATA_SOURCES.filter(
    (src) => this.data.supportedDataSource === src.type,
  );

  dataSourceId = signal<string>('');
  size = signal<string>('1');
  iterate = (size: number) => new Array(size);

  addWidget() {
    this.ctrl.close({
      dataSourceId: this.dataSourceId(),
      size: parseInt(this.size(), 10),
    });
  }
}
