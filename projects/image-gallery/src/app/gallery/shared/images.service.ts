import { Injectable, inject, signal } from '@angular/core';
import { List } from 'immutable';

import { ImagesApi } from '../../api/images-api.service';
import { Image } from '../../shared/image';
import { environment } from '../../../environments/environment';

@Injectable()
export class ImagesService {
  private _imageApi = inject(ImagesApi);

  private _isComplete = signal<boolean>(false);
  private _images = signal<List<Image>>(List([]));
  private _page = 1;

  value = this._images.asReadonly();
  isComplete = this._isComplete.asReadonly();

  async loadImages() {
    const imgs = await this._imageApi.getImages({
      page: this._page,
    });

    this._isComplete.set(imgs.size < environment.imagesListPageSize);
    this._images.update((list) => list.concat(imgs));
    this._page++;
  }
}
