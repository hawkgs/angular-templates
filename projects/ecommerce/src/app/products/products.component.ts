import {
  Component,
  OnInit,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
} from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { CategoriesService } from '../data-access/categories.service';
import { ProductItemComponent } from '../shared/product-item/product-item.component';
import { ProductsListService } from './data-access/products-list.service';
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
import { getRoutePath } from './shared/utils';

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
    RouterModule,
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
  categoryId = signal<string>('');

  searchForm = this._formBuilder.group({
    searchString: [''],
  });

  private _searchString = '';
  private _page = 1;
  private _lastEvent?: NavigationEnd;

  constructor() {
    const routerEvents = toSignal(this._router.events);

    // Each query param change results in a state update.
    // This way we only rely on a single point of change
    // rather than manually updating the state on user
    // interation (e.g. click). Also, makes route change
    // state update straightforward.
    effect(() => {
      const event = routerEvents();

      if (event instanceof NavigationEnd) {
        // The initial data load is delegated to ngOnInit.
        // Any other subsequent change that results in
        // a update of the product list is handled by
        // this piece of code.
        if (getRoutePath(event) === getRoutePath(this._lastEvent)) {
          this._reloadList();
        }
        this._lastEvent = event;
      }
    });
  }

  ngOnInit(): void {
    this._reloadList();
  }

  onProductSearch(e: Event) {
    e.preventDefault();

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

  private _reloadList() {
    this._updateParamPropsFromRoute();
    this._loadProducts(1);
    this._page = 1;
  }

  /**
   * Load products in the state based on the
   * currently selected params.
   *
   * @param page
   */
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
      categoryId: this.categoryId(),
      name: this._searchString,
      sortBy,
      page,
    });
  }

  /**
   * Update the current route query paramters.
   *
   * @param params
   * @param merge
   */
  private _updateQueryParams(params: object) {
    this._router.navigate([], {
      relativeTo: this._route,
      queryParams: params,
      queryParamsHandling: 'merge',
    });
  }

  /**
   * Update all of the component plain properties or signals
   * based on the current route query parameters.
   */
  private _updateParamPropsFromRoute() {
    const { queryParamMap } = this._route.snapshot;
    const categoryId = queryParamMap.get('category') || '';
    const searchString = queryParamMap.get('search') || '';
    const priceRange = queryParamMap.get('price') || '';
    const sortType = queryParamMap.get('sort') || '';

    this._searchString = searchString;

    // Since the method is executed in an effect
    // and categoryId should not be threated as a
    // dependency, we use untracted in order to
    // point that it should be ignored.
    untracked(() => this.categoryId.set(categoryId));

    if (isOfSortType(sortType)) {
      // Same for sortType
      untracked(() => this.sortType.set(sortType as SortType));
    } else {
      untracked(() => this.sortType.set('default'));
    }

    const range = priceRange.split('-');

    if (range.length === 2) {
      const from = parseInt(range[0], 10);
      const to = parseInt(range[1], 10);

      if (typeof from === 'number' && typeof to === 'number') {
        // Same for priceRange
        untracked(() => this.priceRange.set({ from, to }));
      }
    } else {
      untracked(() => this.priceRange.set(DEFAULT_PRICE_RANGE));
    }
  }
}
