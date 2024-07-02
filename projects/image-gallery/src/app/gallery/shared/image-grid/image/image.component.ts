import { Component, input, output } from '@angular/core';
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
}
