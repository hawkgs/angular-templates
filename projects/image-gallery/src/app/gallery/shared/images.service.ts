import { Injectable, inject, signal } from '@angular/core';
import { List } from 'immutable';

import { ImagesApi } from '../../api/images-api.service';
import { Image } from '../../shared/image';

@Injectable()
export class ImagesService {
  private _imageApi = inject(ImagesApi);

  private _images = signal<List<Image>>(List([]));
  value = this._images.asReadonly();

  // TBD
  async loadImages() {
    const imgs = await this._imageApi.getImages();
    this._images.update((list) => list.concat(imgs));
  }
}
