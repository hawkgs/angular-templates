import {
  Component,
  ElementRef,
  computed,
  input,
  viewChild,
} from '@angular/core';
import { List } from 'immutable';

import { Widget } from '../widget';
import { DataItem, TabularData } from '../../../data/types';
import { WidgetTooltipDirective } from '../widget-tooltip/widget-tooltip.directive';
import { WidgetScaleComponent } from '../widget-scale/widget-scale.component';
import { generateColorsArray, getNearestMax } from '../utils';
import { PathDefinitionPipe } from './path-definition.pipe';
import { precisionRound } from '../../utils';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { ChartLabelPipe } from '../../pipes/chart-label.pipe';

export type LineChartConfig = void;

const MIN_DATA_POINT_SPACING = 15;
const CHART_TOP_PADDING = 15;
const CHART_BOTTOM_PADDING = 60;
const CHART_LEFT_PADDING = 50;
const CHART_RIGHT_PADDING = 30;
const MIN_HOR_SCALE_SPACING_IN_PX = 40;

// NOTE(Georgi): WIP
@Component({
  selector: 'db-line-chart',
  standalone: true,
  imports: [
    WidgetTooltipDirective,
    WidgetScaleComponent,
    PathDefinitionPipe,
    TranslatePipe,
    ChartLabelPipe,
  ],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss',
})
export class LineChartComponent
  implements Widget<LineChartConfig, TabularData>
{
  svgElement = viewChild.required<ElementRef>('svgElement');
  data = input.required<TabularData>();
  config = input<LineChartConfig>();

  CHART_TOP_PADDING = CHART_TOP_PADDING;
  CHART_LEFT_PADDING = CHART_LEFT_PADDING;
  CHART_RIGHT_PADDING = CHART_RIGHT_PADDING;

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
    const sorted = this.data().rows.map((ti) =>
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
    return this.data().rows.map((ti) =>
      ti.set(
        'values',
        ti.values.map((v) => precisionRound(v / max, 2) * this.chartHeight()),
      ),
    );
  });

  groupedData = computed(() => {
    let list = List<List<DataItem>>([]);

    for (let i = 0; i < this.data().colLabels.size; i++) {
      let group = List<DataItem>();

      this.data().rows.forEach((ti) => {
        const value = ti.values.get(i);

        if (value !== undefined) {
          group = group.push(
            new DataItem({
              label: ti.label,
              unit: this.data().unit,
              value,
            }),
          );
        }
      });

      list = list.push(group);
    }

    return list;
  });

  dataPointSpacing = computed(() => {
    const cols = this.data().colLabels.size;
    const spacing = this.chartWidth() / (cols - 1);

    return Math.max(spacing, MIN_DATA_POINT_SPACING);
  });

  contentWidth = computed(() => {
    const contentWidth =
      this.dataPointSpacing() * (this.data().colLabels.size - 1) +
      CHART_LEFT_PADDING +
      CHART_RIGHT_PADDING;
    const containerWidth = this._contSize().width;

    return Math.max(contentWidth, containerWidth);
  });

  horizontalScaleItemSpacing = computed(() => {
    const cols = this.data().colLabels.size;
    const width = this.contentWidth();
    const spacing = width / cols;

    if (spacing >= MIN_HOR_SCALE_SPACING_IN_PX) {
      return 1;
    }

    return Math.round(MIN_HOR_SCALE_SPACING_IN_PX / spacing);
  });

  horizontalScaleLabels = computed(() => {
    const spacing = this.horizontalScaleItemSpacing();

    if (spacing === 1) {
      return this.data().colLabels;
    }
    return this.data().colLabels.filter((_, i) => i % spacing === 0);
  });

  horScaleSpacing = computed(
    () => this.dataPointSpacing() * this.horizontalScaleItemSpacing(),
  );

  colorsArray = computed(() =>
    generateColorsArray(this.data().rows.map((ti) => ti.values.first() || 0)),
  );
}
