import {
  Component,
  EventEmitter,
  Output,
  computed,
  inject,
  input,
} from '@angular/core';
import { RouterModule } from '@angular/router';

import { Product } from '../../state/models';
import { CategoriesService } from '../../state/categories.service';
import { environment } from '../../../environments/environment';
import { createProductUrl } from '../utils/create-product-url';

@Component({
  selector: 'ec-product-item',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.scss',
})
export class ProductItemComponent {
  private _categories = inject(CategoriesService);
  @Output() productClick = new EventEmitter<Product>();

  env = environment;
  product = input.required<Product>();

  category = computed(() =>
    this._categories.value().get(this.product().categoryId),
  );

  productUrl = computed(() => createProductUrl(this.product()));
}
