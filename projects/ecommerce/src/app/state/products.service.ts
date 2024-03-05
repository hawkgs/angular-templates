import { Injectable, inject, signal } from '@angular/core';
import { List } from 'immutable';
import { Product } from '../models';
import { ProductsApi } from '../api/products-api.service';

/**
 * Products state.
 */
@Injectable()
export class ProductsService {
  private _productsApi = inject(ProductsApi);
  // TODO(Georgi): Change to Map
  private _products = signal<List<Product>>(List([]));

  readonly value = this._products.asReadonly();

  async loadProducts() {
    const products = await this._productsApi.getProducts();
    this._products.update((v) => v.concat(products));
  }
}
