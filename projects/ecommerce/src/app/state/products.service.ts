import { Injectable, inject, signal } from '@angular/core';
import { Map } from 'immutable';
import { Product } from './models';
import { ProductsApi } from '../api/products-api.service';

/**
 * Products state.
 */
@Injectable()
export class ProductsService {
  private _productsApi = inject(ProductsApi);
  // TODO(Georgi): Change to Map
  private _products = signal<Map<string, Product>>(Map([]));

  readonly value = this._products.asReadonly();

  async loadProducts() {
    const products = await this._productsApi.getProducts({
      pageSize: 30,
      fromPrice: 300,
      toPrice: 800,
    });
    this._products.update((map) => {
      products.forEach((p) => {
        map = map.set(p.id, p);
      });
      return map;
    });
  }

  async loadProduct(id: string) {
    const product = await this._productsApi.getProduct(id);
    this._products.update((map) => map.set(product.id, product));
  }
}
