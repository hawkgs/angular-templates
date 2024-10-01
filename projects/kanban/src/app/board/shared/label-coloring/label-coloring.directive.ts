import {
  Directive,
  ElementRef,
  inject,
  input,
  OnInit,
  Renderer2,
} from '@angular/core';
import { Label } from '../../../../models';
import { LABEL_COLORS } from './label-colors';

const GREY_900 = '#151417';
const GREY_50 = '#fbfbfb';

@Directive({
  selector: '[kbLabelColoring]',
  standalone: true,
})
export class LabelColoringDirective implements OnInit {
  private _elRef = inject(ElementRef);
  private _renderer = inject(Renderer2);
  label = input.required<Label>({ alias: 'kbLabelColoring' });

  constructor({ nativeElement }: ElementRef, renderer: Renderer2) {
    renderer.setStyle(nativeElement, 'background-color', LABEL_COLORS);
  }

  ngOnInit() {
    const el = this._elRef.nativeElement;
    const color = LABEL_COLORS.get(this.label().color);
    const text = color?.light ? GREY_900 : GREY_50;

    this._renderer.setStyle(el, 'background-color', color?.hex);
    this._renderer.setStyle(el, 'color', text);
  }
}
