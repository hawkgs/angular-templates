import { Component, computed, input } from '@angular/core';
import { Product } from '../../../models';
import { NgOptimizedImage } from '@angular/common';

type ImageSize = 'xs' | 'sm' | 'md' | 'lg';

const DEFAULT_ALT = 'Product Image';
const SIZE_TO_WIDTH: { [key in ImageSize]: number } = {
  xs: 32,
  sm: 64,
  md: 160,
  lg: 480,
};

// TODO: Convert to NgOptimizedImage
@Component({
  selector: 'ec-product-image',
  standalone: true,
  imports: [NgOptimizedImage],
  template:
    '<img [src]="source()" [width]="width()" [height]="width()" [alt]="altText()" draggable="false" />',
  styleUrl: './product-image.component.scss',
})
export class ProductImageComponent {
  /**
   * Uses the first image of the product as a source.
   * Overrides 'src', if provided.
   */
  product = input<Product | null>(null);

  /**
   * Static image source.
   */
  src = input<string>('');

  /**
   * Overrides the default alt (Product name or the default text).
   */
  alt = input<string>('');

  size = input<ImageSize>('sm');

  width = computed(() => SIZE_TO_WIDTH[this.size()]);

  // We apply the width to the image source as a query parameter (w=SIZE).
  // Modify as desired and according to your image CDN.
  //
  // NOTE: The image mocks that we use are not resized accordingly
  // (i.e. the query parameter is not doing anything).
  source = computed(() => {
    const src = this.product() ? this.product()?.images.first() : this.src();
    return `${src}?w=${this.width()}`;
  });

  altText = computed(() => {
    if (this.alt()) {
      return this.alt();
    }
    if (this.product()) {
      return this.product()?.name || DEFAULT_ALT;
    }
    return DEFAULT_ALT;
  });
}
