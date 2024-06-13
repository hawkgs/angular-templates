import {
  Directive,
  HostListener,
  LOCALE_ID,
  Renderer2,
  inject,
  input,
} from '@angular/core';
import { DOCUMENT, DecimalPipe } from '@angular/common';
import { DataItem } from '../../../data/types';

type Pos = { x: number; y: number };

const CURSOR_MARGIN = 15;

@Directive({
  selector: '[dbWidgetTooltip]',
  standalone: true,
})
export class WidgetTooltipDirective {
  private _doc = inject(DOCUMENT);
  private _locale = inject(LOCALE_ID);
  private _renderer = inject(Renderer2);

  private _decimalPipe = new DecimalPipe(this._locale);
  private _widget?: HTMLDivElement;

  data = input.required<DataItem>({ alias: 'dbWidgetTooltip' });

  @HostListener('mouseenter', ['$event'])
  onMouseEnter({ clientX, clientY }: MouseEvent) {
    const pos = { x: clientX, y: clientY };

    if (!this._widget) {
      this._widget = this._createWidget(pos);
    } else {
      this._positionElement(this._widget, pos);
    }

    this._doc.body.appendChild(this._widget);
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove({ clientX, clientY }: MouseEvent) {
    // Note(Georgi): Will use zoneless;
    if (this._widget) {
      this._positionElement(this._widget, { x: clientX, y: clientY });
    }
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    if (this._widget) {
      this._doc.body.removeChild(this._widget);
    }
  }

  private _createWidget(pos: Pos) {
    const widget = this._renderer.createElement('div') as HTMLDivElement;
    this._renderer.addClass(widget, 'db-widget-tooltip');
    this._positionElement(widget, pos);

    const { label, value, unit } = this.data();

    const labelEl = this._renderer.createElement('p');
    this._renderer.addClass(labelEl, 'db-widget-tooltip__label');
    labelEl.innerText = label;

    const valueEl = this._renderer.createElement('p');
    this._renderer.addClass(valueEl, 'db-widget-tooltip__value');
    valueEl.innerText = this._decimalPipe.transform(value) + ' ' + unit;

    widget.appendChild(labelEl);
    widget.appendChild(valueEl);

    console.log('Creating widget for', label);

    return widget;
  }

  private _positionElement(target: HTMLElement, pos: Pos) {
    const x = pos.x + CURSOR_MARGIN;
    const y = pos.y + CURSOR_MARGIN;

    const translate = 'translate(' + x + 'px, ' + y + 'px)';

    this._renderer.setStyle(target, 'transform', translate);
  }
}
