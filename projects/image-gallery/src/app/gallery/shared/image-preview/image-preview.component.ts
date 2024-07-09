import {
  Component,
  HostListener,
  Renderer2,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CommonModule, Location, NgOptimizedImage } from '@angular/common';
import { MODAL_DATA, ModalController } from '@ngx-templates/shared/modal';
import { IconComponent } from '@ngx-templates/shared/icon';
import { toSignal } from '@angular/core/rxjs-interop';
import { Image } from '../../../shared/image';
import { ImagesService } from '../../../shared/images.service';

const IMG_MAX_WIDTH = '70vw';
const IMG_MAX_HEIGHT = '90vh';
const ANIM_DURATION = 250;

type AnimationType = 'none' | 'slide-left' | 'slide-right';

export type ImagePreviewData = {
  imageId: string;
};

@Component({
  selector: 'ig-image-preview',
  standalone: true,
  imports: [CommonModule, IconComponent, NgOptimizedImage],
  templateUrl: './image-preview.component.html',
  styleUrl: './image-preview.component.scss',
})
export class ImagePreviewComponent {
  data = inject<ImagePreviewData>(MODAL_DATA);
  ctrl = inject<ModalController<void>>(ModalController);
  private _router = inject(Router);
  private _location = inject(Location);
  private _renderer = inject(Renderer2);
  private _images = inject(ImagesService);

  id = signal<string>(this.data.imageId);
  animation = signal<AnimationType>('none');
  showImage = signal<boolean>(true);

  image = computed<Image>(() => this._images.value().get(this.id())!);
  isFirst = computed(() => this._images.value().first()?.id === this.id());
  isLast = computed(() => this._images.value().last()?.id === this.id());

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
    if (this.isLast()) {
      return;
    }

    this._animate('slide-left', async () => {
      if (!this.isLast()) {
        const seq = this._images.value().toIndexedSeq();
        const idx = seq.findIndex((img) => img.id === this.id());
        const nextId = seq.get(idx + 1)!.id;
        await this._images.loadImage(nextId);

        this.id.set(nextId);
        this._location.go('img/' + this.id());
      }
    });
  }

  @HostListener('document:keydown.arrowleft')
  previewPrev() {
    if (this.isFirst()) {
      return;
    }

    this._animate('slide-right', async () => {
      if (!this.isFirst()) {
        const seq = this._images.value().toIndexedSeq();
        const idx = seq.findIndex((img) => img.id === this.id());
        const nextId = seq.get(idx - 1)!.id;
        await this._images.loadImage(nextId);

        this._location.go('img/' + this.id());
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
      completedCb();

      // Prevents flasging of the old image
      // and properly resets the source.
      this.showImage.set(false);
      setTimeout(() => {
        this.showImage.set(true);
        this.animation.set('none');
      });
    }, ANIM_DURATION);
  }
}
