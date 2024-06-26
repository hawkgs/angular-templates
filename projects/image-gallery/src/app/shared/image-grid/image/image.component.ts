import { Component, computed, input, output } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ImageConfig } from '../../types';

@Component({
  selector: 'ig-image',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './image.component.html',
  styleUrl: './image.component.scss',
})
export class ImageComponent {
  config = input.required<ImageConfig>();
  imageClick = output<ImageConfig>();

  // tmp
  size = computed(() => ({
    x: this.config().aspectRatio[0] * 100,
    y: this.config().aspectRatio[1] * 100,
  }));

  aspectRatio = computed(() => {
    const [x, y] = this.config().aspectRatio;
    return x + '/' + y;
  });
}
