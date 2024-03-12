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
import {
  SORT_VALUES,
  SortSelectorComponent,
  SortType,
} from './shared/sort-selector/sort-selector.component';

const DEFAULT_PRICE_RANGE = { from: 0, to: 10000 };

@Component({
  selector: 'ec-products',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ProductItemComponent,
    SearchInputComponent,
    PriceFilterComponent,
    SortSelectorComponent,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  productsList = inject(ProductsListService);
  categories = inject(CategoriesService);

  priceRange = signal<PriceRange>(DEFAULT_PRICE_RANGE);
  sortType = signal<SortType>('default');

  private _formBuilder = inject(FormBuilder);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);

  searchForm = this._formBuilder.group({
    searchString: [''],
  });

  private _categoryId = '';
  private _searchString = '';
  private _page = 1;

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
        this._loadProducts(1);
        this._page = 1;
      }
    });
  }

  onCategorySelect(id: string) {
    this._updateQueryParams({ category: id }, false);
    this.sortType.set('default');
    this.priceRange.set(DEFAULT_PRICE_RANGE);
  }

  onProductSearch() {
    const searchString = this.searchForm.value.searchString || '';

    if (searchString.length) {
      this._updateQueryParams({ search: searchString });
    } else {
      this._updateQueryParams({ search: null });
    }
  }

  onPriceRangeChange(priceRange: PriceRange) {
    const { from, to } = priceRange;

    if (from !== 0 || to !== DEFAULT_PRICE_RANGE.to) {
      this._updateQueryParams({ price: `${from}-${to}` });
    } else {
      this._updateQueryParams({ price: null });
    }
  }

  onSort(sortType: SortType) {
    if (sortType !== 'default') {
      this._updateQueryParams({ sort: sortType });
    } else {
      this._updateQueryParams({ sort: null });
    }
  }

  onNextPage() {
    this._page += 1;
    this._loadProducts(this._page);
  }

  private _loadProducts(page: number) {
    const { from, to } = this.priceRange();
    const priceParams =
      from !== 0 || to !== DEFAULT_PRICE_RANGE.to
        ? { fromPrice: from, toPrice: to }
        : {};
    const sortBy = (
      this.sortType() !== 'default' ? this.sortType() : undefined
    ) as 'price_asc' | 'price_desc';

    this.productsList.loadProducts({
      ...priceParams,
      categoryId: this._categoryId,
      name: this._searchString,
      sortBy,
      page,
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
    const { queryParamMap } = this._route.snapshot;
    const categoryId = queryParamMap.get('category') || '';
    const searchString = queryParamMap.get('search') || '';
    const priceRange = queryParamMap.get('price') || '';
    const sortType = queryParamMap.get('sort') || '';

    this._categoryId = categoryId;
    this._searchString = searchString;

    untracked(() => {
      if (SORT_VALUES.includes(sortType as SortType)) {
        this.sortType.set(sortType as SortType);
      }
    });

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
