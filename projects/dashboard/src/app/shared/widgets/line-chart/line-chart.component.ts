import {
  Component,
  ElementRef,
  computed,
  input,
  viewChild,
} from '@angular/core';
import { List } from 'immutable';

import { Widget } from '../widget';
import { TabularDataItem } from '../../../data/types';
import { WidgetTooltipDirective } from '../widget-tooltip/widget-tooltip.directive';
import { WidgetScaleComponent } from '../widget-scale/widget-scale.component';
import { generateColorsArray, getNearestMax } from '../utils';
import { PathDefinitionPipe } from './path-definition.pipe';
import { precisionRound } from '../../utils';
import { TranslatePipe } from '../translate.pipe';

export type LineChartConfig = void;

const MIN_DATA_POINT_SPACING = 15;
const CHART_TOP_PADDING = 15;
const CHART_BOTTOM_PADDING = 60;
const CHART_LEFT_PADDING = 50;
const CHART_RIGHT_PADDING = 30;

// NOTE(Georgi): WIP
@Component({
  selector: 'db-line-chart',
  standalone: true,
  imports: [
    WidgetTooltipDirective,
    WidgetScaleComponent,
    PathDefinitionPipe,
    TranslatePipe,
  ],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss',
})
export class LineChartComponent
  implements Widget<LineChartConfig, List<TabularDataItem>>
{
  svgElement = viewChild.required<ElementRef>('svgElement');
  data = input.required<List<TabularDataItem>>();
  config = input<LineChartConfig>();

  CHART_TOP_PADDING = CHART_TOP_PADDING;
  CHART_LEFT_PADDING = CHART_LEFT_PADDING;

  /**
   * Container size.
   */
  private _contSize = computed<{ width: number; height: number }>(() => {
    const { clientWidth, clientHeight } = this.svgElement().nativeElement;
    return {
      width: clientWidth,
      height: clientHeight,
    };
  });

  nearestMax = computed(() => {
    const sorted = this.data().map((ti) =>
      ti.set(
        'values',
        ti.values.sort((a, b) => b - a),
      ),
    );
    const max = sorted.max(
      (a, b) => (a.values.first() || 0) - (b.values.first() || 0),
    );
    if (!max) {
      return 0;
    }

    return getNearestMax(max.values.first());
  });

  chartWidth = computed(
    () => this._contSize().width - CHART_LEFT_PADDING - CHART_RIGHT_PADDING,
  );

  chartHeight = computed(
    () => this._contSize().height - CHART_TOP_PADDING - CHART_BOTTOM_PADDING,
  );

  normalizedData = computed(() => {
    const max = this.nearestMax();
    return this.data().map((ti) =>
      ti.set(
        'values',
        ti.values.map((v) => precisionRound(v / max, 2) * this.chartHeight()),
      ),
    );
  });

  longestList = computed(
    () =>
      this.data().max((a, b) => a.values.size - b.values.size) ||
      new TabularDataItem({}),
  );

  dataPointSpacing = computed(() => {
    const longestList = this.longestList().values.size || 2;
    const spacing = this.chartWidth() / (longestList - 1);

    return Math.max(spacing, MIN_DATA_POINT_SPACING);
  });

  colorsArray = computed(() =>
    generateColorsArray(this.data().map((ti) => ti.values.first() || 0)),
  );
}
