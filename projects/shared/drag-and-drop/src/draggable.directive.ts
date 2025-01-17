import { DOCUMENT } from '@angular/common';
import {
  Directive,
  NgZone,
  OnDestroy,
  OnInit,
  Renderer2,
  TemplateRef,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { WINDOW, provideWindow } from '@ngx-templates/shared/services';
import { DROP_GRID } from './drop-grid.component';
import { Coor, Rect } from './types';
import { getClientPointerPos } from './utils';

// The duration of the rappel animation after the
// user has released the draggable element.
const RAPPEL_ANIM_DURR = 300;

// Allow for some leeway clicking the draggable element.
// The drag functionality will be activated after the specified
// time, if the user is still holding the element.
const DRAG_ACTIVE_AFTER = 200;
const DRAG_ACTIVE_AFTER_TOUCH = 1000;

// The level of the opacity while the target is being dragged.
const DRAG_OPACITY = 0.8;

/**
 * Adds draggable behavior to an element. Should be used as
 * a structural directive  along with `ngx-drop-grid`.
 */
@Directive({
  selector: '[ngxDraggable]',
  providers: [provideWindow()],
})
export class DraggableDirective implements OnInit, OnDestroy {
  templateRef = inject(TemplateRef);
  private _doc = inject(DOCUMENT);
  private _win = inject(WINDOW);
  private _zone = inject(NgZone);
  private _renderer = inject(Renderer2);
  private _grid = inject(DROP_GRID, { optional: true });

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
   * Zero-based position or order of the draggable element in the `ngx-drop-grid`.
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
   * INTERNAL USE ONLY. Emitted when the drag starts.
   *
   * - `elContPos` represents the relative to the viewport top-left
   * coordinates of the draggable target
   * - `id` is the ID of the draggable
   */
  _dragStart = output<{ elContPos: Coor; rect: Rect; id: string }>();

  /**
   * INTERNAL USE ONLY. Emitted on drag move.
   *
   * - `pos` represents the relative to the viewport mid/center coordinates
   * of the draggable target
   * - `rect` represents the coordinates of the bounding rectangle of the
   * draggable target
   * - `id` is the ID of the draggable
   */
  _dragMove = output<{ pos: Coor; rect: Rect; id: string }>();

  /**
   * INTERNAL USE ONLY. Emitted when the draggable is dropped.
   */
  _drop = output<{ id: string }>();

  /**
   * INTERNAL USE ONLY. Emitted when the drop animation is completed,
   * i.e. the target is now anchored
   */
  _anchored = output<void>();

  /**
   * Native element of the draggable target.
   */
  set element(v: Element) {
    this._element = v;
    this._setStyles({ 'grid-column': 'span ' + this._renderedSize() });
  }

  get element() {
    return this._element;
  }

  private _renderedSize = computed(() =>
    Math.min(this.elementSize(), this.gridColumns()),
  );

  constructor() {
    effect(() => {
      this._setStyles({ 'grid-column': 'span ' + this._renderedSize() });
    });
  }

  ngOnInit() {
    if (this._grid) {
      this._grid.insertDraggable(this);
    }
  }

  ngOnDestroy() {
    for (const cb of this._listeners) {
      cb();
    }

    if (this._grid) {
      this._grid.destroyDraggable(this);
    }
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
        this._renderer.listen(this._doc, 'touchend', dragEnd),
      ];

      // Since we need to prevent panning on a mobile device
      // while dragging but the default behavior of Renderer2.listen
      // is to optimize `touchmove` event listeners by making them passive,
      // we have to use the native API instead. This, obviously,
      // presents a performance hit given that the listener is active
      // but, if we prevent the default behavior on `touchstart`,
      // we will block all subsequent click events originating from
      // the draggable.
      const listener = (e: Event) => {
        e.preventDefault();
        dragMove(e as TouchEvent);
      };
      this._element.addEventListener('touchmove', listener);
      this._listeners.push(() =>
        this._element.removeEventListener('touchmove', listener),
      );
    });
  }

  private _onDragStart(e: MouseEvent | TouchEvent) {
    if (this.disabled()) {
      return;
    }

    this._firefoxUserSelectMouseEventsPatch();

    const activationDelay = !this._hasTouchSupport()
      ? DRAG_ACTIVE_AFTER
      : DRAG_ACTIVE_AFTER_TOUCH;

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

      this._dragStart.emit({
        id: this.id(),
        elContPos: pos,
        rect: {
          p1: pos,
          p2: {
            x: x + width,
            y: y + height,
          },
        },
      });
    }, activationDelay);
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

    this._dragMove.emit({
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
      this._drop.emit({ id: this.id() });
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
      'touch-action': 'none',
      'z-index': '99999999',
    });

    // Doc styles
    this._renderer.setStyle(this._doc.body, 'user-select', 'none');
    this._renderer.setStyle(this._doc.body, '-webkit-user-select', 'none');

    this._move(initPos);
  }

  private _removeDraggableStyles() {
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
      'touch-action',
      'user-select',
      'z-index',
    ]);

    // Doc styles
    this._renderer.removeStyle(this._doc.body, 'user-select');
    this._renderer.removeStyle(this._doc.body, '-webkit-user-select');
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
      this._anchored.emit();
      return;
    }

    this._renderer.setStyle(
      this._element,
      'transition',
      `transform ${RAPPEL_ANIM_DURR}ms ease`,
    );

    this._move(anchor);

    setTimeout(() => {
      this._removeDraggableStyles();
      this._anchored.emit();
    }, RAPPEL_ANIM_DURR);
  }

  /** Set styles to the target element */
  private _setStyles(stylesObj: { [key: string]: string }) {
    for (const cssProp in stylesObj) {
      const value = stylesObj[cssProp];
      this._renderer.setStyle(this._element, cssProp, value);
    }
  }

  /** Remove styles from the target element */
  private _removeStyles(cssProps: string[]) {
    for (const p of cssProps) {
      this._renderer.removeStyle(this._element, p);
    }
  }

  private _hasTouchSupport() {
    return (
      'ontouchstart' in this._win || this._win.navigator.maxTouchPoints > 0
    );
  }

  /**
   * This is a patch for an undetermined issue occurring only in Firefox.
   * If the draggable contains any sort of selectable text that is selected
   * prior to the activation of the drag functionality (timeout execution),
   * dragging the draggable across grids outside of the current host grid
   * (e.g. in a group setting) won't trigger any of their mouse events that
   * are crucial for performing a successful draggable transfer. This, in
   * effect, breaks the groups functionality. Unfortunately, the only viable
   * option at this stage is to disable text selection for the target element
   * prior to the drag functionality activation since programatically clearing
   * the text selection doesn't render positive results, nor disabling the
   * selection after activation as intended; therefore, draggable elements in
   * a group, in Firefox doesn't support text selection for now.
   */
  private _firefoxUserSelectMouseEventsPatch() {
    const userAgent = this._win.navigator.userAgent.toLowerCase();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (userAgent.includes('firefox') && !!(this._grid as any)._group) {
      this._setStyles({ 'user-select': 'none' });
    }
  }
}
