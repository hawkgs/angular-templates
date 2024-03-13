import {
  Component,
  EventEmitter,
  Output,
  computed,
  input,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { Product } from '../../../../models';
import { createProductUrl } from '../../../shared/utils/create-product-url';

@Component({
  selector: 'ec-cart-item',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss',
})
export class CartItemComponent {
  @Output() updateQuantity = new EventEmitter<number>();
  @Output() delete = new EventEmitter<void>();

  product = input.required<Product>();
  quantity = input.required<number>();
  productUrl = computed(() => createProductUrl(this.product()));
}
