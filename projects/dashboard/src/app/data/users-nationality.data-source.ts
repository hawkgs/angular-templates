import { Injectable, signal } from '@angular/core';
import { DataItem, DataSource } from './types';
import { List } from 'immutable';

const USERS_NATIONALITY: [string, number][] = [
  ['United States', 10332],
  ['Canada', 3702],
  ['Mexico', 8034],
  ['Germany', 1502],
  ['Italy', 9401],
  ['France', 210],
  ['United Arab Emirates', 2011],
  ['New Zealand', 5700],
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
