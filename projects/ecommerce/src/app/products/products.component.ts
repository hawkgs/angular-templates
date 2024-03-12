import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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
  SortSelectorComponent,
  SortType,
  isOfSortType,
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
  providers: [ProductsListService],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit {
  productsList = inject(ProductsListService);
  categories = inject(CategoriesService);

  private _formBuilder = inject(FormBuilder);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);

  DEFAULT_PRICE_RANGE = DEFAULT_PRICE_RANGE;
  priceRange = signal<PriceRange>(DEFAULT_PRICE_RANGE);
  sortType = signal<SortType>('default');

  searchForm = this._formBuilder.group({
    searchString: [''],
  });

  private _categoryId = '';
  private _searchString = '';
  private _page = 1;

  ngOnInit(): void {
    this._updateParamPropsFromRoute();
    this._reloadList();
  }

  onCategorySelect(id: string) {
    this._updateQueryParams({ category: id }, false);

    this.sortType.set('default');
    this.priceRange.set(DEFAULT_PRICE_RANGE);
    this._searchString = '';
    this._categoryId = id;

    this._reloadList();
  }

  onProductSearch(e: Event) {
    e.preventDefault();

    const searchString = this.searchForm.value.searchString || '';
    this._searchString = searchString;

    if (searchString.length) {
      this._updateQueryParams({ search: searchString });
    } else {
      this._updateQueryParams({ search: null });
    }

    this._reloadList();
  }

  onPriceRangeChange(priceRange: PriceRange) {
    const { from, to } = priceRange;

    if (from !== 0 || to !== DEFAULT_PRICE_RANGE.to) {
      this._updateQueryParams({ price: `${from}-${to}` });
    } else {
      this._updateQueryParams({ price: null });
    }

    this._reloadList();
  }

  onSort(sortType: SortType) {
    if (sortType !== 'default') {
      this._updateQueryParams({ sort: sortType });
    } else {
      this._updateQueryParams({ sort: null });
    }

    this._reloadList();
  }

  onNextPage() {
    this._page += 1;
    this._loadProducts(this._page);
  }

  private _reloadList() {
    this._page = 1;
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

  private _updateParamPropsFromRoute() {
    const { queryParamMap } = this._route.snapshot;
    const categoryId = queryParamMap.get('category') || '';
    const searchString = queryParamMap.get('search') || '';
    const priceRange = queryParamMap.get('price') || '';
    const sortType = queryParamMap.get('sort') || '';

    this._categoryId = categoryId;
    this._searchString = searchString;

    if (isOfSortType(sortType)) {
      this.sortType.set(sortType as SortType);
    }

    const range = priceRange.split('-');

    if (range.length === 2) {
      const from = parseInt(range[0], 10);
      const to = parseInt(range[1], 10);

      if (typeof from === 'number' && typeof to === 'number') {
        this.priceRange.set({ from, to });
      }
    }
  }
}
