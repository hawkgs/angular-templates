import { DOCUMENT } from '@angular/common';
import {
  AfterRenderPhase,
  Component,
  afterNextRender,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { DRAG_AND_DROP_DIRECTIVES } from '@ngx-templates/shared/drag-and-drop';
import { ButtonComponent } from '@ngx-templates/shared/button';
import { ModalService } from '@ngx-templates/shared/modal';
import { Map } from 'immutable';

import { WidgetComponent } from '../widgets/widget.component';
import {
  WidgetStoreResponse,
  WidgetsStoreModalComponent,
} from '../widgets-store-modal/widgets-store-modal.component';
import { GridStoreService } from './grid-store.service';
import { WidgetGridItem } from './widget-grid-item';

@Component({
  selector: 'db-widgets-grid',
  standalone: true,
  imports: [WidgetComponent, ButtonComponent, DRAG_AND_DROP_DIRECTIVES],
  providers: [GridStoreService],
  templateUrl: './widgets-grid.component.html',
  styleUrl: './widgets-grid.component.scss',
})
export class WidgetsGridComponent {
  doc = inject(DOCUMENT);
  private _modalService = inject(ModalService);
  private _gridStore = inject(GridStoreService);

  private _widgets = signal<Map<string, WidgetGridItem>>(Map([]));
  editMode = signal<boolean>(false);
  widgets = computed(() => this._widgets().toList());
  widgetsLoaded = signal<boolean>(false);

  constructor() {
    const widgets = this._gridStore.getGridItems();
    this._widgets.set(widgets);

    effect(() => {
      this._gridStore.setGridItems(this._widgets());
    });

    // Mark widgets as loaded on the browser
    afterNextRender(() => this.widgetsLoaded.set(true), {
      phase: AfterRenderPhase.Read,
    });
  }

  addWidget() {
    this._modalService
      .createModal<void, WidgetStoreResponse>(WidgetsStoreModalComponent)
      .closed.then((resp) => {
        if (resp) {
          const { widgetType } = resp;
          const id = 'random' + Date.now(); // Temp

          this._widgets.update((m) =>
            m.set(
              id,
              new WidgetGridItem({
                id,
                position: m.size,
                type: widgetType,
                config: { style: 'gold' },
                size: 1,
              }),
            ),
          );
        }
      });
  }

  removeWidget(id: string) {
    this._widgets.update((m) => m.delete(id));
  }

  onWidgetMoved(positions: { id: string; pos: number }[]) {
    this._widgets.update((widgets) => {
      positions.forEach(({ id, pos }) => {
        widgets = widgets.set(id, widgets.get(id)!.set('position', pos));
      });
      return widgets;
    });
  }
}
