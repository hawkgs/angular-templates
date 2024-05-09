import {
  AfterContentInit,
  Component,
  EmbeddedViewRef,
  NgZone,
  PLATFORM_ID,
  TemplateRef,
  ViewContainerRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { Coor, DraggableDirective } from '../draggable/draggable.directive';
import { WidgetComponent } from '../widget/widget.component';
import { WINDOW } from '../window.provider';

const WIDGETS = ['red', 'green', 'blue', 'purple', 'orange'];

type GridCell = {
  id: string;
  viewRefIdx: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

@Component({
  selector: 'db-widget-grid',
  standalone: true,
  imports: [DraggableDirective, WidgetComponent],
  templateUrl: './widget-grid.component.html',
  styleUrl: './widget-grid.component.scss',
})
export class WidgetGridComponent implements AfterContentInit {
  private _win = inject(WINDOW);
  private _platformId = inject(PLATFORM_ID);
  private _zone = inject(NgZone);

  widgetTemplate = viewChild('widgetTemplate', { read: TemplateRef });
  bedTemplate = viewChild('bedTemplate', { read: TemplateRef });
  gridVcr = viewChild('grid', { read: ViewContainerRef });

  anchor = signal<Coor>({ x: 0, y: 0 });
  private _widgetViewRefs = new Map<string, EmbeddedViewRef<unknown>>();
  private _widgetTypes = new Map<string, string>();

  private _bed?: EmbeddedViewRef<unknown>;
  private _draggedWidget?: EmbeddedViewRef<unknown>;

  private _spacialGrid: GridCell[] = [];
  private _vcrIdxHover = 0;

  ngAfterContentInit() {
    const gridVcr = this.gridVcr();
    const widgetTemplate = this.widgetTemplate();

    if (gridVcr && widgetTemplate) {
      WIDGETS.forEach((type: string) => {
        const id = isPlatformBrowser(this._platformId)
          ? this._win.crypto.randomUUID()
          : '';
        const widget = widgetTemplate.createEmbeddedView({
          $implicit: { id, type },
        });
        gridVcr.insert(widget);
        this._widgetViewRefs.set(id, widget);
        this._widgetTypes.set(id, type);
      });
    }
  }

  onDragStart({ elContPos, id }: { elContPos: Coor; id: string }) {
    this._zone.run(() => {
      const gridVcr = this.gridVcr();
      const bedTemplate = this.bedTemplate();
      if (!gridVcr || !bedTemplate) {
        return;
      }

      this.anchor.set(elContPos);

      const widgetType = this._widgetTypes.get(id);

      this._bed = bedTemplate.createEmbeddedView({
        $implicit: widgetType,
      });

      this._draggedWidget = this._widgetViewRefs.get(id);

      const vcrIdx = gridVcr.indexOf(this._draggedWidget!);
      gridVcr.insert(this._bed, vcrIdx);

      this._vcrIdxHover = vcrIdx;

      this._calculateSpacialGrid();
    });
  }

  onDrag({ pos, id }: { pos: Coor; id: string }) {
    const gridVcr = this.gridVcr();
    if (!this._bed || !gridVcr) {
      return;
    }

    for (const cell of this._spacialGrid) {
      if (
        id !== cell.id &&
        this._vcrIdxHover !== cell.viewRefIdx &&
        cell.x1 <= pos.x &&
        pos.x <= cell.x2 &&
        cell.y1 <= pos.y &&
        pos.y <= cell.y2
      ) {
        gridVcr.move(this._bed, cell.viewRefIdx);

        const { x, y } = this._bed.rootNodes[0].getBoundingClientRect();
        this._zone.run(() => this.anchor.set({ x, y }));

        this._vcrIdxHover = cell.viewRefIdx;
        // this._devPrint();

        break;
      }
    }
  }

  onAnchored() {
    const gridVcr = this.gridVcr();
    if (!this._bed || !gridVcr) {
      return;
    }

    this._bed.destroy();

    const currIdx = gridVcr.indexOf(this._draggedWidget!);
    const newIdx =
      this._vcrIdxHover >= currIdx ? this._vcrIdxHover - 1 : this._vcrIdxHover;

    gridVcr.move(this._draggedWidget!, newIdx);

    // this._devPrint();
  }

  private _calculateSpacialGrid() {
    this._spacialGrid = [];

    this._widgetViewRefs.forEach((vr, id) => {
      const el = vr.rootNodes[0];
      const { x, y, width, height } = el.getBoundingClientRect();

      this._spacialGrid.push({
        id,
        viewRefIdx: this.gridVcr()?.indexOf(vr) as number,
        x1: x,
        y1: y,
        x2: x + width,
        y2: y + height,
      });
    });
  }

  private _devPrint() {
    const arr: string[] = [];
    this._widgetViewRefs.forEach((vr, id) => {
      arr.push(
        this.gridVcr()?.indexOf(vr) + ' => ' + this._widgetTypes.get(id),
      );
    });
    const bedIdx = this.gridVcr()?.indexOf(this._bed!);
    if (bedIdx !== undefined && bedIdx > -1) {
      arr.push(bedIdx + ' => BED');
    }
    arr.sort();
    console.log(arr);
  }
}
