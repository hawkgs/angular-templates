import { Injectable, Signal, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { List } from 'immutable';
import { map } from 'rxjs';

import { Category } from '../../models';
import { environment } from '../../environments/environment';
import { mapCategories } from './utils/mappers';
import { HttpClient } from '@angular/common/http';
import { ApiCategory } from './utils/api-types';

// NOTE: An error handling mechanism is not implemented.
@Injectable()
export class CategoriesApi {
  private _http = inject(HttpClient);

  /**
   * Fetches categories
   *
   * @returns All categories that the ecommerce web app has
   */
  getCategories(): Signal<List<Category>> {
    const request = this._http
      .get<ApiCategory[]>(`${environment.apiUrl}/categories`)
      .pipe(map((cats) => mapCategories(cats)));

    return toSignal(request) as Signal<List<Category>>;
  }
}
