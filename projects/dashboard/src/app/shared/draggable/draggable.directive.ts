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

    if (this._active) {
      // Styles should be applied upon drag start
      this._applyDraggableStyles();
    }
  }

  ngOnInit(): void {
    this._zone.runOutsideAngular(() => {
      this._listeners = [
        this._renderer.listen(
          this._elRef.nativeElement,
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

    const { x, y } = this._elRef.nativeElement.getBoundingClientRect();

    if (!this._initPos) {
      this._initPos = { x, y };
    }
    this._relativeMousePos = {
      x: e.clientX - x,
      y: e.clientY - y,
    };
  }

  private _onDragMove(e: MouseEvent) {
    if (!this._dragging) {
      return;
    }
    this._move({ x: e.clientX, y: e.clientY });
  }

  private _onDragEnd() {
    this._dragging = false;
  }

  private _applyDraggableStyles() {
    this._renderer.setStyle(this._elRef.nativeElement, 'position', 'absolute');
  }

  private _move(coor: Coor) {
    const ip = this._initPos!;
    const rmp = this._relativeMousePos;
    const offset = { x: ip.x + rmp.x, y: ip.y + rmp.y };
    const translateStr = `translate(${coor.x - offset.x}px, ${coor.y - offset.y}px)`;

    this._renderer.setStyle(
      this._elRef.nativeElement,
      'transform',
      translateStr,
    );
  }
}
