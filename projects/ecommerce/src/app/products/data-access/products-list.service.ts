import { Injectable, inject, signal } from '@angular/core';
import { List } from 'immutable';

import { GetProductsParams, ProductsApi } from '../../api/products-api.service';
import { Product } from '../../../models';
import { environment } from '../../../environments/environment';

/**
 * Products list state.
 */
@Injectable()
export class ProductsListService {
  private _productsApi = inject(ProductsApi);
  private _products = signal<List<Product>>(List([]));
  private _isComplete = signal<boolean>(false);
  private _lastOptions: GetProductsParams = {};

  readonly value = this._products.asReadonly();
  readonly isComplete = this._isComplete.asReadonly();

  async loadProducts(options?: GetProductsParams) {
    const products = await this._productsApi.getProducts(options);
    const optionsDiff = this._getOptionsDiff(options);

    if (
      Object.keys(optionsDiff).length === 1 &&
      optionsDiff.page === (this._lastOptions.page || 0) + 1
    ) {
      // Updating products
      this._products.update((list) => list.concat(products));
    } else {
      // Reloading products
      this._products.set(products);
    }

    this._isComplete.set(products.size < environment.productsListPageSize);
    this._lastOptions = options || {};
  }

  private _getOptionsDiff(currOptions?: GetProductsParams): GetProductsParams {
    const diff: GetProductsParams = {};

    for (const prop in currOptions) {
      const castedProp = prop as keyof GetProductsParams;
      const currParam = currOptions[castedProp];
      const lastParam = this._lastOptions[castedProp];

      if (currParam !== lastParam) {
        diff[castedProp] = currParam as undefined;
      }
    }

    return diff;
  }
}
