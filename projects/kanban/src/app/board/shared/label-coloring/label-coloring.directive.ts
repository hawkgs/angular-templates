import { Directive, effect, ElementRef, input, Renderer2 } from '@angular/core';
import { Label } from '../../../../models';
import { LABEL_COLORS } from './label-colors';

const GREY_900 = '#151417';
const GREY_50 = '#fbfbfb';

@Directive({
  selector: '[kbLabelColoring]',
  standalone: true,
})
export class LabelColoringDirective {
  label = input.required<Label>({ alias: 'kbLabelColoring' });

  constructor({ nativeElement }: ElementRef, renderer: Renderer2) {
    effect(() => {
      const el = nativeElement;
      const color = LABEL_COLORS.get(this.label().color);
      const text = color?.light ? GREY_900 : GREY_50;

      renderer.setStyle(el, 'background-color', color?.hex);
      renderer.setStyle(el, 'color', text);
      renderer.setStyle(el, 'user-select', 'none');
    });
  }
}
