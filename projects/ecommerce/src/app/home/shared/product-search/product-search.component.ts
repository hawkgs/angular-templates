import { Component, inject, signal, viewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { List } from 'immutable';

import { SearchInputComponent } from '../../../shared/search-input/search-input.component';
import { ProductsApi } from '../../../api/products-api.service';
import { Product } from '../../../../models';
import { createProductUrl } from '../../../shared/utils/create-product-url';

// Max results shown in the list
const MAX_RESULTS = 5;

// Request search results after the Nth typed character
const SEARCH_AFTER_CHAR = 3;

@Component({
  selector: 'ec-product-search',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, SearchInputComponent],
  templateUrl: './product-search.component.html',
  styleUrl: './product-search.component.scss',
})
export class ProductSearchComponent {
  productsApi = inject(ProductsApi);
  private _router = inject(Router);
  private _formBuilder = inject(FormBuilder);

  searchInput = viewChild<SearchInputComponent>('searchInput');

  form = this._formBuilder.group({
    search: [
      '',
      [Validators.required, Validators.minLength(SEARCH_AFTER_CHAR)],
    ],
  });

  products = signal<List<Product>>(List([]));
  isSearchFocused = signal<boolean>(false);

  createUrl = createProductUrl;

  onSearch() {
    const search = this.form.value.search || '';

    this._router.navigate(['products'], {
      queryParams: { search },
    });
  }

  /**
   * Handle auto-completion.
   */
  async onSearchFieldChange() {
    const searchTerm = this.form.value.search || '';

    if (!searchTerm.length) {
      this.products.set(List([]));
    } else if (searchTerm.length >= SEARCH_AFTER_CHAR) {
      const products = await this.productsApi.getProducts({
        name: searchTerm,
        pageSize: MAX_RESULTS,
      });
      this.products.set(products);
    }
  }
}
