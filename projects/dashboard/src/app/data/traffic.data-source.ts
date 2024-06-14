import { Injectable, signal } from '@angular/core';
import { DataSource, TabularDataItem } from './types';
import { List } from 'immutable';

const TRAFFIC: [string, number[]][] = [
  ['Americas', [200, 350, 120, 40]],
  ['Europe', [122, 654, 114, 754]],
  ['Asia', [542, 264, 777, 999]],
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
