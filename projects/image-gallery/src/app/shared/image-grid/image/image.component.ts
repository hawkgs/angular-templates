import { Component, computed, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

// Note(Georgi): Temp. Testing purposes
export type ImageConfig = {
  idx: number;
  aspectRatio: [number, number];
  priority?: boolean;
};

@Component({
  selector: 'ig-image',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './image.component.html',
  styleUrl: './image.component.scss',
})
export class ImageComponent {
  config = input.required<ImageConfig>();

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
