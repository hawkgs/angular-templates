import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EmbeddedViewRef,
  InjectionToken,
  Input,
  NgZone,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
  ViewRef,
  computed,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';

import { DraggableDirective } from './draggable.directive';
import { DROP_GRID_GROUP } from './drop-grid-group.directive';
import { Coor, Rect } from './types';

const DEFAULT_GRID_COLS = 4;
const DEFAULT_CELL_GAP = 16;

const MOUSEOVER_DELAY = 150;

// The size of the active area where the auto
// scroll is activated.
const HSCRL_ACTIVE_AREA = 50;

// The size of the maximal scroll step (in pixels)
// that can be reached during scroll.
const HSCRL_STEP = 5;

// The speed of the scroll is based on how deep
// inside the active area the mouse cursor is
// (continuous interval [0-1]). This constant
// controls how big the step size can become.
// Along with HSCRL_STEP, they determine how
// fast the auto scroll is.
const HSCRL_MAX_SPEED = 0.5;

export type MovedEvent = {
  id: string;
  pos: number;
  affected: { id: string; pos: number }[];
};

export type DragEvent = {
  id: string;
  /**
   * - `start` – A draggable has been pulled
   * - `move` – A draggable is being moved
   * - `drop` – A draggable has been dropped
   * - `anchored` – A draggable has been anchored to its slot (animation completed)
   */
  state: 'start' | 'move' | 'drop' | 'anchored';
  pos?: Coor;
};

// Represents a grid cell in our spacial grid
type GridCell = {
  id: string;
  viewRefIdx: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

// Represents the size/dimensions of a slot
type SlotSize = {
  colSpan: number;
  height: number;
};

const getViewRefElement = (vr: EmbeddedViewRef<unknown>): Element =>
  vr.rootNodes[0];

// Calculates the distance between a cell and a given point
const getDistanceToCell = (cell: GridCell, pt: Coor) => {
  const width = cell.x2 - cell.x1;
  const height = cell.y2 - cell.y1;
  const xCent = cell.x1 + width / 2;
  const yCent = cell.y1 + height / 2;
  const xDelta = xCent - pt.x;
  const yDelta = yCent - pt.y;

  return Math.sqrt(xDelta * xDelta + yDelta * yDelta);
};

export const DROP_GRID = new InjectionToken<DropGridComponent>('DROP_GRID');

@Component({
  selector: 'ngx-drop-grid',
  templateUrl: './drop-grid.component.html',
  styleUrl: './drop-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: DROP_GRID,
      useExisting: DropGridComponent,
    },
  ],
})
export class DropGridComponent implements AfterViewInit {
  private _zone = inject(NgZone);
  private _elRef = inject(ElementRef);
  private _renderer = inject(Renderer2);
  private _group = inject(DROP_GRID_GROUP, { optional: true });

  slotTemplate = viewChild.required('slotTemplate', { read: TemplateRef });
  gridVcr = viewChild.required('grid', { read: ViewContainerRef });

  /**
   * Emits an event when a draggable has been moved and
   * returns the new positions of all affected items.
   */
  moved = output<MovedEvent>();

  /**
   * Emits events throughout drag lifecycle.
   * Runs outside of NgZone.
   */
  drag = output<DragEvent>();

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

  /**
   * Disable when the height of the draggable items can't vary.
   * This will activate more performant calculations upon drag.
   * The option is overrided irrespective of the provided value,
   * if the grid is part of a group (i.e. always enabled/true).
   *
   * Default: `true`
   */
  variableHeight = input<boolean>(true);

  gridTemplateColumns = computed(
    () => `repeat(${this.columns()}, minmax(0, 1fr))`,
  );

  // ContentChildren does not work in our case due to the dynamic
  // nature of adding and remove views when transferring from one
  // group to another (the content children are not updated after
  // such operations).
  private _draggablesDirectives = new Map<string, DraggableDirective>();
  private _draggablesViewRefs = new Map<string, EmbeddedViewRef<unknown>>();
  private _draggablesEventsUnsubscribers = new Map<string, () => void>();
  private _orderedDirectives: DraggableDirective[] = [];

  private _slot: EmbeddedViewRef<unknown> | null = null; // Slot spacer `ViewRef`
  private _dragged: EmbeddedViewRef<unknown> | null = null; // Currently dragged
  private _draggedId?: string; // Currently dragged directive ID
  private _dropInProgress = false;
  private _mouseOverTimeout?: ReturnType<typeof setTimeout>;

