import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ProductSearchComponent } from '../shared/product-search/product-search.component';
import { CategoriesService } from '../state/categories.service';
import { ProductsService } from '../state/products.service';
import { ProductItemComponent } from '../shared/product-item/product-item.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'ec-products',
  standalone: true,
  imports: [ProductSearchComponent, ProductItemComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit {
  private _products = inject(ProductsService);
  private _categories = inject(CategoriesService);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);

  private _categoryId = signal<string>('');

  categories = computed(() => this._categories.value().toList().sort());

  products = computed(() =>
    this._products
      .value()
      .filter((p) =>
        this._categoryId() ? p.categoryId === this._categoryId() : true,
      )
      .toList(),
  );

  constructor() {
    const categoryId = this._route.snapshot.queryParamMap.get('category');
    this._categoryId.set(categoryId || '');
  }

  ngOnInit() {
    const options = this._categoryId ? { categoryId: this._categoryId() } : {};
    this._products.loadProducts(options);
  }

  onCategorySelect(id: string) {
    this._router.navigate([], {
      relativeTo: this._route,
      queryParams: {
        category: id,
      },
    });
    this._categoryId.set(id);
    this._products.loadProducts({ categoryId: id });
  }
}
