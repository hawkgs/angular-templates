import { Injectable, signal } from '@angular/core';
import { DataItem, DataSource } from './types';
import { List } from 'immutable';

const USERS_NATIONALITY: [string, number][] = [
  ['United States', 105],
  ['Canada', 67],
  ['Mexico', 80],
  ['Germany', 55],
  ['Italy', 94],
  ['France', 21],
];

@Injectable()
export class UsersNationalityList implements DataSource<List<DataItem>> {
  private _init = false;
  private _data = signal<List<DataItem>>(List());
  data = this._data.asReadonly();

  init() {
    if (this._init) {
      return;
    }

    this._init = true;

    setTimeout(() => {
      let list = List<DataItem>();
      USERS_NATIONALITY.forEach(([nationality, count]) => {
        list = list.push(new DataItem({ label: nationality, value: count }));
      });
      this._data.set(list);
    });
  }
}
