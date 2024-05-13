import { DOCUMENT } from '@angular/common';
import {
  Directive,
  NgZone,
  OnDestroy,
  Renderer2,
  TemplateRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

export type Coor = { x: number; y: number };
export type Rect = { p1: Coor; p2: Coor };

const RAPPEL_ANIM_DURR = 300;
const DRAG_ACTIVE_AFTER = 200;

@Directive({
  selector: '[dbDraggable]',
  standalone: true,
})
export class DraggableDirective implements OnDestroy {
  templateRef = inject(TemplateRef);
  private _doc = inject(DOCUMENT);
  private _zone = inject(NgZone);
  private _renderer = inject(Renderer2);

  private _listeners: (() => void)[] = [];
  private _dragging = false;
  private _elMidpoint: Coor | null = null;
  private _relativeMousePos: Coor = { x: 0, y: 0 };
  private _dragActivatorTimeout?: ReturnType<typeof setTimeout>;

  id = input<string>('0', { alias: 'dbDraggable' });
  elementSize = input<number>(1, { alias: 'dbDraggableSize' });
  position = input<number>(0, { alias: 'dbDraggablePosition' });

  element!: Element;

  disabled = signal<boolean>(false);
  anchor = signal<Coor | null>(null);

  dragStart = output<{ elContPos: Coor; id: string }>();
  dragMove = output<{ pos: Coor; rect: Rect; id: string }>();
  drop = output<void>();

  ngOnDestroy() {
    this._listeners.forEach((cb) => cb());
  }

  initEvents() {
    if (!this.element) {
      throw new Error('DraggableDirective: Missing element');
    }

    this._zone.runOutsideAngular(() => {
      this._listeners = [
        this._renderer.listen(
          this.element,
          'mousedown',
          this._onDragStart.bind(this),
        ),
        this._renderer.listen(
          this._doc,
          'mousemove',
          this._onDragMove.bind(this),
        ),
        this._renderer.listen(this._doc, 'mouseup', this._onDragEnd.bind(this)),
      ];
    });
  }

  private _onDragStart(e: MouseEvent) {
    if (this.disabled()) {
      return;
    }

    this._dragActivatorTimeout = setTimeout(() => {
      this._dragging = true;

      const { x, y, width, height } = this.element.getBoundingClientRect();
      const pos = { x, y };

      this._relativeMousePos = {
        x: e.clientX - x,
        y: e.clientY - y,
      };

      this._applyDraggableStyles(pos, { x: width, y: height });

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

  private _onDragMove(e: MouseEvent) {
    if (!this._dragging) {
      return;
    }

    // Disables auto scroll, but doesn't select text
    e.preventDefault();

    const offset = this._relativeMousePos;
    const pos = {
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
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
      this._moveToAnchorPos();
      this._dragging = false;
    }
  }

  private _applyDraggableStyles(initPos: Coor, size: Coor) {
    this._setStyles({
      position: 'fixed',
      top: '0',
      left: '0',
      opacity: '0.6',
      width: size.x + 'px',
      height: size.y + 'px',
      'pointer-events': 'none',
    });
    this._move(initPos);
  }

  private _move(coor: Coor) {
    const translate = `translate(${coor.x}px, ${coor.y}px)`;

    this._renderer.setStyle(this.element, 'transform', translate);
  }

  private _moveToAnchorPos() {
    const anchor = this.anchor();
    if (!anchor) {
      this._removeStyles(['opacity']);
      this.drop.emit();
      return;
    }

    this._renderer.setStyle(
      this.element,
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
      ]);
      this.drop.emit();
    }, RAPPEL_ANIM_DURR);
  }

  private _setStyles(stylesObj: { [key: string]: string }) {
    for (const cssProp in stylesObj) {
      const value = stylesObj[cssProp];
      this._renderer.setStyle(this.element, cssProp, value);
    }
  }

  private _removeStyles(cssProps: string[]) {
    cssProps.forEach((p) => this._renderer.removeStyle(this.element, p));
  }
}
