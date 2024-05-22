import { Component, inject } from '@angular/core';
import {
  MODAL_DATA,
  ModalContentComponent,
  ModalController,
  ModalService,
} from '@ngx-templates/shared/modal';

import { WidgetItemComponent } from './widget-item/widget-item.component';
import { WidgetComponent } from '../widgets/widget.component';
import {
  WidgetConfigData,
  WidgetConfigModalComponent,
  WidgetConfigResponse,
} from './widget-config-modal/widget-config-modal.component';
import { WidgetType } from '../widgets/widget';
import { WidgetStoreItem } from './widget-store-item';

// List of widgets available to add to the dashboard.
const WIDGETS: WidgetStoreItem[] = [
  {
    type: 'plain',
    demoConfig: { style: 'grey' },
    supportedSizes: [1, 2],
    supportedDataSource: 'test',
  },
];

export type WidgetStoreResponse = {
  widgetType: WidgetType;
  dataSource: string;
  size: number;
};

@Component({
  selector: 'db-widgets-store-modal',
  standalone: true,
  imports: [ModalContentComponent, WidgetItemComponent, WidgetComponent],
  templateUrl: './widgets-store-modal.component.html',
  styleUrl: './widgets-store-modal.component.scss',
})
export class WidgetsStoreModalComponent {
  data = inject(MODAL_DATA) as string;
  ctrl: ModalController<WidgetStoreResponse> = inject(ModalController);
  private _modalsService = inject(ModalService);

  widgets = WIDGETS;

  onWidgetClick(widgetType: WidgetType) {
    const idx = WIDGETS.findIndex((i) => i.type === widgetType);

    this._modalsService
      .createModal<
        WidgetConfigData,
        WidgetConfigResponse
      >(WidgetConfigModalComponent, WIDGETS[idx])
      .closed.then((resp) => {
        if (resp) {
          this.ctrl.close({
            widgetType,
            dataSource: resp.dataSource,
            size: resp.size,
          });
        }
      });
  }
}
