import { signal } from '@angular/core';
import { Map } from 'immutable';
import { Product } from '../../models';

/**
 * Cart state.
 */
export class CartService {
  private _cart = signal<Map<string, number>>(Map([]));
  readonly value = this._cart.asReadonly();

  addToCart(product: Product, quantity: number = 1) {
    const currQuantity = this._cart().get(product.id) || 0;
    this._cart.update((m) => m.set(product.id, currQuantity + quantity));
  }

  removeFromCart(product: Product) {
    this._cart.update((m) => m.delete(product.id));
  }
}
