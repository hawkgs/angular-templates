import { Component, input } from '@angular/core';
import { Product } from '../../../../../models';
import { PriceTagComponent } from '../../../../shared/price-tag/price-tag.component';
import { AddToCartBtnComponent } from '../add-to-cart-btn/add-to-cart-btn.component';

@Component({
  selector: 'ec-product-inforbar',
  standalone: true,
  imports: [PriceTagComponent, AddToCartBtnComponent],
  templateUrl: './product-inforbar.component.html',
  styleUrl: './product-inforbar.component.scss',
})
export class ProductInfobarComponent {
  product = input.required<Product>();
}
