import {
  Component,
  ElementRef,
  computed,
  input,
  viewChild,
} from '@angular/core';
import { List } from 'immutable';

import { Widget } from '../widget';
import { DataItem } from '../../../data/types';
import { colorGenerator } from '../utils';
import { precisionRound } from '../../utils';
import { FormatThousandsPipe } from '../../pipes/format-thousands.pipe';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BarChartConfig = any;

const COLORS_ARRAY = ['red', 'green', 'blue', 'yellow', 'orange'];

const MAX_BAR_WIDTH = 60;
const BAR_SPACING = 15;
const BARS_TOP_PADDING = 15;
const BARS_BOTTOM_PADDING = 30;
const BARS_SIDE_PADDING = 50;
const SEPARATORS_COUNT = 4;

@Component({
  selector: 'db-bar-chart',
  standalone: true,
  imports: [FormatThousandsPipe],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.scss',
})
export class BarChartComponent
  implements Widget<BarChartConfig, List<DataItem>>
{
  svgElement = viewChild.required<ElementRef>('svgElement');
  config = input.required<BarChartConfig>();
  data = input.required<List<DataItem>>();

  BAR_SPACING = BAR_SPACING;
  BARS_TOP_PADDING = BARS_TOP_PADDING;
  BARS_BOTTOM_PADDING = BARS_BOTTOM_PADDING;
  BARS_SIDE_PADDING = BARS_SIDE_PADDING;

  private _nearestMax = computed(() => {
    const max = this.data().max((l, r) => l.value - r.value);
    if (!max) {
      return 0;
    }

    const digits = max.value.toString().length - 2;
    const precision = 10 ** digits;
    return Math.ceil(max.value / precision) * precision;
  });

  contSize = computed<{ width: number; height: number }>(() => {
    const { clientWidth, clientHeight } = this.svgElement().nativeElement;
    return {
      width: clientWidth,
      height: clientHeight,
    };
  });

  normalizedData = computed(() =>
    this.data().map((di) =>
      di.set(
        'value',
        Math.round((di.value / this._nearestMax()) * this.maxBarHeight()),
      ),
    ),
  );

  maxBarHeight = computed(
    () => this.contSize().height - BARS_TOP_PADDING - BARS_BOTTOM_PADDING,
  );

  sepStep = computed(() => this.maxBarHeight() / SEPARATORS_COUNT);

  barWidth = computed(() => {
    const s = this.data().size;
    let availableWidth = this.contSize().width - BARS_SIDE_PADDING * 2;
    availableWidth -= BAR_SPACING * (s - 1);
    const width = precisionRound(availableWidth / s, 1);
    return Math.min(width, MAX_BAR_WIDTH);
  });

  colorsArray = computed(() => {
    const arr = [...COLORS_ARRAY];
    const data = this.data();
    for (let i = arr.length; i < data.size; i++) {
      const di = data.get(i)!;
      arr.push(colorGenerator(di.value, i));
    }
    return arr;
  });

  separators = computed<number[]>(() => {
    const sep: number[] = [];
    const step = this._nearestMax() / SEPARATORS_COUNT;
    for (let i = 0; i < SEPARATORS_COUNT + 1; i++) {
      sep.push(step * (SEPARATORS_COUNT - i));
    }
    return sep;
  });
}
