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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BarChartConfig = any;

const COLOR_ARRAY = ['red', 'green', 'blue', 'yellow', 'orange'];

const MAX_BAR_WIDTH = 50000;
const BAR_SPACING = 15;
const BARS_TOP_PADDING = 15;
const BARS_BOTTOM_PADDING = 30;
const BARS_SIDE_PADDING = 50;

@Component({
  selector: 'db-bar-chart',
  standalone: true,
  imports: [],
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
  BARS_SIDE_PADDING = BARS_SIDE_PADDING;

  contSize = computed<{ width: number; height: number }>(() => {
    const { clientWidth, clientHeight } = this.svgElement().nativeElement;
    return {
      width: clientWidth,
      height: clientHeight,
    };
  });

  normalizedData = computed(() => {
    const max = this.data().max((l, r) => l.value - r.value) as DataItem;
    return this.data().map((di) =>
      di.set('value', Math.round((di.value / max.value) * this.maxBarHeight())),
    );
  });

  maxBarHeight = computed(
    () => this.contSize().height - BARS_TOP_PADDING - BARS_BOTTOM_PADDING,
  );

  barWidth = computed(() => {
    const s = this.data().size;
    let availableWidth = this.contSize().width - BARS_SIDE_PADDING * 2;
    availableWidth -= BAR_SPACING * (s - 1);
    const width = precisionRound(availableWidth / s, 1);
    return Math.min(width, MAX_BAR_WIDTH);
  });

  colorArray = computed(() => {
    const arr = [...COLOR_ARRAY];
    const data = this.data();
    for (let i = arr.length; i < data.size; i++) {
      const di = data.get(i)!;
      arr.push(colorGenerator(di.value, i));
    }
    return arr;
  });
}
