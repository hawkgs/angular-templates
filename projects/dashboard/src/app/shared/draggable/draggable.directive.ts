import { DOCUMENT } from '@angular/common';
import {
  Directive,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Renderer2,
  inject,
} from '@angular/core';

type Coor = { x: number; y: number };

const RAPPEL_ANIM_DURR = 300;

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
  private _active = false;
  private _initPos: Coor | null = null;
  private _relativeMousePos: Coor = { x: 0, y: 0 };

  @Input('dbDraggable')
  set active(v: boolean) {
    this._active = v;
  }

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
    if (!this._active) {
      return;
    }

    this._dragging = true;

    const { x, y } = this._el.getBoundingClientRect();

    this._initPos = { x, y };
    this._relativeMousePos = {
      x: e.clientX - x,
      y: e.clientY - y,
    };
    this._applyDraggableStyles(this._initPos);
  }

  private _onDragMove(e: MouseEvent) {
    if (!this._dragging) {
      return;
    }
    this._move({ x: e.clientX, y: e.clientY });
  }

  private _onDragEnd() {
    if (this._dragging) {
      this._moveToAnchorPos();
      this._dragging = false;
    }
  }

  private _applyDraggableStyles(initPos: Coor) {
    this._setStyles({
      position: 'absolute',
      top: '0',
      left: '0',
      opacity: '0.6',
    });
    this._move(initPos, false);
  }

  private _move(coor: Coor, factorInMouse: boolean = true) {
    const offset = factorInMouse ? this._relativeMousePos : { x: 0, y: 0 };
    const translate = `translate(${coor.x - offset.x}px, ${coor.y - offset.y}px)`;

    this._renderer.setStyle(this._el, 'transform', translate);
  }

  private _moveToAnchorPos() {
    this._renderer.setStyle(
      this._el,
      'transition',
      `transform ${RAPPEL_ANIM_DURR}ms ease`,
    );

    this._move(this._initPos!, false);

    setTimeout(() => {
      this._removeStyles([
        'transition',
        'position',
        'top',
        'left',
        'opacity',
        'transform',
      ]);
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
