import {
  Component,
  ElementRef,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
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
  title: string;
};

const SRC_TYPE_NAME: { [key in DataSourceType]: string } = {
  [DataSourceType.List]: 'List',
  [DataSourceType.SingleValued]: 'Single-valued',
  [DataSourceType.Tabular]: 'Tabular',
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

  titleInput = viewChild.required<ElementRef>('titleInput');
  dataSourceId = signal<string>('');
  size = signal<string>('1');

  iterate = (size: number) => new Array(size);

  selectedSourceName = computed(
    () => DATA_SOURCES.find((ds) => ds.id === this.dataSourceId())?.name,
  );

  addWidget() {
    this.ctrl.close({
      dataSourceId: this.dataSourceId(),
      size: parseInt(this.size(), 10),
      title: this.titleInput().nativeElement.value,
    });
  }
}
