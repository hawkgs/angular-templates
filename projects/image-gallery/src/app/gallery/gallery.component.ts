import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { List } from 'immutable';
import { ModalService } from '@ngx-templates/shared/modal';

import { ImageGridComponent } from './shared/image-grid/image-grid.component';
import { IMAGES } from './shared/images';
import { ImageConfig } from './shared/types';
import {
  ImagePreviewComponent,
  ImagePreviewData,
} from './shared/image-preview/image-preview.component';
import { Location } from '@angular/common';

const IMG_CFGS = IMAGES.map((ar, i) => ({
  src: 'test-image.jpg?id=' + i,
  aspectRatio: ar,
  idx: i,
  priority: i <= 12,
}));

@Component({
  selector: 'ig-gallery',
  standalone: true,
  imports: [ImageGridComponent],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
})
export class GalleryComponent {
  private _modals = inject(ModalService);
  private _route = inject(ActivatedRoute);
  private _location = inject(Location);

  images = signal<List<ImageConfig>>(List(IMG_CFGS));

  constructor() {
    const idx = parseInt(this._route.snapshot.paramMap.get('idx') || '', 10);

    if (!isNaN(idx) && this.images().get(idx)) {
      this._openImage(idx);
    }
  }

  onImageClick(cfg: ImageConfig) {
    const imageIdx = this.images().findIndex((c) => c === cfg);

    this._location.go('img/' + imageIdx);
    this._openImage(imageIdx);
  }

  private _openImage(imageIdx: number) {
    this._modals
      .createModal<ImagePreviewData>(
        ImagePreviewComponent,
        { imageIdx, images: this.images.asReadonly() },
        {
          modalWindowUi: false,
        },
      )
      .closed.then(() => {
        this._location.go('/');
      });
  }
}
