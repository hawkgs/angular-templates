import { Injectable, inject, signal } from '@angular/core';
import { List } from 'immutable';

import { ImageConfig } from '../../shared/image-config';
import { ImagesApi } from '../../api/images-api.service';

@Injectable()
export class ImagesService {
  private _imageApi = inject(ImagesApi);

  private _images = signal<List<ImageConfig>>(List([]));
  value = this._images.asReadonly();

  // TBD
  async loadImages() {
    const imgs = await this._imageApi.getImages();
    this._images.update((list) => list.concat(imgs));
  }
}
