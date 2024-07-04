import { Component, computed, input, output } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ExtendedImageConfig } from '../types';

@Component({
  selector: 'ig-image',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './image.component.html',
  styleUrl: './image.component.scss',
})
export class ImageComponent {
  config = input.required<ExtendedImageConfig>();
  priority = input<boolean>(false);
  imageClick = output<{ index: number }>();

  metadata = computed(() => this.config().metadata || {});
}
