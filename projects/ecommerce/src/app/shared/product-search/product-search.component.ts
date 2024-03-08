import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { List } from 'immutable';

import { SearchInputComponent } from '../search-input/search-input.component';
import { ProductsApi } from '../../api/products-api.service';
import { Product } from '../../state/models';
import { createProductUrl } from '../utils/create-product-url';

// Max results shown in the list
const MAX_RESULTS = 5;

// Request search results after the Nth typed character
const SEARCH_AFTER_CHAR = 3;

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
    } else if (searchStr.length >= SEARCH_AFTER_CHAR) {
      const products = await this.productsApi.getProducts({
        name: searchStr,
        pageSize: MAX_RESULTS,
      });
      this.products.set(products);
    }
  }
}
