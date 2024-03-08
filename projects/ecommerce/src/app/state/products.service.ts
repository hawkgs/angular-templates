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

  // TODO(Georgi): Refactor state management
  private _products = signal<Map<string, Product>>(Map([]));

  readonly value = this._products.asReadonly();

  async loadProducts(options?: Partial<{ categoryId: string }>) {
    const products = await this._productsApi.getProducts({
      categoryId: options?.categoryId,
      pageSize: 20,
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
