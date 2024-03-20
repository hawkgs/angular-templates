import {
  Component,
  OnInit,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  NavigationStart,
  Router,
} from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

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
import {
  getRoutePath,
  isProductDetailsRoute,
  isProductsListRoute,
} from './shared/utils';
import { ButtonComponent } from '../shared/button/button.component';
import { IconComponent } from '../shared/icon/icon.component';
import { CategoryPickerComponent } from './shared/category-picker/category-picker.component';
import { InfiniteScrollComponent } from '../shared/infinite-scroll/infinite-scroll.component';
import { SkeletonProductItemComponent } from '../shared/skeleton-product-item/skeleton-product-item.component';
import { ScrollPosition } from '../shared/scroll-position.service';

const DEFAULT_PRICE_RANGE = { from: 0, to: 10000 };
const DEFAULT_CAT_NAME = 'All Products';

// Request search results after the Nth typed character
const SEARCH_AFTER_CHAR = 2;

@Component({
  selector: 'ec-products',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ProductItemComponent,
    SearchInputComponent,
    PriceFilterComponent,
    SortSelectorComponent,
    CategoryPickerComponent,
    ButtonComponent,
    IconComponent,
    SkeletonProductItemComponent,
    InfiniteScrollComponent,
  ],
  providers: [ProductsListService, ScrollPosition],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit {
  productsList = inject(ProductsListService);

  private _formBuilder = inject(FormBuilder);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);
  private _categories = inject(CategoriesService);
  private _scrollPos = inject(ScrollPosition);

  DEFAULT_PRICE_RANGE = DEFAULT_PRICE_RANGE;
  DEFAULT_CAT_NAME = DEFAULT_CAT_NAME;

  priceRange = signal<PriceRange>(DEFAULT_PRICE_RANGE);
  sortType = signal<SortType>('default');
  categoryId = signal<string>('');
  searchTerm = signal<string>('');

  categoryName = computed(
    () =>
      this._categories.value().get(this.categoryId())?.name || DEFAULT_CAT_NAME,
  );

  searchForm = this._formBuilder.group({
    searchString: [
      '',
      [Validators.required, Validators.minLength(SEARCH_AFTER_CHAR)],
    ],
  });

  private _page = 1;
  private _lastEvent?: NavigationEnd;

  constructor() {
    const routerEvents = toSignal(this._router.events);

    effect(() => {
      const event = routerEvents();

      if (event instanceof NavigationStart) {
        // Opening product details – save current scroll
        if (isProductDetailsRoute(event)) {
          this._scrollPos.save();
        }
      }

      if (event instanceof NavigationEnd) {
        // Each query param change results in a state update.
        // This way we only rely on a single point of change
        // rather than manually updating the state on user
        // interation (e.g. click). Also, makes route change
        // state update straightforward.
        //
        // The initial data load is delegated to ngOnInit.
        // Any other subsequent change that results in
        // a update of the product list is handled by
        // this piece of code.
        if (getRoutePath(event) === getRoutePath(this._lastEvent)) {
          this._reloadList();
        }
        // Coming back from product details – apply stored scroll
        if (isProductDetailsRoute(this._lastEvent)) {
          this._scrollPos.apply();
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

  async onNextPage(loadCompleted: () => void) {
    this._page += 1;
    await this._loadProducts(this._page);
    loadCompleted();
  }

  private _reloadList() {
    this._updateParamPropsFromRoute();
    untracked(() => this._loadProducts(1));
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

    return this.productsList.loadProducts({
      ...priceParams,
      categoryId: this.categoryId(),
      name: this.searchTerm(),
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
    const searchTerm = queryParamMap.get('search') || '';
    const priceRange = queryParamMap.get('price') || '';
    const sortType = queryParamMap.get('sort') || '';

    // Since the method is executed in an effect
    // and searchTerm and categoryId should not be
    // threated as a dependency, we use untracted in
    // order to point that they should be ignored.
    untracked(() => {
      this.searchTerm.set(searchTerm);
      this.categoryId.set(categoryId);

      if (isOfSortType(sortType)) {
        // Same for sortType
        this.sortType.set(sortType as SortType);
      } else {
        this.sortType.set('default');
      }

      const range = priceRange.split('-');

      if (range.length === 2) {
        const from = parseInt(range[0], 10);
        const to = parseInt(range[1], 10);

        if (typeof from === 'number' && typeof to === 'number') {
          // Same for priceRange
          this.priceRange.set({ from, to });
        }
      } else {
        this.priceRange.set(DEFAULT_PRICE_RANGE);
      }
    });
  }
}
