import {
  Component,
  HostListener,
  Signal,
  computed,
  inject,
  signal,
} from '@angular/core';
import { MODAL_DATA } from '@ngx-templates/shared/modal';
import { ImageConfig } from '../types';
import { List } from 'immutable';
import { CommonModule } from '@angular/common';

const IMG_MAX_WIDTH = '70vw';
const IMG_MAX_HEIGHT = '90vh';
const ANIM_DURATION = 250;
const ANIM_DELAY = 20;

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
  imagesCount = computed(() => this.data.images().size);

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

  @HostListener('document:keydown.arrowright')
  previewNext() {
    if (this.idx() === this.imagesCount() - 1) {
      return;
    }

    this.animation.set('slide-left');

    setTimeout(() => {
      this.animation.set('none');

      if (this.idx() < this.imagesCount() - 1) {
        this.idx.update((idx) => idx + 1);
      }
    }, ANIM_DURATION + ANIM_DELAY);
  }

  @HostListener('document:keydown.arrowleft')
  previewPrev() {
    if (this.idx() === 0) {
      return;
    }

    this.animation.set('slide-right');

    setTimeout(() => {
      this.animation.set('none');

      if (this.idx() > 0) {
        this.idx.update((idx) => idx - 1);
      }
    }, ANIM_DURATION + ANIM_DELAY);
  }
}
