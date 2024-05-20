import { Component, inject } from '@angular/core';
import {
  MODAL_DATA,
  ModalContentComponent,
  ModalController,
  ModalService,
} from '@ngx-templates/shared/modal';

import { WidgetItemComponent } from './widget-item/widget-item.component';
import { WidgetComponent } from '../widgets/widget.component';
import { DataSourceModalComponent } from './data-source-modal/data-source-modal.component';
import { WidgetConfig, WidgetType } from '../widgets/widget';

// List of widgets available to add to the dashboard.
const WIDGETS: {
  type: WidgetType;
  config: WidgetConfig;
}[] = [
  {
    type: 'plain',
    config: { style: 'grey' },
  },
];

export type WidgetStoreResponse = {
  widgetType: WidgetType;
  dataSource: string;
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
    this._modalsService
      .createModal<void, string>(DataSourceModalComponent)
      .closed.then((dataSource) => {
        if (dataSource?.length) {
          this.ctrl.close({
            widgetType,
            dataSource,
          });
        }
      });
  }
}
