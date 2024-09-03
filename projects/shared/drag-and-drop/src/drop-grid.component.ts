import {
  AfterContentChecked,
  AfterContentInit,
  Component,
  ElementRef,
  EmbeddedViewRef,
  HostListener,
  Input,
  NgZone,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
  ViewRef,
  computed,
  contentChildren,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';

import { Coor, DraggableDirective, Rect } from './draggable.directive';
import { DROP_GRID_GROUP } from './drop-grid-group.directive';

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

// Note(Georgi): Temp
let instance = 1;

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
  private _renderer = inject(Renderer2);
  private _grids = inject(DROP_GRID_GROUP, { optional: true });

  // Note(Georgi): Temp
  private _instance = -1;

  slotTemplate = viewChild.required('slotTemplate', { read: TemplateRef });
  gridVcr = viewChild.required('grid', { read: ViewContainerRef });
  draggables = contentChildren(DraggableDirective);

  /**
   * Emits an event when a draggable has been moved and return new positions.
   */
  moved = output<{ id: string; pos: number }[]>();

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
   * Enable when the height of the draggable items could vary. Default: `false`
   */
  variableHeight = input<boolean>(false);

  gridTemplateColumns = computed(() => `repeat(${this.columns()}, 1fr)`);

  private _draggablesViewRefs = new Map<string, EmbeddedViewRef<unknown>>();
  private _draggablesDirectives = new Map<string, DraggableDirective>();
  private _draggableEventsUnsubscribers = new Map<string, () => void>();

  private _slot: EmbeddedViewRef<unknown> | null = null; // Slot spacer `ViewRef`
  private _dragged: EmbeddedViewRef<unknown> | null = null; // Currently dragged
  private _draggedId?: string; // Currently dragged directive ID

  private _spacialGrid: GridCell[] = [];
  private _viewIdxHover = 0; // Index of the currently hovered `ViewRef`
  private _disabled = false;
  private _slotSize: SlotSize = { colSpan: 0, height: 0 };
  private _isGrouped = false;

  constructor() {
    // Add the current grid to the
    // grids set, if part of a group.
    if (this._grids) {
      this._grids.add(this);
      this._isGrouped = true;
    }

    // Note(Georgi): Temp
    this._instance = instance;
    instance++;
  }

  @Input()
  set disabled(v: boolean) {
    this._disabled = v;
    this.draggables().forEach((d) => {
      d.disabled.set(v);
    });
  }

  /**
   * Returns `true`, if the current grid is
   * the drag host. Used for groups.
   */
  get isDragHost() {
    return !!this._slot;
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
      // this._destroyDraggable(currDraggables[targetDraggableIdx]);
    }
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
    this._zone.run(() => {
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
    });
  }

  onDrag({ pos, rect }: { pos: Coor; rect: Rect }) {
    if (!this._slot) {
      return;
    }

    console.log('Slot drag at Grid ', this._instance);

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
    if (!this._slot) {
      return;
    }

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
    const positions: { id: string; pos: number }[] = [];
    this._draggablesViewRefs.forEach((vr, id) => {
      positions.push({ id, pos: this.gridVcr().indexOf(vr) });
    });
    this.moved.emit(positions);
  }

  /**
   * Handles transfer from one draggable grid (host) to the current one.
   *
   * Available only for grouped grids.
   */
  @HostListener('mouseenter', ['$event'])
  onGridMouseEnter(e: MouseEvent) {
    if (!this._isGrouped) {
      return;
    }

    // Determine if there are is a drag host
    const grids = [...(this._grids || [])].filter((g) => g !== this);
    const dragHost = grids.find((g) => g.isDragHost);

    if (!dragHost) {
      return;
    }

    console.log('1. Control taken over from Grid', this._instance);

    // Request a transfer from the old/current host and
    // set all required state properties
    const { viewRef, directive, slotSize } = dragHost.handOverDragging();

    this._dragged = viewRef;
    this._slotSize = slotSize;
    this._draggedId = directive.id();
    this._slot = this._createSlot(slotSize);

    this._calculateSpacialGrid();

    // Set the default position/index of the slot to 0
    const gridVcr = this.gridVcr();
    this._viewIdxHover = 0;

    // If there are other draggables in the list,
    // find the closest one and use its position for
    // the slot
    if (this._spacialGrid.length) {
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

    const { x, y } = this._slot.rootNodes[0].getBoundingClientRect();

    // Set the new anchor
    directive.anchor.set({ x, y });

    // Save the references and subscribe to the draggable event handlers
    this._draggablesDirectives.set(directive.id(), directive);
    this._draggablesViewRefs.set(directive.id(), viewRef);
    this._subscribeToDraggableEvents(directive);
  }

  /**
   * Hands over all needed state to the new drag grid host
   * and cleans the state of the current grid (old host).
   *
   * Used only for grouped grids.
   */
  handOverDragging(): {
    directive: DraggableDirective;
    viewRef: EmbeddedViewRef<unknown>;
    slotSize: SlotSize;
  } {
    console.log('2. Hand over happening at Grid', this._instance);

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

    // Clear all references of the tranferred draggable
    this._draggablesDirectives.delete(id);
    this._draggablesViewRefs.delete(id);
    this._draggableEventsUnsubscribers.get(id)!();

    return {
      directive,
      viewRef,
      slotSize: { ...this._slotSize },
    };
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

  private _insertDraggable(d: DraggableDirective) {
    const draggableViewRef = d.templateRef.createEmbeddedView(null);
    this.gridVcr().insert(draggableViewRef);

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

  private _destroyDraggable(d: DraggableDirective) {
    const draggableViewRef = this._draggablesViewRefs.get(d.id());
    draggableViewRef?.destroy();

    this._draggablesDirectives.delete(d.id());
    this._draggablesViewRefs.delete(d.id());
  }

  /**
   * Subscribes to draggable directive event handlers and
   * stores their unsubscribers in the component's state.
   */
  private _subscribeToDraggableEvents(d: DraggableDirective) {
    const unsubscribers = [
      d.dragStart.subscribe((e) => this.onDragStart(e)),
      d.dragMove.subscribe((e) => this.onDrag(e)),
      d.drop.subscribe((e) => this.onDrop(e)),
      d.anchored.subscribe(() => this.onAnchored()),
    ];

    const unsubscribeFn = () => unsubscribers.forEach((fn) => fn.unsubscribe());

    this._draggableEventsUnsubscribers.set(d.id(), unsubscribeFn);
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
   * relative to the whole page (i.e. the coordinates of the
   * top-left and bottom-right points of each draggable in the grid)
   */
  private _calculateSpacialGrid() {
    this._spacialGrid = [];

    if (!this._draggablesViewRefs.size) {
      return;
    }

    // If the items don't have a variable height,
    // we can use a more performant way for calculating
    // the grid.
    if (!this.variableHeight()) {
      this._calculateStaticSpacialGrid();
    } else {
      this._calculateDynamicSpacialGrid();
    }
  }

  private _calculateDynamicSpacialGrid() {
    this._spacialGrid = this._getOrderedDraggables().map((d) => {
      const { x, y, width, height } =
        d.directive.element.getBoundingClientRect();
      const yWithScroll = y + this._scrollCont.scrollTop;

      return {
        id: d.id,
        viewRefIdx: d.idx,
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
