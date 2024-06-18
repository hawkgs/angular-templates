import { Injectable, signal } from '@angular/core';
import { List } from 'immutable';

import { DataSource, TabularData, TabularDataRow } from './types';

const TRAFFIC: [string, number[]][] = [
  ['Americas', [200, 350, 120, 40, 120, 323, 670]],
  ['Europe', [122, 654, 202, 754, 100, 50, 252]],
  ['Asia', [542, 264, 900, 1204, 1000, 934, 950]],
];

@Injectable()
export class TrafficTable implements DataSource<TabularData> {
  private _init = false;
  private _data = signal<TabularData>(new TabularData({}));
  data = this._data.asReadonly();

  init() {
    if (this._init) {
      return;
    }

    this._init = true;

    setTimeout(() => {
      let table = new TabularData({
        unit: 'users',
        colLabels: List([
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ]),
      });

      TRAFFIC.forEach(([continent, traffic]) => {
        const row = new TabularDataRow({
          label: continent,
          values: List(traffic),
        });
        table = table.set('rows', table.rows.push(row));
      });

      this._data.set(table);
    });
  }
}