  // Store in case you have to pass it to a group
  private _slotSize: SlotSize = { colSpan: 0, height: 0 };

  private _spacialGrid: GridCell[] = [];
  private _viewIdxHover = 0; // Index of the currently hovered `ViewRef`
  private _disabled = false;

  // Scrolling/Auto scrolling
  private _scrollContRect: Rect = { p1: { x: 0, y: 0 }, p2: { x: 0, y: 0 } };
  private _scrollInterval?: ReturnType<typeof setInterval>;

  // Used for groups; Keeps a function that triggers `moved` event
  // on the former host after a draggable handover is completed
  // (in order to notify the users for the transfer).
  //
  // Note(Georgi): This is currently disabled since it's not needed.
  private _exHostPosNotifier: (() => void) | null = null;

  constructor() {
    // Add the current grid to the
    // grids set, if part of a group.
    if (this._group) {
      this._group.add(this);
    }
  }

  @Input()
  set disabled(v: boolean) {
    this._disabled = v;

    for (const [, d] of this._draggablesDirectives) {
      d.disabled.set(v);
    }
  }

  /**
   * Returns `true`, if the current grid is
   * the drag host. Used for groups.
   */
  get isDragHost() {
    return !!this._slot;
  }

  get dropInProgress() {
    return this._dropInProgress;
  }

  private get _scrollCont(): Element {
    return this.scrollCont() || this._elRef.nativeElement.parentElement;
  }

  ngAfterViewInit() {
    this._zone.runOutsideAngular(() => {
      const el = this._elRef.nativeElement;

      this._renderer.listen(el, 'mouseenter', (e) => this._initiateHandover(e));

      // Sometimes the hand over initiation can't happen, if the drag occurred
      // very fast (mouseenter event precedes the slot creation). That's why,
      // there is a fallback mouseover handler that guarantees a handover.
      this._renderer.listen(el, 'mouseover', (e) => {
        if (this.isDragHost) {
          return;
        }
        if (this._mouseOverTimeout) {
          clearTimeout(this._mouseOverTimeout);
        }
        this._mouseOverTimeout = setTimeout(
          () => this._initiateHandover(e),
          MOUSEOVER_DELAY,
        );
      });
    });
  }

  insertDraggable(d: DraggableDirective) {
    const draggableViewRef = d.templateRef.createEmbeddedView(null);
    const pos = d.position();
    let insertionIdx = 0;

    // Since we might receive the draggables unordered
    // and in non-consecutive order,
    // i.e. "pos 5" first, "pos 3" second, "pos 7" third, etc.
    // we need to make sure they are inserted at the
    // correct index in the view container.
    if (this._orderedDirectives.length) {
      insertionIdx = this._orderedDirectives.length;

      for (let i = 0; i < this._orderedDirectives.length; i++) {
        const dirPos = this._orderedDirectives[i].position();

        if (dirPos >= pos) {
          insertionIdx = i;
          break;
        }
      }
      this._orderedDirectives.splice(insertionIdx, 0, d);
    } else {
      this._orderedDirectives.push(d);
    }

    this.gridVcr().insert(draggableViewRef, insertionIdx);

    // If the element exists, this means we are dealing with a re-rendering.
    // So, we have to clean up the old view.
    if (this._draggablesDirectives.has(d.id())) {
      this._draggablesViewRefs.get(d.id())?.destroy();
    }

    // We need to set the native element of the draggable target and
    // subscribe to the events that are going to be emitted on user
    // interaction. This is an unconventional approach of using/applying
    // structural directives.
    d.element = getViewRefElement(draggableViewRef);
    d.initEvents();

    this._subscribeToDraggableEvents(d);

    if (this._disabled) {
      d.disabled.set(true);
    }

    this._draggablesDirectives.set(d.id(), d);
    this._draggablesViewRefs.set(d.id(), draggableViewRef);
  }

  destroyDraggable(d: DraggableDirective) {
    const draggableViewRef = this._draggablesViewRefs.get(d.id());
    draggableViewRef?.destroy();

    this._cleanAllReferences(d.id());
  }

