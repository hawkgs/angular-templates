import { DOCUMENT } from '@angular/common';
import {
  Directive,
  NgZone,
  OnDestroy,
  Renderer2,
  TemplateRef,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { WINDOW, windowProvider } from '@ngx-templates/shared/services';

export type Coor = { x: number; y: number };
export type Rect = { p1: Coor; p2: Coor };

// The duration of the rappel animation after the
// user has released the draggable element.
const RAPPEL_ANIM_DURR = 300;

// Allow for some leeway clicking the draggable element.
// The drag functionality will be activated after the specified
// time, if the user is still holding the element.
const DRAG_ACTIVE_AFTER = 200;

// The level of the opacity while the target is being dragged.
const DRAG_OPACITY = 0.8;

// Returns the coordinates of the mouse/finger
// based on the event type.
const getClientPointerPos = (e: MouseEvent | TouchEvent): Coor => {
  if (e instanceof MouseEvent) {
    return { x: e.clientX, y: e.clientY };
  }
  return {
    x: e.touches[0].clientX,
    y: e.touches[0].clientY,
  };
};

/**
 * Adds draggable behavior to an element. Should be used as
 * a structural directive  along with `ngx-drop-grid`.
 */
@Directive({
  selector: '[ngxDraggable]',
  providers: [windowProvider],
  standalone: true,
})
export class DraggableDirective implements OnDestroy {
  templateRef = inject(TemplateRef);
  private _doc = inject(DOCUMENT);
  private _win = inject(WINDOW);
  private _zone = inject(NgZone);
  private _renderer = inject(Renderer2);

  private _listeners: (() => void)[] = [];
  private _dragging = false;
  private _elMidpoint: Coor | null = null;
  private _relativeMousePos: Coor = { x: 0, y: 0 };
  private _dragActivatorTimeout?: ReturnType<typeof setTimeout>;
  private _element!: Element;

  /**
   * ID of the draggable element. Default: `'0'`
   */
  id = input<string>('0', { alias: 'ngxDraggable' });

  /**
   * Represents the draggable size in the `ngx-drop-grid`.
   * Shouldn't exceed the number of grid columns. Default: `1`
   */
  elementSize = input<number>(1, { alias: 'ngxDraggableSize' });

  /**
   * Position or order of the draggable element in the `ngx-drop-grid`.
   * Not dynamic.
   */
  position = input<number>(0, { alias: 'ngxDraggablePosition' });

  /**
   * The columns number in the `ngx-drop-grid`
   */
  gridColumns = input<number>(1, { alias: 'ngxDraggableCols' });

  /**
   * Disables the drag functionality.
   */
  disabled = signal<boolean>(false);

  /**
   * The position where the draggable will be placed when dropped.
   */
  anchor = signal<Coor | null>(null);

  /**
   * Emitted when the drag is started.
   *
   * - `elContPos` represents the relative to the viewport top-left
   * coordinates of the draggable target
   * - `id` is the ID of the draggable
   */
  dragStart = output<{ elContPos: Coor; id: string }>();

  /**
   * Emitted on drag move.
   *
   * - `pos` represents the relative to the viewport mid/center coordinates
   * of the draggable target
   * - `rect` represents the coordinates of the bounding rectangle of the
   * draggable target
   * - `id` is the ID of the draggable
   */
  dragMove = output<{ pos: Coor; rect: Rect; id: string }>();

  /**
   * Emitted when the draggable is dropped.
   */
  drop = output<{ id: string }>();

  /**
   * Emitted when the drop animation is completed (i.e. the target is now anchored)
   */
  anchored = output<void>();

  /**
   * Native element of the draggable target.
   */
  set element(v: Element) {
    this._element = v;
    this._setStyles({ 'grid-column': 'span ' + this._renderedSize() });
  }

  private _renderedSize = computed(() =>
    Math.min(this.elementSize(), this.gridColumns()),
  );

  constructor() {
    effect(() => {
      this._setStyles({ 'grid-column': 'span ' + this._renderedSize() });
    });
  }

  ngOnDestroy() {
    this._listeners.forEach((cb) => cb());
  }

  /**
   * Initialize all draggable events.
   *
   * Note: Has to be called manually after the `element` has been defined.
   */
  initEvents() {
    if (!this._element) {
      throw new Error('DraggableDirective: Missing element');
    }

    this._zone.runOutsideAngular(() => {
      const dragStart = this._onDragStart.bind(this);
      const dragMove = this._onDragMove.bind(this);
      const dragEnd = this._onDragEnd.bind(this);

      this._listeners = [
        this._renderer.listen(this._element, 'mousedown', dragStart),
        this._renderer.listen(this._doc, 'mousemove', dragMove),
        this._renderer.listen(this._doc, 'mouseup', dragEnd),

        this._renderer.listen(this._element, 'touchstart', dragStart),
        this._renderer.listen(this._doc, 'touchmove', dragMove),
        this._renderer.listen(this._doc, 'touchend', dragEnd),
      ];
    });
  }

  private _onDragStart(e: MouseEvent | TouchEvent) {
    if (this.disabled()) {
      return;
    }

    this._dragActivatorTimeout = setTimeout(() => {
      this._dragging = true;

      const { x, y, width, height } = this._element.getBoundingClientRect();
      const pos = { x, y };
      const client = getClientPointerPos(e);

      this._relativeMousePos = {
        x: client.x - x,
        y: client.y - y,
      };

      this._applyDraggableStyles(pos, { x: width, y: height });

      // Clear text selection, if any
      this._win.getSelection()?.removeAllRanges();

      if (!this._elMidpoint) {
        this._elMidpoint = {
          x: width / 2,
          y: height / 2,
        };
      }

      this.dragStart.emit({
        elContPos: pos,
        id: this.id(),
      });
    }, DRAG_ACTIVE_AFTER);
  }

  private _onDragMove(e: MouseEvent | TouchEvent) {
    if (!this._dragging) {
      return;
    }

    // This will disable auto-scroll. However,
    // it will also prevent the undesired text
    // selection.
    if (e instanceof MouseEvent) {
      e.preventDefault();
    }

    const client = getClientPointerPos(e);
    const offset = this._relativeMousePos;
    const pos = {
      x: client.x - offset.x,
      y: client.y - offset.y,
    };

    this._move(pos);

    this.dragMove.emit({
      pos: {
        x: pos.x + this._elMidpoint!.x,
        y: pos.y + this._elMidpoint!.y,
      },
      rect: {
        p1: pos,
        p2: {
          x: pos.x + this._elMidpoint!.x * 2,
          y: pos.y + this._elMidpoint!.y * 2,
        },
      },
      id: this.id(),
    });
  }

  private _onDragEnd() {
    if (this._dragActivatorTimeout) {
      clearTimeout(this._dragActivatorTimeout);
    }
    if (this._dragging) {
      this.drop.emit({ id: this.id() });
      this._moveToAnchorPos();
      this._dragging = false;
    }
  }

  private _applyDraggableStyles(initPos: Coor, size: Coor) {
    this._setStyles({
      position: 'fixed',
      top: '0',
      left: '0',
      opacity: DRAG_OPACITY.toString(),
      width: size.x + 'px',
      height: size.y + 'px',
      'pointer-events': 'none',
      'z-index': '99999999',
    });
    this._move(initPos);
  }

  private _move(coor: Coor) {
    const translate = `translate(${coor.x}px, ${coor.y}px)`;

    this._renderer.setStyle(this._element, 'transform', translate);
  }

  /**
   * Moves/rappels the draggable target element to its
   * new position after it was released.
   */
  private _moveToAnchorPos() {
    const anchor = this.anchor();
    if (!anchor) {
      this._removeStyles(['opacity']);
      this.anchored.emit();
      return;
    }

    this._renderer.setStyle(
      this._element,
      'transition',
      `transform ${RAPPEL_ANIM_DURR}ms ease`,
    );

    this._move(anchor);

    setTimeout(() => {
      this._removeStyles([
        'transition',
        'position',
        'top',
        'left',
        'opacity',
        'transform',
        'width',
        'height',
        'pointer-events',
        'z-index',
      ]);
      this.anchored.emit();
    }, RAPPEL_ANIM_DURR);
  }

  private _setStyles(stylesObj: { [key: string]: string }) {
    for (const cssProp in stylesObj) {
      const value = stylesObj[cssProp];
      this._renderer.setStyle(this._element, cssProp, value);
    }
  }

  private _removeStyles(cssProps: string[]) {
    cssProps.forEach((p) => this._renderer.removeStyle(this._element, p));
  }
}
