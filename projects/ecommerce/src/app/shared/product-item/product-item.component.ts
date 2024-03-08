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
import { environment } from '../../../environments/environment';
import { createProductUrl } from '../utils/create-product-url';

@Component({
  selector: 'ec-product-item',
  standalone: true,
  imports: [RouterModule, NgOptimizedImage],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.scss',
})
export class ProductItemComponent {
  private _categories = inject(CategoriesService);

  product = input.required<Product>();
  @Output() productClick = new EventEmitter<Product>();

  env = environment;

  category = computed(() =>
    this._categories.value().get(this.product().categoryId),
  );

  productUrl = computed(() => createProductUrl(this.product()));
}
