import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ImageGalleryComponent } from './shared/image-gallery/image-gallery.component';
import { ProductsService } from '../../data-access/products.service';
import { Product } from '../../../models';
import { CategoriesService } from '../../data-access/categories.service';
import { PriceTagComponent } from '../../shared/price-tag/price-tag.component';
import { AddToCartBtnComponent } from '../../shared/add-to-cart-btn/add-to-cart-btn.component';

@Component({
  selector: 'ec-product-details',
  standalone: true,
  imports: [ImageGalleryComponent, PriceTagComponent, AddToCartBtnComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent {
  private _route = inject(ActivatedRoute);
  private _products = inject(ProductsService);
  private _categories = inject(CategoriesService);

  // We assume that the product will exist in the state
  // given that we have a route guard that ensures that.
  id = signal<string>(this._route.snapshot.paramMap.get('id')!);
  product = computed<Product>(() => this._products.value().get(this.id())!);
  categories = computed(() =>
    this.product().categoryIds.map(
      (id) => this._categories.value().get(id)?.name,
    ),
  );
}
