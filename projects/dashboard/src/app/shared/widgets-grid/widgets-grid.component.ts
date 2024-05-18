import { DOCUMENT } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { DRAG_AND_DROP_DIRECTIVES } from '@ngx-templates/shared/drag-and-drop';
import { ButtonComponent } from '@ngx-templates/shared/button';
import { ModalService } from '@ngx-templates/shared/modal';
import { List } from 'immutable';
import { WidgetComponent } from '../widgets/widget/widget.component';
import {
  WidgetStoreResponse,
  WidgetsStoreModalComponent,
} from '../widgets-store-modal/widgets-store-modal.component';
import { WidgetConfig, WidgetType } from '../widgets/widget';

type WidgetItem = {
  id: string;
  position: number;
  type: WidgetType;
  config: WidgetConfig;
  size: number;
};

const list = List<WidgetItem>([
  {
    id: 'r1',
    position: 0,
    type: 'plain',
    config: { style: 'red' },
    size: 1,
  },
  {
    id: 'g1',
    position: 1,
    type: 'plain',
    config: { style: 'green' },
    size: 1,
  },
  { id: 'b1', position: 2, type: 'plain', config: { style: 'blue' }, size: 2 },
  {
    id: 'p1',
    position: 4,
    type: 'plain',
    config: { style: 'purple' },
    size: 1,
  },
  {
    id: 'o1',
    position: 3,
    type: 'plain',
    config: { style: 'orange' },
    size: 1,
  },
]);

@Component({
  selector: 'db-widgets-grid',
  standalone: true,
  imports: [WidgetComponent, ButtonComponent, DRAG_AND_DROP_DIRECTIVES],
  templateUrl: './widgets-grid.component.html',
  styleUrl: './widgets-grid.component.scss',
})
export class WidgetsGridComponent {
  doc = inject(DOCUMENT);
  private _modalService = inject(ModalService);

  title = 'dashboard';
  editMode = signal<boolean>(false);
  widgets = signal<List<WidgetItem>>(list);

  addWidget() {
    this._modalService
      .createModal<void, WidgetStoreResponse>(WidgetsStoreModalComponent)
      .closed.then((wObj) => {
        if (wObj) {
          this.widgets.update((l) =>
            l.push({
              id: 'random' + Date.now(),
              position: l.size,
              type: 'plain',
              config: { style: 'gold' },
              size: 1,
            }),
          );
        }
      });
  }

  removeWidget(id: string) {
    this.widgets.update((l) => {
      const idx = l.findIndex((w) => w.id === id);
      return l.remove(idx);
    });
  }

  testModal() {
    this._modalService
      .createModal<
        string,
        string
      >(WidgetsStoreModalComponent, 'This is passed data')
      .closed.then((output) => {
        console.log('This is output data', output);
      });
  }
}
