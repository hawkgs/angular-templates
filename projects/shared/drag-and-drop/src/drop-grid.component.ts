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
  ViewRef,
  computed,
  contentChildren,
  inject,
  input,
  viewChild,
} from '@angular/core';

import { Coor, DraggableDirective, Rect } from './draggable.directive';

const DEFAULT_GRID_COLS = 4;
const DEFAULT_CELL_GAP = 16;

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

  /**
   * Set the number of columns in the grid. Default: `4`
   */
  columns = input<number>(DEFAULT_GRID_COLS);

  /**
   * Set the cell gap/spacing. Default: `16px`
   */
  cellGap = input<number>(DEFAULT_CELL_GAP);

  gridTemplateColumns = computed(() => `repeat(${this.columns()}, 1fr)`);

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

  onDrag({ pos, rect }: { pos: Coor; rect: Rect }) {
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
        this._viewIdxHover !== cell.viewRefIdx &&
        cell.x1 <= pos.x &&
        pos.x <= cell.x2 &&
        cell.y1 <= pos.y &&
        pos.y <= cell.y2
      ) {
        gridVcr.move(this._slot, cell.viewRefIdx);
        this._viewIdxHover = cell.viewRefIdx;

        break;
      }
    }

    this._scrollContainer(rect);
  }

  onDrop(e: { id: string }) {
    if (!this._slot) {
      return;
    }

    const { x, y } = getViewRefElement(this._slot).getBoundingClientRect();
    this._zone.run(() => {
      this._draggablesDirectives.get(e.id)?.anchor.set({ x, y });
    });
  }

  onAnchored() {
    const gridVcr = this.gridVcr();
    if (!this._slot || !gridVcr) {
      return;
    }

    this._slot.destroy();

    const currIdx = gridVcr.indexOf(this._dragged!);
    const newIdx =
      this._viewIdxHover > currIdx
        ? this._viewIdxHover - 1
        : this._viewIdxHover;

    gridVcr.move(this._dragged!, newIdx);
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
    d.drop.subscribe((e) => this.onDrop(e));
    d.anchored.subscribe(() => this.onAnchored());

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

  /**
   * Create/calculate a spacial grid of all draggable elements
   * relative to the whole page.
   */
  private _calculateSpacialGrid() {
    this._spacialGrid = [];

    if (!this._draggablesViewRefs.size) {
      return;
    }

    // This implementation relies on a single call of `getBoundingClientRect`.
    // The rest of the grid cell position are deduced from the first one.
    // It's a more complex approach compared to the straightforward
    // "getBoundingClientRect on each iteration", but it should be more
    // performant, especially for lower-end devices.

    // Get the draggables in the order that they are rendered
    const draggables = this._getOrderedDraggables();

    // Calculate the bounding rectangle for the first element
    const firstEl = draggables[0].directive.element;
    const {
      x: startX,
      y,
      width: cellWidth,
      height: cellHeight,
    } = firstEl.getBoundingClientRect();

    // Setup the initial positions and the gaps/spacing
    const startY = y + this._scrollCont.scrollTop;
    const cols = this.columns();
    const gap = this.cellGap();

    let currX = startX;
    let currY = startY;
    let currWidth = 0;

    // Deduce the rest of the positions based on that
    for (const draggable of draggables) {
      const size = draggable.directive.elementSize();
      const width = cellWidth * size + gap * (size - 1);

      currWidth += size;

      if (currWidth > cols) {
        currY += cellHeight + gap;
        currX = startX;
        currWidth = size;
      }

      this._spacialGrid.push({
        id: draggable.id,
        viewRefIdx: draggable.idx,
        x1: currX,
        y1: currY,
        x2: currX + width,
        y2: currY + cellHeight,
      });

      currX += width + gap;
    }
  }

  /**
   * Helper method for calculating the spacial grid.
   *
   * Returns draggable objects in the order they are rendered.
   */
  private _getOrderedDraggables() {
    const ordered: {
      id: string;
      viewRef: ViewRef;
      idx: number;
      directive: DraggableDirective;
    }[] = [];

    this._draggablesViewRefs.forEach((vr, id) =>
      ordered.push({
        id: id,
        viewRef: vr,
        idx: this.gridVcr()?.indexOf(vr) as number,
        directive: this._draggablesDirectives.get(id) as DraggableDirective,
      }),
    );

    ordered.sort((a, b) => a.idx - b.idx);

    return ordered;
  }
}
