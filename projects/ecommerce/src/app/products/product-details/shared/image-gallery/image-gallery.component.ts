import { Component, OnInit, input, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

import { Product } from '../../../../../models';

const DEFAULT_IMG = 'img.png';

@Component({
  selector: 'ec-image-gallery',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './image-gallery.component.html',
  styleUrl: './image-gallery.component.scss',
})
export class ImageGalleryComponent implements OnInit {
  product = input.required<Product>();
  selectedImg = signal<string>('');

  ngOnInit(): void {
    const img = this.product().images.first() || DEFAULT_IMG;
    this.selectedImg.set(img);
  }

  switchImage(img: string) {
    this.selectedImg.set(img);
  }

  isSelected(img: string) {
    return this.selectedImg() === img;
  }
}
