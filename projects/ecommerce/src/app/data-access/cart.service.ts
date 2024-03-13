import {
  AfterRenderPhase,
  Injectable,
  afterNextRender,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { Map } from 'immutable';
import { Product } from '../../models';
import { LocalStorage } from '../shared/local-storage.service';
import { ProductsApi } from '../api/products-api.service';

const CART_LS_KEY = 'ec-cart';

/**
 * Cart state.
 */
@Injectable()
export class CartService {
  private _storage = inject(LocalStorage);
  private _productsApi = inject(ProductsApi);

  private _cart = signal<Map<string, number>>(Map([]));
  private _products = signal<Map<string, Product>>(Map([]));

  readonly products = computed(() => this._products().toList());
  readonly quantities = this._cart.asReadonly();
  readonly size = computed(() => this._cart().size);

  constructor() {
    // _loadCartInState uses browser API; hence, we need
    // ot defer the execution after the SSR render.
    afterNextRender(() => this._loadCartInState(), {
      phase: AfterRenderPhase.Read,
    });

    // Any update of the _cart signal after the _loadCartInState
    // will result in a Storage update.
    effect(() => {
      this._storage.setJSON(CART_LS_KEY, this._cart().toJSON());
    });
  }

  async loadCartProducts() {
    const missingFromState = this._cart()
      .filter((_, id) => !this._products().has(id))
      .toArray()
      .map(([key]) => key);

    if (missingFromState.length) {
      const products = await this._productsApi.getProducts({
        batchIds: missingFromState,
      });

      products.forEach((p: Product) => {
        this._products.update((m) => m.set(p.id, p));
      });
    }
  }

  addToCart(product: Product, quantity: number = 1) {
    this.updateQuantity(product, quantity);
  }

  updateQuantity(
    product: Product,
    quantity: number,
    relativeQuantity: boolean = true,
  ) {
    const currQuantity = relativeQuantity
      ? this._cart().get(product.id) || 0
      : 0;
    const nextQuantity = currQuantity + quantity;

    if (!nextQuantity) {
      this.removeFromCart(product);
      return;
    }

    this._cart.update((m) => m.set(product.id, nextQuantity));

    if (!this._products().has(product.id)) {
      this._products.update((m) => m.set(product.id, product));
    }
  }

  removeFromCart(product: Product) {
    this._cart.update((m) => m.delete(product.id));
    this._products.update((m) => m.delete(product.id));
  }

  private _loadCartInState() {
    const cart = this._storage.getJSON(CART_LS_KEY) as {
      [key: string]: number;
    } | null;

    if (cart) {
      for (const productId in cart) {
        const quantity = cart[productId];
        untracked(() => {
          this._cart.update((m) => m.set(productId, quantity));
        });
      }
    }
  }
}
