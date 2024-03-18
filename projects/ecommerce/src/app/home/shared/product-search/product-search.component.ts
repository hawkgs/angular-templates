import {
  Component,
  ElementRef,
  HostListener,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { List } from 'immutable';

import { SearchInputComponent } from '../../../shared/search-input/search-input.component';
import { ProductsApi } from '../../../api/products-api.service';
import { Product } from '../../../../models';
import { createProductUrl } from '../../../shared/utils/create-product-url';
import { ButtonComponent } from '../../../shared/button/button.component';

// Max results shown in the list
const MAX_RESULTS = 5;

// Request search results after the Nth typed character
const SEARCH_AFTER_CHAR = 3;

@Component({
  selector: 'ec-product-search',
  standalone: true,
  imports: [
    RouterModule,
    ReactiveFormsModule,
    SearchInputComponent,
    ButtonComponent,
  ],
  templateUrl: './product-search.component.html',
  styleUrl: './product-search.component.scss',
})
export class ProductSearchComponent {
  productsApi = inject(ProductsApi);
  private _router = inject(Router);
  private _formBuilder = inject(FormBuilder);
  createUrl = createProductUrl;

  searchInput = viewChild<SearchInputComponent>('searchInput');
  results = viewChild<ElementRef>('results');

  form = this._formBuilder.group({
    search: [
      '',
      [Validators.required, Validators.minLength(SEARCH_AFTER_CHAR)],
    ],
  });

  private _inFocus = signal<boolean>(false);
  private _searchActive = signal<boolean>(false);
  products = signal<List<Product>>(List([]));
  showResults = computed(() => this._inFocus() && this._searchActive());

  onSearch() {
    const search = this.form.value.search || '';

    this._router.navigate(['products'], {
      queryParams: { search },
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(e: Event) {
    const t = e.target;
    if (
      t !== this.results()?.nativeElement &&
      t !== this.searchInput()?.inputRef()?.nativeElement
    ) {
      this._inFocus.set(false);
    }
  }

  onInputFocus(focused: boolean) {
    if (focused) {
      this._inFocus.set(true);
    }
  }

  /**
   * Handle auto-completion.
   */
  async onSearchFieldChange() {
    const searchTerm = this.form.value.search || '';

    if (!searchTerm.length) {
      this.products.set(List([]));
      this._searchActive.set(false);
    } else if (searchTerm.length >= SEARCH_AFTER_CHAR) {
      const products = await this.productsApi.getProducts({
        name: searchTerm,
        pageSize: MAX_RESULTS,
      });
      this.products.set(products);
      this._searchActive.set(true);
    }
  }
}
