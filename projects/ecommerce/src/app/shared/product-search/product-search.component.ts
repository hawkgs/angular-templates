import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { List } from 'immutable';

import { SearchInputComponent } from '../search-input/search-input.component';
import { ProductsApi } from '../../api/products-api.service';
import { Product } from '../../state/models';
import { createProductUrl } from '../utils/create-product-url';

const MAX_RESULTS = 5;
const SEARCH_AFTER = 3;

@Component({
  selector: 'ec-product-search',
  standalone: true,
  imports: [RouterModule, SearchInputComponent],
  templateUrl: './product-search.component.html',
  styleUrl: './product-search.component.scss',
})
export class ProductSearchComponent {
  products = signal<List<Product>>(List([]));
  productsApi = inject(ProductsApi);
  createUrl = createProductUrl;

  async onProductSearch(searchStr: string) {
    if (!searchStr.length) {
      this.products.set(List([]));
    } else if (searchStr.length >= SEARCH_AFTER) {
      const products = await this.productsApi.getProducts({
        name: searchStr,
        pageSize: MAX_RESULTS,
      });
      this.products.set(products);
    }
  }
}
