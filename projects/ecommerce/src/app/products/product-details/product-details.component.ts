import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ImageGalleryComponent } from './shared/image-gallery/image-gallery.component';
import { ProductsService } from '../../data-access/products.service';
import { Product } from '../../../models';

@Component({
  selector: 'ec-product-details',
  standalone: true,
  imports: [ImageGalleryComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent {
  private _route = inject(ActivatedRoute);
  private _products = inject(ProductsService);

  // We assume that the product will exist in the state
  // given that we have a route guard that ensures that.
  id = signal<string>(this._route.snapshot.paramMap.get('id')!);
  product = computed<Product>(() => this._products.value().get(this.id())!);
}
