import { Component, computed, input, signal } from '@angular/core';

import { Product } from '../../../../../models';
import { ProductImageComponent } from '../../../../shared/product-image/product-image.component';
import { IconComponent } from '../../../../shared/icon/icon.component';

// TODO: Change
const DEFAULT_IMG = 'img.png';

@Component({
  selector: 'ec-image-gallery',
  standalone: true,
  imports: [ProductImageComponent, IconComponent],
  templateUrl: './image-gallery.component.html',
  styleUrl: './image-gallery.component.scss',
})
export class ImageGalleryComponent {
  product = input.required<Product>();
  selectedImgIdx = signal<number>(0);

  selectedImg = computed(
    () => this.product().images.get(this.selectedImgIdx()) || DEFAULT_IMG,
  );

  switchImage(idx: number) {
    this.selectedImgIdx.set(idx);
  }

  moveImage(move: -1 | 1) {
    const newIdx = this.selectedImgIdx() + move;
    this.selectedImgIdx.set(newIdx);
  }

  isSelected(idx: number) {
    return this.selectedImgIdx() === idx;
  }
}
