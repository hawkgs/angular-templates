import { Component, OnInit, inject, input, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { List } from 'immutable';

import { ProductItemComponent } from '../../../shared/product-item/product-item.component';
import { Category, Product } from '../../../../models';
import { ProductsApi } from '../../../api/products-api.service';

const REEL_SIZE = 5;

@Component({
  selector: 'ec-category-reel',
  standalone: true,
  imports: [RouterModule, ProductItemComponent],
  templateUrl: './category-reel.component.html',
  styleUrl: './category-reel.component.scss',
})
export class CategoryReelComponent implements OnInit {
  private _productsApi = inject(ProductsApi);

  category = input.required<Category>();
  products = signal<List<Product>>(List([]));

  async ngOnInit() {
    const products = await this._productsApi.getProducts(
      {
        categoryId: this.category().id,
        pageSize: REEL_SIZE,
      },
      false,
    );
    this.products.set(products);
  }
}
