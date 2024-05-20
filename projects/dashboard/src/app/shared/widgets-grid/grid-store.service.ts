import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { LocalStorage } from '@ngx-templates/shared/services';
import { Map } from 'immutable';
import { WidgetGridItem, WidgetGridItemConfig } from './widget-grid-item';
import { isPlatformBrowser } from '@angular/common';

const GRID_CONFIG_LS_KEY = 'db-grid-cfg';

// Defaults widgets. Might get rid of it in the future.
const DEFAULT_LIST: WidgetGridItemConfig[] = [
  {
    id: 'r1',
    position: 0,
    type: 'plain',
    config: { style: 'red' },
    size: 1,
  },
  {
    id: 'g1',
    position: 1,
    type: 'plain',
    config: { style: 'green' },
    size: 1,
  },
  {
    id: 'b1',
    position: 2,
    type: 'plain',
    config: { style: 'blue' },
    size: 2,
  },
  {
    id: 'p1',
    position: 4,
    type: 'plain',
    config: { style: 'purple' },
    size: 1,
  },
  {
    id: 'o1',
    position: 3,
    type: 'plain',
    config: { style: 'orange' },
    size: 1,
  },
];

/**
 * Preserves the state of the dashboard/widget grid
 * (i.e. types of widgets and their positions).
 */
@Injectable()
export class GridStoreService {
  private _storage = inject(LocalStorage);
  private _platformId = inject(PLATFORM_ID);

  getGridItems(): Map<string, WidgetGridItem> {
    // Return an empty list on the server.
    // Else, it will return the DEFAULT_LIST which will
    // be visible for a brief moment when loading the page
    // in the browser.
    if (!isPlatformBrowser(this._platformId)) {
      return Map([]);
    }

    const items = this._storage.getJSON(GRID_CONFIG_LS_KEY);

    if (items && items instanceof Array) {
      return Map(items.map((i) => [i.id, new WidgetGridItem(i)]));
    }

    // Return the default list, if the storage is empty
    return Map(DEFAULT_LIST.map((i) => [i.id, new WidgetGridItem(i)]));
  }

  setGridItems(items: Map<string, WidgetGridItem>) {
    const obj = items
      .toList()
      .toJSON()
      .map((o) => o.toJSON());

    this._storage.set(GRID_CONFIG_LS_KEY, JSON.stringify(obj));
  }
}
