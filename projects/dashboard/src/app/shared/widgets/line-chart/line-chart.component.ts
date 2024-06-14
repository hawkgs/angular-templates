import { Component, input } from '@angular/core';
import { Widget } from '../widget';
import { TabularDataItem } from '../../../data/types';
import { List } from 'immutable';

export type LineChartConfig = void;

@Component({
  selector: 'db-line-chart',
  standalone: true,
  imports: [],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss',
})
export class LineChartComponent
  implements Widget<LineChartConfig, List<TabularDataItem>>
{
  data = input.required<List<TabularDataItem>>();
  config = input<LineChartConfig>();
}
