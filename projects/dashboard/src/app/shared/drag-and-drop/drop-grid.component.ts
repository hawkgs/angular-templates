import {
  AfterContentChecked,
  AfterContentInit,
  Component,
  ElementRef,
  EmbeddedViewRef,
  Input,
  NgZone,
  TemplateRef,
  ViewContainerRef,
  contentChildren,
  inject,
  input,
  viewChild,
} from '@angular/core';

import { Coor, DraggableDirective, Rect } from './draggable.directive';

type GridCell = {
  id: string;
  viewRefIdx: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

const getViewRefElement = (vr: EmbeddedViewRef<unknown>): Element =>
  vr.rootNodes[0];

@Component({
  selector: 'db-drop-grid',
  standalone: true,
  templateUrl: './drop-grid.component.html',
  styleUrl: './drop-grid.component.scss',
})
export class DropGridComponent
  implements AfterContentInit, AfterContentChecked
{
  private _zone = inject(NgZone);
  private _elRef = inject(ElementRef);

  bedTemplate = viewChild('bedTemplate', { read: TemplateRef });
  gridVcr = viewChild('grid', { read: ViewContainerRef });
  draggables = contentChildren(DraggableDirective);

  scrollCont = input<Element>();

  private _draggablesViewRefs = new Map<string, EmbeddedViewRef<unknown>>();
  private _draggablesDirectives = new Map<string, DraggableDirective>();

  private _bed?: EmbeddedViewRef<unknown>;
  private _dragged?: EmbeddedViewRef<unknown>;

  private _spacialGrid: GridCell[] = [];
  private _vcrIdxHover = 0;

  @Input()
  set disabled(v: boolean) {
    this.draggables().forEach((d) => {
      d.disabled.set(v);
    });
  }

  private get _scrollCont(): Element {
    return this.scrollCont() || this._elRef.nativeElement.parentElement;
  }

  ngAfterContentInit() {
    const draggables = this.draggables();

    if (draggables) {
      const sorted = [...draggables];
      sorted.sort((a, b) => a.position() - b.position());
      sorted.forEach((d) => this._insertDraggable(d));
    }
  }

  ngAfterContentChecked() {
    const newDraggables = this.draggables();
    if (this._draggablesDirectives.size === newDraggables.length) {
      return;
    }

    const currDraggables = [...this._draggablesDirectives].map(([, d]) => d);

    // Add
    if (newDraggables.length > currDraggables.length) {
      const targetDraggable = newDraggables.find(
        (d) => !this._draggablesDirectives.get(d.id()),
      )!;
      this._insertDraggable(targetDraggable);
    } else {
      // Remove
      const targetDraggableIdx = currDraggables.findIndex(
        (d) => !newDraggables.find((ud) => ud === d),
      );
      this._destroyDraggable(currDraggables[targetDraggableIdx]);
    }
  }

  onDragStart({ elContPos, id }: { elContPos: Coor; id: string }) {
    this._zone.run(() => {
      const gridVcr = this.gridVcr();
      const bedTemplate = this.bedTemplate();
      if (!gridVcr || !bedTemplate) {
        return;
      }

      const directive = this._draggablesDirectives.get(id);

      directive?.anchor.set(elContPos);

      const draggableSize = directive?.elementSize() || 1;
      this._bed = bedTemplate.createEmbeddedView({
        $implicit: draggableSize,
      });

      this._dragged = this._draggablesViewRefs.get(id);

      const vcrIdx = gridVcr.indexOf(this._dragged!);
      gridVcr.insert(this._bed, vcrIdx);

      this._vcrIdxHover = vcrIdx;

      this._calculateSpacialGrid();
    });
  }

  onDrag({ pos, rect, id }: { pos: Coor; rect: Rect; id: string }) {
    const gridVcr = this.gridVcr();
    if (!this._bed || !gridVcr) {
      return;
    }

    pos.y += this._scrollCont.scrollTop;

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

        const { x, y } = getViewRefElement(this._bed).getBoundingClientRect();
        this._zone.run(() => {
          this._draggablesDirectives.get(id)?.anchor.set({ x, y });
        });

        this._vcrIdxHover = cell.viewRefIdx;

        break;
      }
    }

    this._scrollContainer(rect);
  }

  onDrop() {
    const gridVcr = this.gridVcr();
    if (!this._bed || !gridVcr) {
      return;
    }

    this._bed.destroy();

    const currIdx = gridVcr.indexOf(this._dragged!);
    const newIdx =
      this._vcrIdxHover >= currIdx ? this._vcrIdxHover - 1 : this._vcrIdxHover;

    gridVcr.move(this._dragged!, newIdx);
  }

  private _calculateSpacialGrid() {
    this._spacialGrid = [];

    this._draggablesViewRefs.forEach((vr, id) => {
      const el = getViewRefElement(vr);
      const { x, y, width, height } = el.getBoundingClientRect();

      this._spacialGrid.push({
        id,
        viewRefIdx: this.gridVcr()?.indexOf(vr) as number,
        x1: x,
        y1: y + this._scrollCont.scrollTop,
        x2: x + width,
        y2: y + height + this._scrollCont.scrollTop,
      });
    });
  }

  private _insertDraggable(d: DraggableDirective) {
    const gridVcr = this.gridVcr();
    if (!gridVcr) {
      return;
    }

    const draggableViewRef = d.templateRef.createEmbeddedView(null);
    gridVcr.insert(draggableViewRef);

    d.element = getViewRefElement(draggableViewRef);
    d.initEvents();

    d.dragStart.subscribe((e) => this.onDragStart(e));
    d.dragMove.subscribe((e) => this.onDrag(e));
    d.drop.subscribe(() => this.onDrop());

    this._draggablesDirectives.set(d.id(), d);
    this._draggablesViewRefs.set(d.id(), draggableViewRef);
  }

  private _destroyDraggable(d: DraggableDirective) {
    const draggableViewRef = this._draggablesViewRefs.get(d.id());
    draggableViewRef?.destroy();

    this._draggablesDirectives.delete(d.id());
    this._draggablesViewRefs.delete(d.id());
  }

  private _scrollContainer(draggableRect: Rect) {
    const deltaBottomY = draggableRect.p2.y - this._scrollCont.clientHeight;

    if (deltaBottomY > 0) {
      this._scrollCont.scrollTo({
        top: this._scrollCont.scrollTop + deltaBottomY,
        behavior: 'smooth',
      });
    } else if (draggableRect.p1.y < 0) {
      this._scrollCont.scrollTo({
        top: this._scrollCont.scrollTop - Math.abs(draggableRect.p1.y),
        behavior: 'smooth',
      });
    }
  }
}
