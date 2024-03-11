import { Component, OnInit, computed, inject } from '@angular/core';
import { CategoriesService } from '../data-access/categories.service';
import { ProductItemComponent } from '../shared/product-item/product-item.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsListService } from './data-access/products-list.service';
import { SearchInputComponent } from '../shared/search-input/search-input.component';

@Component({
  selector: 'ec-products',
  standalone: true,
  imports: [SearchInputComponent, ProductItemComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit {
  productsList = inject(ProductsListService);
  categories = inject(CategoriesService);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);

  private _categoryId = '';
  private _searchString = '';

  constructor() {
    const categoryId = this._route.snapshot.queryParamMap.get('category');
    const searchString = this._route.snapshot.queryParamMap.get('search');

    this._categoryId = categoryId || '';
    this._searchString = searchString || '';
  }

  ngOnInit() {
    this._loadProducts();
  }

  onCategorySelect(id: string) {
    this._updateQueryParams({ category: id }, false);

    this._categoryId = id;
    this._searchString = '';
    this._loadProducts();
  }

  onProductSearch(searchString: string) {
    if (searchString.length) {
      this._updateQueryParams({ search: searchString });
    } else {
      this._updateQueryParams({ search: null });
    }

    this._searchString = searchString;
    this._loadProducts();
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
}
