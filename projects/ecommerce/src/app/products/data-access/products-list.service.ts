import { Injectable, inject, signal } from '@angular/core';
import { List } from 'immutable';

import { GetProductsParams, ProductsApi } from '../../api/products-api.service';
import { Product } from '../../../models';

/**
 * Products list state.
 */
@Injectable()
export class ProductsListService {
  private _productsApi = inject(ProductsApi);
  private _products = signal<List<Product>>(List([]));
  private _lastOptions: GetProductsParams = {};

  readonly value = this._products.asReadonly();

  async loadProducts(options?: GetProductsParams) {
    const products = await this._productsApi.getProducts(options);
    if (options?.categoryId !== this._lastOptions.categoryId) {
      this._products.set(products);
    } else {
      this._products.update((list) => list.concat(products));
    }
  }
}
