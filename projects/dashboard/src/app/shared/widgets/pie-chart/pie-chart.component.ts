import {
  Component,
  ElementRef,
  computed,
  input,
  viewChild,
} from '@angular/core';
import { Widget } from '../widget';
import { DataItem } from '../../../data/types';
import { List } from 'immutable';
import { generateColorsArray } from '../utils';
import { SectorPathDefinitionPipe } from './sector-path-definition.pipe';
import { WidgetTooltipDirective } from '../widget-tooltip/widget-tooltip.directive';

export type PieChartConfig = void;

const PIE_CHART_RADIUS = 0.6; // In percent

@Component({
  selector: 'db-pie-chart',
  standalone: true,
  imports: [SectorPathDefinitionPipe, WidgetTooltipDirective],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.scss',
})
export class PieChartComponent
  implements Widget<PieChartConfig, List<DataItem>>
{
  svgElement = viewChild.required<ElementRef>('svgElement');
  data = input.required<List<DataItem>>();
  config = input<PieChartConfig>();

  PIE_CHART_RADIUS = PIE_CHART_RADIUS;

  private _totalAmount = computed(() =>
    this.data()
      .map((di) => di.value)
      .reduce((a, b) => a + b, 0),
  );

  normalizedData = computed(() =>
    this.data().map((di) => di.set('value', di.value / this._totalAmount())),
  );

  accum = computed(() =>
    this.normalizedData()
      .map((di) => di.value)
      .reduce((a, b) => a + b, 0),
  );

  center = computed(() => {
    const { clientWidth, clientHeight } = this.svgElement().nativeElement;

    return {
      x: clientWidth / 2,
      y: clientHeight / 2,
    };
  });

  colorsArray = computed(() =>
    generateColorsArray(this.data().map((di) => di.value)),
  );
}
