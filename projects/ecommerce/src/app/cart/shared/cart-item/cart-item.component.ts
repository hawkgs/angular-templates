import {
  Component,
  EventEmitter,
  Output,
  computed,
  input,
  model,
} from '@angular/core';
import { RouterModule } from '@angular/router';

import { Product } from '../../../../models';
import { createProductUrl } from '../../../shared/utils/create-product-url';
import { PriceTagComponent } from '../../../shared/price-tag/price-tag.component';
import { CurrencyPipe } from '../../../shared/pipes/currency.pipe';
import { ProductImageComponent } from '../../../shared/product-image/product-image.component';
import { ButtonComponent } from '../../../shared/button/button.component';
import { IconComponent } from '@ngx-templates/shared';
import { maxProductQuantity } from '../../../shared/utils/max-quantity';

@Component({
  selector: 'ec-cart-item',
  standalone: true,
  imports: [
    RouterModule,
    ProductImageComponent,
    PriceTagComponent,
    ButtonComponent,
    CurrencyPipe,
    IconComponent,
  ],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss',
})
export class CartItemComponent {
  @Output() remove = new EventEmitter<void>();
  maxProductQuantity = maxProductQuantity;

  product = input.required<Product>();
  quantity = model<number>(1);
  total = computed(() => {
    const productPrice = this.product().discountPrice || this.product().price;
    return productPrice * this.quantity();
  });
  productUrl = computed(() => createProductUrl(this.product()));

  onInputBlur(e: Event) {
    const input = e.target as HTMLInputElement;

    let quantity = parseInt(input.value, 10) || 1;
    quantity = Math.max(1, quantity);
    quantity = Math.min(quantity, maxProductQuantity(this.product()));

    this.quantity.set(quantity);
  }

  updateQuantity(relativeVal: number) {
    this.quantity.update((q) => q + relativeVal);
  }
}
