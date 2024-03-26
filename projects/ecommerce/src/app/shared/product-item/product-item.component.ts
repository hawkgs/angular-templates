import {
  Component,
  EventEmitter,
  Output,
  computed,
  inject,
  input,
} from '@angular/core';
import { RouterModule } from '@angular/router';

import { Product } from '../../../models';
import { CategoriesService } from '../../data-access/categories.service';
import { createProductUrl } from '../utils/create-product-url';
import { PriceTagComponent } from '../price-tag/price-tag.component';
import { ProductImageComponent } from '../product-image/product-image.component';

@Component({
  selector: 'ec-product-item',
  standalone: true,
  imports: [RouterModule, PriceTagComponent, ProductImageComponent],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.scss',
})
export class ProductItemComponent {
  private _categories = inject(CategoriesService);

  product = input.required<Product>();
  isLcp = input<boolean>(false);
  @Output() productClick = new EventEmitter<Product>();

  categories = computed(() =>
    this.product().categoryIds.map(
      (cId) => this._categories.value().get(cId)?.name,
    ),
  );

  productUrl = computed(() => createProductUrl(this.product()));
}
