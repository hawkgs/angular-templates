import { Injectable, signal } from '@angular/core';
import { List } from 'immutable';

import { DataSource, TabularDataItem } from './types';

const TRAFFIC: [string, number[]][] = [
  ['Americas', [200, 350, 120, 40, 120, 323, 670, 999]],
  ['Europe', [122, 654, 202, 754, 100, 50, 252, 399]],
  ['Asia', [542, 264, 900, 1204, 1000, 934, 950, 1110]],
];

@Injectable()
export class TrafficTable implements DataSource<List<TabularDataItem>> {
  private _init = false;
  private _data = signal<List<TabularDataItem>>(List());
  data = this._data.asReadonly();

  init() {
    if (this._init) {
      return;
    }

    this._init = true;

    setTimeout(() => {
      let table = List<TabularDataItem>();

      TRAFFIC.forEach(([continent, traffic]) => {
        table = table.push(
          new TabularDataItem({
            label: continent,
            values: List(traffic),
            unit: 'users',
          }),
        );
      });

      this._data.set(table);
    });
  }
}
