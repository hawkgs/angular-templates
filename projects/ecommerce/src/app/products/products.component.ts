import { Component, effect, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { CategoriesService } from '../data-access/categories.service';
import { ProductItemComponent } from '../shared/product-item/product-item.component';
import { ProductsListService } from './data-access/products-list.service';
import { SearchInputComponent } from '../shared/search-input/search-input.component';

@Component({
  selector: 'ec-products',
  standalone: true,
  imports: [SearchInputComponent, ProductItemComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  productsList = inject(ProductsListService);
  categories = inject(CategoriesService);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);

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

  onProductSearch(searchString: string) {
    if (searchString.length) {
      this._updateQueryParams({ search: searchString });
    } else {
      this._updateQueryParams({ search: null });
    }
  }

  private _loadProducts() {
    this.productsList.loadProducts({
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
    const categoryId = this._route.snapshot.queryParamMap.get('category');
    const searchString = this._route.snapshot.queryParamMap.get('search');

    this._categoryId = categoryId || '';
    this._searchString = searchString || '';
  }
}
