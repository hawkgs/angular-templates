import { Component, OnInit, inject } from '@angular/core';
import { CartService } from '../data-access/cart.service';
import { CategoriesService } from '../data-access/categories.service';
import { CartItemComponent } from './shared/cart-item/cart-item.component';
import { Product } from '../../models';

@Component({
  selector: 'ec-cart',
  standalone: true,
  imports: [CartItemComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  categories = inject(CategoriesService);
  cart = inject(CartService);

  ngOnInit() {
    this.cart.loadCartProducts();
  }

  onItemDelete(product: Product) {
    this.cart.removeFromCart(product);
  }

  onItemQuanityUpdate(product: Product, quantity: number) {
    this.cart.updateQuantity(product, quantity);
  }
}
