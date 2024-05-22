import { Injectable, NgZone, inject, signal } from '@angular/core';
import { DataItem, DataSource } from './types';

@Injectable()
export class RandNumsList implements DataSource<DataItem> {
  private _zone = inject(NgZone);
  private _data = signal<DataItem>(
    new DataItem({
      value: Math.round(Math.random() * 100),
    }),
  );
  data = this._data.asReadonly();

  constructor() {
    const interval = Math.round(Math.max(1500, Math.random() * 10000));
    this._zone.runOutsideAngular(() => {
      setInterval(() => {
        this._zone.run(() => {
          this._data.update((item) => item.set('value', item.value + 1));
        });
      }, interval);
    });
  }
}
