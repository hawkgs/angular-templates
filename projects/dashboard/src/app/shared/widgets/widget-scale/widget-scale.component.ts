import { Component, computed, input } from '@angular/core';
import { FormatThousandsPipe } from '../../pipes/format-thousands.pipe';

const SEPARATORS_COUNT = 4;
const LABELS_MARGIN_RIGHT = 10;

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[dbWidgetScale]',
  standalone: true,
  imports: [FormatThousandsPipe],
  templateUrl: './widget-scale.component.html',
  styleUrl: './widget-scale.component.scss',
})
export class WidgetScaleComponent {
  max = input.required<number>();
  width = input.required<number>();
  height = input.required<number>();
  x = input<number>(0);
  y = input<number>(0);

  LABELS_MARGIN_RIGHT = LABELS_MARGIN_RIGHT;

  separators = computed<number[]>(() => {
    const sep: number[] = [];
    const step = this.max() / SEPARATORS_COUNT;
    for (let i = 0; i < SEPARATORS_COUNT + 1; i++) {
      sep.push(step * (SEPARATORS_COUNT - i));
    }
    return sep;
  });

  scaleStep = computed(() => this.height() / SEPARATORS_COUNT);
}
