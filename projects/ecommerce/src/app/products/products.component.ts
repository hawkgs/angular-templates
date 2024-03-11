import { Component, effect, inject, signal, untracked } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { CategoriesService } from '../data-access/categories.service';
import { ProductItemComponent } from '../shared/product-item/product-item.component';
import { ProductsListService } from './data-access/products-list.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SearchInputComponent } from '../shared/search-input/search-input.component';
import {
  PriceFilterComponent,
  PriceRange,
} from './shared/price-filter/price-filter.component';

const MAX_PRICE_RANGE = 10000;

@Component({
  selector: 'ec-products',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ProductItemComponent,
    SearchInputComponent,
    PriceFilterComponent,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  productsList = inject(ProductsListService);
  categories = inject(CategoriesService);

  priceRange = signal<PriceRange>({ from: 0, to: MAX_PRICE_RANGE });

  private _formBuilder = inject(FormBuilder);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);

  searchForm = this._formBuilder.group({
    searchString: [''],
  });

  private _categoryId = '';
  private _searchString = '';

  constructor() {
    const routerEvents = toSignal(this._router.events);

    // Each query param change results in a state update.
    // This way we only rely on a single point of change
    // rather than manually updating the state on user
    // interation (e.g. click). Also, makes route change
    // state update straightforward.
    effect(() => {
      if (routerEvents() instanceof NavigationEnd) {
        this._updateParamsPropsFromRoute();
        this._loadProducts();
      }
    });
  }

  onCategorySelect(id: string) {
    this._updateQueryParams({ category: id }, false);
  }

  onProductSearch() {
    const searchString = this.searchForm.value.searchString || '';

    if (searchString.length) {
      this._updateQueryParams({ search: searchString });
    } else {
      this._updateQueryParams({ search: null });
    }
  }

  onPriceRangeChange() {
    const { from, to } = this.priceRange();

    if (from !== 0 || to !== MAX_PRICE_RANGE) {
      this._updateQueryParams({ price: `${from}-${to}` });
    } else {
      this._updateQueryParams({ price: null });
    }
  }

  private _loadProducts() {
    const { from, to } = this.priceRange();
    const priceParams =
      from !== 0 || to !== MAX_PRICE_RANGE
        ? { fromPrice: from, toPrice: to }
        : {};

    this.productsList.loadProducts({
      ...priceParams,
      categoryId: this._categoryId,
      name: this._searchString,
    });
  }

  private _updateQueryParams(params: object, merge: boolean = true) {
    this._router.navigate([], {
      relativeTo: this._route,
      queryParams: params,
      ...(merge ? { queryParamsHandling: 'merge' } : {}),
    });
  }

  private _updateParamsPropsFromRoute() {
    const categoryId = this._route.snapshot.queryParamMap.get('category') || '';
    const searchString = this._route.snapshot.queryParamMap.get('search') || '';
    const priceRange = this._route.snapshot.queryParamMap.get('price') || '';

    this._categoryId = categoryId;
    this._searchString = searchString;

    const range = priceRange.split('-');

    if (range.length === 2) {
      const from = parseInt(range[0], 10);
      const to = parseInt(range[1], 10);

      if (typeof from === 'number' && typeof to === 'number') {
        // Since the method is executed in an effect
        // and priceRange should not be threated as a
        // dependency, we use untracted in order to
        // point that it should be ignored.
        untracked(() => {
          this.priceRange.set({ from, to });
        });
      }
    }
  }
}
