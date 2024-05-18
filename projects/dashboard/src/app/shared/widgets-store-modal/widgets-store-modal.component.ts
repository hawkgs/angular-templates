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
import { WidgetType } from '../widgets/widget';

const WIDGETS: WidgetType[] = ['plain'];

export type WidgetStoreResponse = {
  widget: WidgetType;
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

  onWidgetClick(widget: WidgetType) {
    this._modalsService
      .createModal<void, string>(DataSourceModalComponent)
      .closed.then((dataSource) => {
        if (dataSource?.length) {
          this.ctrl.close({
            widget,
            dataSource,
          });
        }
      });
  }
}
