import { Injectable, inject, signal } from '@angular/core';
import { OrderedMap } from 'immutable';

import { ImagesApi } from '../api/images-api.service';
import { Image } from './image';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ImagesService {
  private _imageApi = inject(ImagesApi);

  private _isComplete = signal<boolean>(false);
  private _images = signal<OrderedMap<string, Image>>(OrderedMap([]));
  private _totalSize = signal<number>(0);
  private _page = 1;

  value = this._images.asReadonly();
  totalSize = this._totalSize.asReadonly();
  isComplete = this._isComplete.asReadonly();

  async loadImage(id: string): Promise<void> {
    if (!this._images().has(id)) {
      const img = await this._imageApi.getImage(id);
      this._images.update((map) => map.set(img.id, img));
    }
  }

  async loadImages(): Promise<void> {
    const { images, total } = await this._imageApi.getImages({
      page: this._page,
    });

    this._isComplete.set(images.size < environment.imagesListPageSize);
    this._totalSize.set(total);
    this._images.update((map) => {
      images.forEach((img) => {
        map = map.set(img.id, img);
      });
      return map;
    });
    this._page++;
  }
}
