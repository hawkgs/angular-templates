import {
  Component,
  HostListener,
  Renderer2,
  Signal,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { MODAL_DATA, ModalController } from '@ngx-templates/shared/modal';
import { IconComponent } from '@ngx-templates/shared/icon';
import { toSignal } from '@angular/core/rxjs-interop';
import { List } from 'immutable';
import { Image } from '../../../shared/image';

const IMG_MAX_WIDTH = '70vw';
const IMG_MAX_HEIGHT = '90vh';
const ANIM_DURATION = 250;
const ANIM_DELAY = 20;

type AnimationType = 'none' | 'slide-left' | 'slide-right';

export type ImagePreviewData = {
  imageIdx: number;
  images: Signal<List<Image>>;
};

@Component({
  selector: 'ig-image-preview',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './image-preview.component.html',
  styleUrl: './image-preview.component.scss',
})
export class ImagePreviewComponent {
  data = inject<ImagePreviewData>(MODAL_DATA);
  ctrl = inject<ModalController<void>>(ModalController);
  private _router = inject(Router);
  private _location = inject(Location);
  private _renderer = inject(Renderer2);

  idx = signal<number>(this.data.imageIdx);
  animation = signal<AnimationType>('none');
  image = computed<Image>(() => this.data.images().get(this.idx())!);
  imagesCount = computed(() => this.data.images().size);

  IMG_MAX_WIDTH = IMG_MAX_WIDTH;
  IMG_MAX_HEIGHT = IMG_MAX_HEIGHT;
  ANIM_DURATION = ANIM_DURATION;

  aspectRatio = computed(() => this.image().width / this.image().height);

  constructor() {
    const routerEvents = toSignal(this._router.events);

    effect(() => {
      const event = routerEvents();

      // Todo(Georgi): Handle browser history nav (back and forward)
      if (event instanceof NavigationEnd) {
        console.log('route change');
      }
    });
  }

  @HostListener('document:keydown.arrowright')
  previewNext() {
    if (this.idx() === this.imagesCount() - 1) {
      return;
    }

    this._animate('slide-left', () => {
      if (this.idx() < this.imagesCount() - 1) {
        this.idx.update((idx) => idx + 1);
        this._location.go('img/' + this.idx());
      }
    });
  }

  @HostListener('document:keydown.arrowleft')
  previewPrev() {
    if (this.idx() === 0) {
      return;
    }

    this._animate('slide-right', () => {
      if (this.idx() > 0) {
        this.idx.update((idx) => idx - 1);
        this._location.go('img/' + this.idx());
      }
    });
  }

  download() {
    const anchor = this._renderer.createElement('a') as HTMLAnchorElement;
    this._renderer.setAttribute(anchor, 'href', this.image().src);
    this._renderer.setAttribute(anchor, 'download', '');
    anchor.click();
  }

  private _animate(
    anim: 'slide-left' | 'slide-right',
    completedCb: () => void,
  ) {
    this.animation.set(anim);

    setTimeout(() => {
      this.animation.set('none');
      completedCb();
    }, ANIM_DURATION + ANIM_DELAY);
  }
}
