import { Component, OnInit, computed, inject } from '@angular/core';
import { IconComponent } from '@ngx-templates/shared/icon';

import { CartService } from '../data-access/cart.service';
import { CartItemComponent } from './shared/cart-item/cart-item.component';
import { Product } from '../../models';
import { environment } from '../../environments/environment';
import { CurrencyPipe } from '../shared/pipes/currency.pipe';
import { ButtonComponent } from '../shared/button/button.component';

@Component({
  selector: 'ec-cart',
  standalone: true,
  imports: [CartItemComponent, CurrencyPipe, IconComponent, ButtonComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  cart = inject(CartService);

  subtotal = this.cart.total;
  shipping = environment.shippingCost;
  taxes = computed(() => this.subtotal() * environment.taxPercentage);
  total = computed(() => this.subtotal() + this.taxes() + this.shipping);

  ngOnInit() {
    this.cart.loadCartProducts();
  }

  onItemRemove(product: Product) {
    this.cart.removeFromCart(product);
  }

  onItemQuanityUpdate(product: Product, quantity: number) {
    this.cart.updateQuantity(product, quantity, false);
  }
}
