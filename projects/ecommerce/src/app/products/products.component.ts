import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ProductSearchComponent } from '../shared/product-search/product-search.component';
import { CategoriesService } from '../data-access/categories.service';
import { ProductItemComponent } from '../shared/product-item/product-item.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsListService } from './data-access/products-list.service';

@Component({
  selector: 'ec-products',
  standalone: true,
  imports: [ProductSearchComponent, ProductItemComponent],
  providers: [ProductsListService],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit {
  productsList = inject(ProductsListService);
  private _categories = inject(CategoriesService);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);

  private _categoryId = signal<string>('');

  categories = computed(() => this._categories.value().toList().sort());

  constructor() {
    const categoryId = this._route.snapshot.queryParamMap.get('category');
    this._categoryId.set(categoryId || '');
  }

  ngOnInit() {
    this._loadProducts();
  }

  onCategorySelect(id: string) {
    this._router.navigate([], {
      relativeTo: this._route,
      queryParams: {
        category: id,
      },
    });
    this._categoryId.set(id);
    this._loadProducts();
  }

  private _loadProducts() {
    const options = this._categoryId ? { categoryId: this._categoryId() } : {};
    this.productsList.loadProducts(options);
  }
}
