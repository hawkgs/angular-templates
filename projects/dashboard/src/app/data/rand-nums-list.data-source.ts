import { Injectable, signal } from '@angular/core';
import { DataItem, DataSource } from './types';

@Injectable()
export class RandNumsList implements DataSource<DataItem> {
  private _init = false;
  private _data = signal<DataItem>(
    new DataItem({
      unit: 'm/s',
      value: Math.round(Math.random() * 1000000),
      label: 'Speed',
    }),
  );
  data = this._data.asReadonly();

  init() {
    if (this._init) {
      return;
    }

    this._init = true;

    const interval = Math.round(Math.max(2000, Math.random() * 2000));
    setInterval(() => {
      let change = Math.random() > 0.5 ? 1 : -1;
      change = Math.random() < 0.5 ? change : 0;

      const d = this._data();
      const newData = new DataItem({
        label: d.label,
        unit: d.unit,
        value: d.value + change,
      });

      this._data.set(newData);
    }, interval);
  }
}
