import { Injectable, inject } from '@angular/core';
import { List } from 'immutable';

import { Product } from '../models';
import { FETCH_API, fetchAbort } from '../shared/fetch';
import { environment } from '../../environments/environment';
import { mapProducts } from './mappers';

@Injectable()
export class ProductsApi {
  private _abortIfInProgress = fetchAbort();
  private _fetch = inject(FETCH_API);

  /**
   * Fetches products
   *
   * @returns The products that match the given criteria
   */
  async getProducts(): Promise<List<Product>> {
    const signal = this._abortIfInProgress(this.getProducts.name);

    const response = await this._fetch(`${environment.apiUrl}/products`, {
      signal,
    });
    const json = await response.json();

    return mapProducts(json);
  }
}
