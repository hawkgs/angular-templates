import { Component, HostBinding, computed, input } from '@angular/core';
import { Product } from '../../../models';
import {
  IMAGE_LOADER,
  ImageLoaderConfig,
  NgOptimizedImage,
} from '@angular/common';
import { environment } from '../../../environments/environment';
import { IconComponent } from '../icon/icon.component';

type ImageSize = 'xs' | 'sm' | 'md' | 'lg';

const DEFAULT_ALT = 'Product Image';
const SIZE_TO_WIDTH: { [key in ImageSize]: number } = {
  xs: 32,
  sm: 64,
  md: 160,
  lg: 480,
};

// The current provider is set to work with the mocked images.
//
// Use the default `provideImgixLoader`, if your CDN uses
// the standard `?w={size}` query paramter sizing query.
const imageLoaderProvider = {
  provide: IMAGE_LOADER,
  useValue: (config: ImageLoaderConfig) => {
    let src = '';
    if (!config.width) {
      src = config.src;
    } else {
      const [path, extension] = config.src.split('.');
      src = `${path}-${config.width}w.${extension}`;
    }

    src = config.src; // temp

    return environment.imageCdnUrl + src;
  },
};

@Component({
  selector: 'ec-product-image',
  standalone: true,
  imports: [NgOptimizedImage, IconComponent],
  providers: [imageLoaderProvider],
  templateUrl: './product-image.component.html',
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

  /**
   * Fixed image size
   */
  size = input<ImageSize>('sm');

  /**
   * Use if the img is the LCP element.
   */
  priority = input<boolean>(false);

  width = computed(() => SIZE_TO_WIDTH[this.size()]);

  source = computed<string>(
    () => (this.product() ? this.product()?.images.first() : this.src()) || '',
  );

  altText = computed(() => {
    if (this.alt()) {
      return this.alt();
    }
    if (this.product()) {
      return this.product()?.name || DEFAULT_ALT;
    }
    return DEFAULT_ALT;
  });

  @HostBinding('style.width')
  @HostBinding('style.height')
  get imgSize() {
    // Since settings a fixed width and height is required
    // by NgOptimizedImage in order to get an automatically
    // generated `srcset` with different scaled versions of
    // the image, we use `--img-size` if we need to resize
    // the container via CSS.
    return `var(--img-size, ${this.width()}px)`;
  }
}
