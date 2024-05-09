import { DOCUMENT } from '@angular/common';
import {
  Directive,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  Renderer2,
  inject,
  input,
  output,
} from '@angular/core';

export type Coor = { x: number; y: number };

const RAPPEL_ANIM_DURR = 300;
const DRAG_ACTIVE_AFTER = 200;

@Directive({
  selector: '[dbDraggable]',
  standalone: true,
})
export class DraggableDirective implements OnInit, OnDestroy {
  private _doc = inject(DOCUMENT);
  private _zone = inject(NgZone);
  private _renderer = inject(Renderer2);
  private _elRef = inject(ElementRef);

  private _listeners: (() => void)[] = [];
  private _dragging = false;
  private _elMidpoint: Coor | null = null;
  private _relativeMousePos: Coor = { x: 0, y: 0 };
  private _dragActivatorTimeout?: ReturnType<typeof setTimeout>;

  dragDisabled = input<boolean>();
  dragAnchor = input.required<Coor>();
  dragId = input<string>('');

  dragStart = output<{ elContPos: Coor; id: string }>();
  drag = output<{ pos: Coor; id: string }>();
  anchored = output<void>();

  private get _el(): HTMLElement {
    return this._elRef.nativeElement;
  }

  ngOnInit(): void {
    this._zone.runOutsideAngular(() => {
      this._listeners = [
        this._renderer.listen(
          this._el,
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

  ngOnDestroy(): void {
    this._listeners.forEach((cb) => cb());
  }

  private _onDragStart(e: MouseEvent) {
    if (this.dragDisabled()) {
      return;
    }

    this._dragActivatorTimeout = setTimeout(() => {
      this._dragging = true;

      const { x, y, width, height } = this._el.getBoundingClientRect();
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
        id: this.dragId(),
      });
    }, DRAG_ACTIVE_AFTER);
  }

  private _onDragMove(e: MouseEvent) {
    if (!this._dragging) {
      return;
    }

    const offset = this._relativeMousePos;
    const pos = {
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    };

    this._move(pos);

    this.drag.emit({
      pos: {
        x: pos.x + this._elMidpoint!.x,
        y: pos.y + this._elMidpoint!.y,
      },
      id: this.dragId(),
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
    });
    this._move(initPos);
  }

  private _move(coor: Coor) {
    const translate = `translate(${coor.x}px, ${coor.y}px)`;

    this._renderer.setStyle(this._el, 'transform', translate);
  }

  private _moveToAnchorPos() {
    this._renderer.setStyle(
      this._el,
      'transition',
      `transform ${RAPPEL_ANIM_DURR}ms ease`,
    );

    this._move(this.dragAnchor());

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
      ]);
      this.anchored.emit();
    }, RAPPEL_ANIM_DURR);
  }

  private _setStyles(stylesObj: { [key: string]: string }) {
    for (const cssProp in stylesObj) {
      const value = stylesObj[cssProp];
      this._renderer.setStyle(this._el, cssProp, value);
    }
  }

  private _removeStyles(cssProps: string[]) {
    cssProps.forEach((p) => this._renderer.removeStyle(this._el, p));
  }
}
