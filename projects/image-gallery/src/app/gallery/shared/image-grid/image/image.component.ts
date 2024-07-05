import { Component, computed, input, output } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Image } from '../../../../shared/image';

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

  metadata = computed(() => this.image().metadata || {});
}
