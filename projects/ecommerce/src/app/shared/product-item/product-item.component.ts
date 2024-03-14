import {
  Component,
  EventEmitter,
  Output,
  computed,
  inject,
  input,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';

import { Product } from '../../../models';
import { CategoriesService } from '../../data-access/categories.service';
import { createProductUrl } from '../utils/create-product-url';
import { PriceTagComponent } from '../price-tag/price-tag.component';

@Component({
  selector: 'ec-product-item',
  standalone: true,
  imports: [RouterModule, NgOptimizedImage, PriceTagComponent],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.scss',
})
export class ProductItemComponent {
  private _categories = inject(CategoriesService);

  product = input.required<Product>();
  @Output() productClick = new EventEmitter<Product>();

  categories = computed(() =>
    this.product().categoryIds.map(
      (cId) => this._categories.value().get(cId)?.name,
    ),
  );

  productUrl = computed(() => createProductUrl(this.product()));
}
