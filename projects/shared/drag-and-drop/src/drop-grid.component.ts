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

// Represents a grid cell in our spacial grid
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
  selector: 'ngx-drop-grid',
  standalone: true,
  templateUrl: './drop-grid.component.html',
  styleUrl: './drop-grid.component.scss',
})
export class DropGridComponent
  implements AfterContentInit, AfterContentChecked
{
  private _zone = inject(NgZone);
  private _elRef = inject(ElementRef);

  slotTemplate = viewChild('slotTemplate', { read: TemplateRef });
  gridVcr = viewChild('grid', { read: ViewContainerRef });
  draggables = contentChildren(DraggableDirective);

  /**
   * Set the scroll container of the drop grid. If not set,
   * it will default to the grid's parent element.
   */
  scrollCont = input<Element>();

  private _draggablesViewRefs = new Map<string, EmbeddedViewRef<unknown>>();
  private _draggablesDirectives = new Map<string, DraggableDirective>();

  private _slot?: EmbeddedViewRef<unknown>; // Slot spacer `ViewRef`
  private _dragged?: EmbeddedViewRef<unknown>; // Currently dragged

  private _spacialGrid: GridCell[] = [];
  private _viewIdxHover = 0; // Index of the currently hovered `ViewRef`
  private _disabled = false;

  @Input()
  set disabled(v: boolean) {
    this._disabled = v;
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
      // Sort and then insert the draggable according to the
      // initially provided position
      const sorted = [...draggables];
      sorted.sort((a, b) => a.position() - b.position());
      sorted.forEach((d) => this._insertDraggable(d));
    }
  }

  ngAfterContentChecked() {
    const newDraggables = this.draggables();

    // Determine whether there is a change in the draggables.
    // This check should be sufficient for our use case.
    if (this._draggablesDirectives.size === newDraggables.length) {
      return;
    }

    const currDraggables = [...this._draggablesDirectives].map(([, d]) => d);

    // Add a new draggable
    if (newDraggables.length > currDraggables.length) {
      const targetDraggable = newDraggables.find(
        (d) => !this._draggablesDirectives.get(d.id()),
      )!;
      this._insertDraggable(targetDraggable);
    } else {
      // Remove an existing draggable
      const targetDraggableIdx = currDraggables.findIndex(
        (d) => !newDraggables.find((ud) => ud === d),
      );
      this._destroyDraggable(currDraggables[targetDraggableIdx]);
    }
  }

  onDragStart({ elContPos, id }: { elContPos: Coor; id: string }) {
    this._zone.run(() => {
      const gridVcr = this.gridVcr();
      const slotTemplate = this.slotTemplate();
      if (!gridVcr || !slotTemplate) {
        return;
      }

      const directive = this._draggablesDirectives.get(id);

      directive?.anchor.set(elContPos);

      const draggableSize = directive?.elementSize() || 1;
      this._slot = slotTemplate.createEmbeddedView({
        $implicit: draggableSize,
      });

      this._dragged = this._draggablesViewRefs.get(id);

      const viewIdx = gridVcr.indexOf(this._dragged!);
      gridVcr.insert(this._slot, viewIdx);

      this._viewIdxHover = viewIdx;

      this._calculateSpacialGrid();
    });
  }

  onDrag({ pos, rect, id }: { pos: Coor; rect: Rect; id: string }) {
    const gridVcr = this.gridVcr();
    if (!this._slot || !gridVcr) {
      return;
    }

    // Since the coordinates returned from `ngxDraggable` are
    // relative to the viewport, we must add the `scrollTop`
    // in order to accommodate for the whole page.
    pos.y += this._scrollCont.scrollTop;

    // Check where the draggable is hovering and move the
    // slot spacer accordingly.
    for (const cell of this._spacialGrid) {
      if (
        id !== cell.id &&
        this._viewIdxHover !== cell.viewRefIdx &&
        cell.x1 <= pos.x &&
        pos.x <= cell.x2 &&
        cell.y1 <= pos.y &&
        pos.y <= cell.y2
      ) {
        gridVcr.move(this._slot, cell.viewRefIdx);

        const { x, y } = getViewRefElement(this._slot).getBoundingClientRect();
        this._zone.run(() => {
          this._draggablesDirectives.get(id)?.anchor.set({ x, y });
        });

        this._viewIdxHover = cell.viewRefIdx;

        break;
      }
    }

    this._scrollContainer(rect);
  }

  onDrop() {
    const gridVcr = this.gridVcr();
    if (!this._slot || !gridVcr) {
      return;
    }

    this._slot.destroy();

    const currIdx = gridVcr.indexOf(this._dragged!);
    const newIdx =
      this._viewIdxHover >= currIdx
        ? this._viewIdxHover - 1
        : this._viewIdxHover;

    gridVcr.move(this._dragged!, newIdx);
  }

  /**
   * Create/calculate a spacial grid of all draggable elements
   * relative to the whole page.
   */
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

    // We need to set the native element of the draggable target and
    // subscribe to the events that are going to be emitted on user
    // interaction. This is an unconventional approach of using/applying
    // structural directives.

    d.element = getViewRefElement(draggableViewRef);
    d.initEvents();

    d.dragStart.subscribe((e) => this.onDragStart(e));
    d.dragMove.subscribe((e) => this.onDrag(e));
    d.drop.subscribe(() => this.onDrop());

    if (this._disabled) {
      d.disabled.set(true);
    }

    this._draggablesDirectives.set(d.id(), d);
    this._draggablesViewRefs.set(d.id(), draggableViewRef);
  }

  private _destroyDraggable(d: DraggableDirective) {
    const draggableViewRef = this._draggablesViewRefs.get(d.id());
    draggableViewRef?.destroy();

    this._draggablesDirectives.delete(d.id());
    this._draggablesViewRefs.delete(d.id());
  }

  /**
   * Scroll the `scrollCont` up or down the page, if a draggable is
   * dragged to the top or bottom of the viewport.
   *
   * @param draggableRect
   */
  private _scrollContainer(draggableRect: Rect) {
    // Note(Georgi): Might require some UX improvements

    const deltaBottomY = draggableRect.p2.y - this._scrollCont.clientHeight;

    if (deltaBottomY > 0) {
      // Scroll down
      this._scrollCont.scrollTo({
        top: this._scrollCont.scrollTop + deltaBottomY,
        behavior: 'smooth',
      });
    } else if (draggableRect.p1.y < 0) {
      // Scroll up
      this._scrollCont.scrollTo({
        top: this._scrollCont.scrollTop - Math.abs(draggableRect.p1.y),
        behavior: 'smooth',
      });
    }
  }
}
