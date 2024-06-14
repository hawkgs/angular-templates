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
import { ChartLabelPipe } from '../../pipes/chart-label.pipe';
import { WidgetTooltipDirective } from '../widget-tooltip/widget-tooltip.directive';
import { WidgetScaleComponent } from '../widget-scale/widget-scale.component';

export type BarChartConfig = void;

// Predefined colors for the bars
const COLORS_ARRAY = [
  'rgb(255, 104, 107)', // Red
  'rgb(162, 215, 41)', // Green
  'rgb(60, 145, 230)', // Blue
  'rgb(255, 190, 11)', // Amber
  'rgb(125, 91, 166)', // Purple
];

// UI elements paddings and margins

const MAX_BAR_WIDTH = 50;
const MIN_BAR_WIDTH = 30;
const BAR_SPACING = 15;

const BARS_TOP_PADDING = 15;
const BARS_BOTTOM_PADDING = 30;
const BARS_LEFT_PADDING = 65;
const BARS_RIGHT_PADDING = 30;

const LABELS_MARGIN_TOP = 20;
const SCALE_SIDE_PADDING = 10; // Relative to the bars

@Component({
  selector: 'db-bar-chart',
  standalone: true,
  imports: [
    FormatThousandsPipe,
    ChartLabelPipe,
    WidgetTooltipDirective,
    WidgetScaleComponent,
  ],
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
  BARS_LEFT_PADDING = BARS_LEFT_PADDING;
  BARS_RIGHT_PADDING = BARS_RIGHT_PADDING;

  LABELS_MARGIN_TOP = LABELS_MARGIN_TOP;
  SCALE_SIDE_PADDING = SCALE_SIDE_PADDING;

  nearestMax = computed(() => {
    const max = this.data().max((l, r) => l.value - r.value);
    if (!max) {
      return 0;
    }

    const digits = max.value.toString().length - 2;
    const precision = 10 ** digits;
    return Math.ceil(max.value / precision) * precision;
  });

  /**
   * Container size.
   */
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
        Math.round((di.value / this.nearestMax()) * this.maxBarHeight()),
      ),
    ),
  );

  maxBarHeight = computed(
    () => this.contSize().height - BARS_TOP_PADDING - BARS_BOTTOM_PADDING,
  );

  /**
   * Calculates the bar width based on the container size
   * and the number of data entries.
   */
  barWidth = computed(() => {
    const s = this.data().size;
    let availableWidth =
      this.contSize().width - (BARS_LEFT_PADDING + BARS_RIGHT_PADDING);
    availableWidth -= BAR_SPACING * (s - 1);
    const width = precisionRound(availableWidth / s, 1);

    return Math.max(Math.min(width, MAX_BAR_WIDTH), MIN_BAR_WIDTH);
  });

  // Returns the greater of content or container width.
  // We need to set the SVG element width to it in case the content
  // is wider than the container or the window is resized after
  // rendering.
  contentWidth = computed(() => {
    const contentWidth =
      (this.barWidth() + BAR_SPACING) * this.data().size +
      BARS_LEFT_PADDING +
      BARS_RIGHT_PADDING;
    const containerWidth = this.contSize().width;

    return Math.max(contentWidth, containerWidth);
  });

  /**
   * Returns an array with colors for all bars.
   * If the predefined array is overflowed, the rest
   * of the data item bars will use a generated color.
   */
  colorsArray = computed(() => {
    const colors = [...COLORS_ARRAY];
    const data = this.data();
    for (let i = colors.length; i < data.size; i++) {
      const di = data.get(i)!;
      colors.push(colorGenerator(di.value, i));
    }
    return colors;
  });
}
