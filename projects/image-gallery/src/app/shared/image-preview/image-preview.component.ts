import { Component, Signal, computed, inject, signal } from '@angular/core';
import { MODAL_DATA } from '@ngx-templates/shared/modal';
import { ImageConfig } from '../types';
import { List } from 'immutable';
import { CommonModule } from '@angular/common';

const IMG_MAX_WIDTH = '70vw';
const IMG_MAX_HEIGHT = '90vh';
const ANIM_DURATION = 300;
const ANIM_DELAY = 50;

type AnimationType = 'none' | 'slide-left' | 'slide-right';

export type ImagePreviewData = {
  imageIdx: number;
  images: Signal<List<ImageConfig>>;
};

@Component({
  selector: 'ig-image-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-preview.component.html',
  styleUrl: './image-preview.component.scss',
})
export class ImagePreviewComponent {
  data = inject<ImagePreviewData>(MODAL_DATA);
  idx = signal<number>(this.data.imageIdx);
  animation = signal<AnimationType>('none');
  image = computed<ImageConfig>(() => this.data.images().get(this.idx())!);

  IMG_MAX_WIDTH = IMG_MAX_WIDTH;
  IMG_MAX_HEIGHT = IMG_MAX_HEIGHT;
  ANIM_DURATION = ANIM_DURATION;

  // tmp
  aspectRatioStr = computed(
    () => this.image().aspectRatio[0] + '/' + this.image().aspectRatio[1],
  );

  aspectRatio = computed(
    () => this.image().aspectRatio[0] / this.image().aspectRatio[1],
  );

  previewNext() {
    this.animation.set('slide-left');

    setTimeout(() => {
      this.animation.set('none');
      this.idx.update((idx) => idx + 1);
    }, ANIM_DURATION + ANIM_DELAY);
  }

  previewPrev() {
    this.animation.set('slide-right');

    setTimeout(() => {
      this.animation.set('none');
      this.idx.update((idx) => idx - 1);
    }, ANIM_DURATION + ANIM_DELAY);
  }
}
