import { Injectable, signal } from '@angular/core';
import { DataItem, DataSource } from './types';

@Injectable()
export class RandNumsList implements DataSource<DataItem> {
  private _init = false;
  private _data = signal<DataItem>(
    new DataItem({
      unit: 'm/s',
      value: Math.round(Math.random() * 100),
      label: 'Speed',
    }),
  );
  data = this._data.asReadonly();

  init() {
    if (this._init) {
      return;
    }

    this._init = true;

    const interval = Math.round(Math.max(1500, Math.random() * 10000));
    setInterval(() => {
      this._data.update((item) => item.set('value', item.value + 1));
    }, interval);
  }
}
