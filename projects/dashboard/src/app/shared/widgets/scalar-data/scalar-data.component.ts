import { Component, input } from '@angular/core';
import { Widget } from '../widget';
import { DataItem } from '../../../data/types';

export type ScalarDataConfig = void;

@Component({
  selector: 'db-scalar-data',
  standalone: true,
  imports: [],
  templateUrl: './scalar-data.component.html',
  styleUrl: './scalar-data.component.scss',
})
export class ScalarDataComponent implements Widget<ScalarDataConfig, DataItem> {
  data = input.required<DataItem>();
  config = input<ScalarDataConfig>();
}
