import { Component, Signal, computed, inject, signal } from '@angular/core';
import { MODAL_DATA } from '@ngx-templates/shared/modal';
import { ImageConfig } from '../types';
import { List } from 'immutable';

const IMG_MAX_WIDTH = '70vw';
const IMG_MAX_HEIGHT = '90vh';

export type ImagePreviewData = {
  imageIdx: number;
  images: Signal<List<ImageConfig>>;
};

@Component({
  selector: 'ig-image-preview',
  standalone: true,
  imports: [],
  templateUrl: './image-preview.component.html',
  styleUrl: './image-preview.component.scss',
})
export class ImagePreviewComponent {
  data = inject<ImagePreviewData>(MODAL_DATA);
  idx = signal<number>(this.data.imageIdx);
  image = computed<ImageConfig>(() => this.data.images().get(this.idx())!);

  IMG_MAX_WIDTH = IMG_MAX_WIDTH;
  IMG_MAX_HEIGHT = IMG_MAX_HEIGHT;

  // tmp
  aspectRatioStr = computed(
    () => this.image().aspectRatio[0] + '/' + this.image().aspectRatio[1],
  );

  aspectRatio = computed(
    () => this.image().aspectRatio[0] / this.image().aspectRatio[1],
  );

  previewNext() {
    this.idx.update((idx) => idx + 1);
  }

  previewPrev() {
    this.idx.update((idx) => idx - 1);
  }
}