  onDragStart({
    elContPos,
    rect,
    id,
  }: {
    elContPos: Coor;
    rect: Rect;
    id: string;
  }) {
    const directive = this._draggablesDirectives.get(id);

    directive?.anchor.set(elContPos);

    const draggableSize = directive?.elementSize() || 1;

    // Store the size of the slot in case the
    // grid is part of a group (we'll need to pass
    // that data during a hand over).
    this._slotSize = {
      colSpan: draggableSize,
      height: rect.p2.y - rect.p1.y,
    };
    this._slot = this._createSlot(this._slotSize);

    this._dragged = this._draggablesViewRefs.get(id) || null;
    this._draggedId = id;

    const gridVcr = this.gridVcr();
    const viewIdx = gridVcr.indexOf(this._dragged!);
    gridVcr.insert(this._slot, viewIdx);

    this._viewIdxHover = viewIdx;

    this._calculateSpacialGrid();
    this._calculateScrollContRect();

    this.drag.emit({ id, state: 'start' });
  }

  onDrag({ pos, rect }: { pos: Coor; rect: Rect }) {
    if (!this._slot) {
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
        this.gridVcr().move(this._slot, cell.viewRefIdx);
        this._viewIdxHover = cell.viewRefIdx;

        break;
      }
    }

    this._scrollContainer(rect);
    this.drag.emit({
      id: this._draggedId!,
      state: 'move',
      pos,
    });
  }

  onDrop(e: { id: string }) {
    if (!this._slot) {
      return;
    }

    this._dropInProgress = true;

    const { x, y } = getViewRefElement(this._slot).getBoundingClientRect();
    this._zone.run(() => {
      this._draggablesDirectives.get(e.id)?.anchor.set({ x, y });
    });

    this.drag.emit({ id: e.id, state: 'drop' });
  }

  onAnchored() {
    if (!this._slot) {
      return;
    }

    this._dropInProgress = false;

    this._slot.destroy();
    // We have to manually clear the the slot
    // in order to prevent event handlers from executing.
    this._slot = null;

    const gridVcr = this.gridVcr();
    const currIdx = gridVcr.indexOf(this._dragged!);
    const newIdx =
      this._viewIdxHover > currIdx
        ? this._viewIdxHover - 1
        : this._viewIdxHover;

    gridVcr.move(this._dragged!, newIdx);

    // Notify for the updated positions
    this._emitUpdatedPositions();

    if (this._exHostPosNotifier) {
      // Note(Georgi): Currently disabled
      // this._exHostPosNotifier();
      this._exHostPosNotifier = null;
    }

    this.drag.emit({
      id: this._draggedId!,
      state: 'anchored',
    });
  }

  /**
   * Hands over all needed state to the new drop grid host
   * and cleans the state of the current grid (old host).
   *
   * Used only for grouped grids.
   */
  handOverDragging(): {
    directive: DraggableDirective;
    viewRef: EmbeddedViewRef<unknown>;
    slotSize: SlotSize;
    positionsNotifier: () => void;
  } {
    // Destroy the slot
    this._slot?.destroy();
    this._slot = null;

    // Detach the draggable view ref from the current grid
    // without destroying it
    const viewRef = this._dragged!;
    const idx = this.gridVcr().indexOf(viewRef);
    if (idx > -1) {
      this.gridVcr().detach(idx);
    }

    this._dragged = null;

    const id = this._draggedId!;
    const directive = this._draggablesDirectives.get(id)!;

    // Clear all of the state related to the tranferred draggable
    // that is no longer needed or might interfere with proper
    // functioning of the feature
    this._cleanAllReferences(id);

    const unsubscriber = this._draggablesEventsUnsubscribers.get(id)!;
    unsubscriber();

    return {
      directive,
      viewRef,
      slotSize: { ...this._slotSize },
      positionsNotifier: () => this._emitUpdatedPositions(),
    };
  }

  /**
   * Handles transfer from one draggable grid (host) to the current one.
   *
   * Available only for grouped grids.
   */
  private _initiateHandover(e: MouseEvent) {
    if (!this._group || this.isDragHost) {
      return;
    }

    const grids = Array.from(this._group).filter((g) => g !== this);

    // Abort if there is a drop in progress somewhere
    const dropInProgress = grids.find((g) => g.dropInProgress);
    if (dropInProgress) {
      return;
    }

    // Determine if there is a drag host (excl. `this`)
    const dragHost = grids.find((g) => g.isDragHost);
    if (!dragHost) {
      return;
    }

    // Request a transfer from the old/current host and
    // set all required state properties
    const { viewRef, directive, slotSize, positionsNotifier } =
      dragHost.handOverDragging();

    this._dragged = viewRef;
    this._slotSize = slotSize;
    this._draggedId = directive.id();
    this._slot = this._createSlot(slotSize);
    this._exHostPosNotifier = positionsNotifier;

    // Save the references and subscribe to the draggable event handlers
    this._draggablesDirectives.set(directive.id(), directive);
    this._draggablesViewRefs.set(directive.id(), viewRef);

    // Note(Georgi): There might be a more efficient way
    // where we don't have unsubscribe and subscribe to the event
    // handlers on each transfer but that'll require a more
    // major overhaul of the drop grid.
    this._subscribeToDraggableEvents(directive);

    this._calculateSpacialGrid();
    this._calculateScrollContRect();

    // Set the default position/index of the slot to 0
    const gridVcr = this.gridVcr();
    this._viewIdxHover = 0;

    // If there are other draggables in the list,
    // find the closest one and use its position for
    // the slot
    if (this._spacialGrid.length > 1) {
      const pos = {
        x: e.clientX,
        y: e.clientY,
      };

      let minDist = Number.POSITIVE_INFINITY;
      let closestCell: GridCell | undefined;

      for (const cell of this._spacialGrid) {
        const dist = getDistanceToCell(cell, pos);
        if (minDist > dist) {
          minDist = dist;
          closestCell = cell;
        }
      }

      if (closestCell) {
        this._viewIdxHover = closestCell.viewRefIdx;
      }
    }

    // Insert the draggable and the slot in the new VCR
    // of the new/current host
    gridVcr.insert(this._dragged, this._viewIdxHover);
    gridVcr.insert(this._slot, this._viewIdxHover);

    // We have to recalculate the grid after insertion of
    // the newly transferred item.
    //
    // Note(Georgi): There is room for some optimizations.
    this._calculateSpacialGrid();

    // Set the new anchor
    const { x, y } = this._slot.rootNodes[0].getBoundingClientRect();
    directive.anchor.set({ x, y });
  }

  /**
   * Creates a slot element without inserting it
   * in a view container.
   */
  private _createSlot({ colSpan, height }: SlotSize): EmbeddedViewRef<unknown> {
    const slot = this.slotTemplate().createEmbeddedView({});

    // Note(Georgi): Don't use the $implicit context of createEmbeddedView
    // to pass the col span and the height of the slot to the template.
    // The changes are applied after the spacial grid calculation which
    // breaks the grid, unless it's deferred via setTimeout.
    const [node] = slot.rootNodes;
    this._renderer.setStyle(node, 'height', height + 'px');
    this._renderer.setStyle(node, 'grid-column', 'span ' + colSpan);

    return slot;
  }

  /**
   * Subscribes to draggable directive event handlers and
   * stores their unsubscribers in the component's state.
   */
  private _subscribeToDraggableEvents(d: DraggableDirective) {
    const unsubscribers = [
      d._dragStart.subscribe((e) => this.onDragStart(e)),
      d._dragMove.subscribe((e) => this.onDrag(e)),
      d._drop.subscribe((e) => this.onDrop(e)),
      d._anchored.subscribe(() => this.onAnchored()),
    ];

    const unsubscribeFn = () => {
      for (const fn of unsubscribers) {
        fn.unsubscribe();
      }
    };

    this._draggablesEventsUnsubscribers.set(d.id(), unsubscribeFn);
  }

  /**
   * Scroll the `scrollCont` up or down the page, if a draggable is
   * dragged to the top or the bottom of the scroll container.
   * a.k.a. Auto scrolling
   *
   * Horizontal scroll should be handled separately by the developer.
   *
   * @param draggableRect
   */
  private _scrollContainer({ p1, p2 }: Rect) {
    if (this._scrollInterval) {
      clearInterval(this._scrollInterval);
    }

    const yCenter = (p2.y - p1.y) / 2 + p1.y;
    const yTop = yCenter - this._scrollContRect.p1.y;
    const yBottom = this._scrollContRect?.p2.y - yCenter;
    const dTop = HSCRL_ACTIVE_AREA - yTop;
    const dBottom = HSCRL_ACTIVE_AREA - yBottom;
    const cont = this._scrollCont;
    const scrolled = Math.ceil(cont.clientHeight + cont.scrollTop);

    if (dTop >= 0 && cont.scrollTop > 0) {
      const speed = Math.min(dTop / HSCRL_ACTIVE_AREA, HSCRL_MAX_SPEED);
      this._scrollInterval = setInterval(() => {
        cont.scrollTo(0, cont.scrollTop - HSCRL_STEP * speed);
      });
    } else if (dBottom >= 0 && cont.scrollHeight > scrolled) {
      const speed = Math.min(dBottom / HSCRL_ACTIVE_AREA, HSCRL_MAX_SPEED);
      this._scrollInterval = setInterval(() => {
        cont.scrollTo(0, cont.scrollTop + HSCRL_STEP * speed);
      });
    }
  }

  private _emitUpdatedPositions() {
    const affected: { id: string; pos: number }[] = [];
    let targetPos = -1;

    for (const [id, vr] of this._draggablesViewRefs) {
      const pos = this.gridVcr().indexOf(vr);
      if (id === this._draggedId) {
        targetPos = pos;
      }
      affected.push({ id, pos });
    }

    this.moved.emit({
      id: this._draggedId!,
      pos: targetPos,
      affected,
    });
  }

  /**
   * Create/calculate a spacial grid of all draggable elements
   * relative to the whole page (i.e. the coordinates of the
   * top-left and bottom-right points of each draggable in the grid)
   */
  private _calculateSpacialGrid() {
    this._spacialGrid = [];

    if (!this._draggablesViewRefs.size) {
      return;
    }

    // If the items don't have a variable height or are part
    // of a group, we can use a more performant way for calculating
    // the grid.
    if (!this.variableHeight() && !this._group) {
      this._calculateStaticSpacialGrid();
    } else {
      this._calculateDynamicSpacialGrid();
    }
  }

  private _calculateDynamicSpacialGrid() {
    this._spacialGrid = this._getOrderedDraggables().map((draggable) => {
      // Ensure that we are using the slot position in
      // case the dragged element is outside the grid
      let element = draggable.directive.element;
      if (draggable.id === this._draggedId) {
        element = this._slot?.rootNodes[0];
      }

      const { x, y, width, height } = element.getBoundingClientRect();
      const yWithScroll = y + this._scrollCont.scrollTop;

      return {
        id: draggable.id,
        viewRefIdx: draggable.idx,
        x1: x,
        y1: yWithScroll,
        x2: width + x,
        y2: height + yWithScroll,
      };
    });
  }

  private _calculateStaticSpacialGrid() {
    // This implementation relies on a single call of `getBoundingClientRect`.
    // The rest of the grid cell position are deduced from the first one.
    // It's a more complex approach compared to the straightforward
    // "getBoundingClientRect on each iteration", but it should be more
    // performant, especially for lower-end devices.

    // Get the draggables in the order that they are rendered
    const draggables = this._getOrderedDraggables();

    // Calculate the bounding rectangle for the first element
    const firstItem = draggables[0].directive;
    const {
      x: startX,
      y,
      width,
      height: cellHeight,
    } = firstItem.element.getBoundingClientRect();

    // Setup the initial positions and the gaps/spacing
    const startY = y + this._scrollCont.scrollTop;
    const cols = this.columns();
    const gap = this.cellGap();

    const firstItemSize = firstItem.elementSize();
    const cellWidth = (width - gap * (firstItemSize - 1)) / firstItemSize;

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

    for (const [id, vr] of this._draggablesViewRefs) {
      ordered.push({
        id: id,
        viewRef: vr,
        idx: this.gridVcr()?.indexOf(vr) as number,
        directive: this._draggablesDirectives.get(id) as DraggableDirective,
      });
    }

    ordered.sort((a, b) => a.idx - b.idx);

    return ordered;
  }

  /**
   * Clean all references of the provided directive
   */
  private _cleanAllReferences(id: string) {
    this._draggablesDirectives.delete(id);
    this._draggablesViewRefs.delete(id);

    const orderedIdx = this._orderedDirectives.findIndex((d) => d.id() === id);
    if (orderedIdx > -1) {
      this._orderedDirectives.splice(orderedIdx, 1);
    }
  }

  /**
   * Required for the auto scrolling.
   * Should be called once the drag starts or a handover is performed.
   */
  private _calculateScrollContRect() {
    const { top, left, bottom, right } =
      this._scrollCont.getBoundingClientRect();

    this._scrollContRect = {
      p1: { x: left, y: top },
      p2: { x: right, y: bottom },
    };
  }
}
