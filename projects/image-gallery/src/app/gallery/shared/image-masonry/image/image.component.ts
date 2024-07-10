import { Component, computed, input, output } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Image } from '../../../../shared/image';

const THUMB_WIDTH = 300;

@Component({
  selector: 'ig-image',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './image.component.html',
  styleUrl: './image.component.scss',
})
export class ImageComponent {
  image = input.required<Image>();
  index = input.required<number>();
  priority = input<boolean>(false);
  imageClick = output<{ index: number }>();

  src = computed(() => {
    const src = this.image().src.split('.').shift();

    if (!src) {
      return this.image().src;
    }
    return src + '-' + THUMB_WIDTH + 'w.webp';
  });

  size = computed(() => ({
    width: THUMB_WIDTH,
    height: THUMB_WIDTH * (this.image().height / this.image().width),
  }));

  metadata = computed(() => this.image().metadata || {});
}
