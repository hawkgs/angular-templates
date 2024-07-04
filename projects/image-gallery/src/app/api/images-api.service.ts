import { Injectable, inject } from '@angular/core';
import { List } from 'immutable';
import { FETCH_API } from '@ngx-templates/shared/fetch';
import { buildQueryParamsString } from '@ngx-templates/shared/utils';

import { environment } from '../../environments/environment';
import { mapImages } from './utils/mappers';
import { ImageConfig } from '../shared/image-config';

export type GetImagesParams = Partial<{
  pageSize: number;
  page: number;
}>;

// NOTE: An error handling mechanism is not implemented.
@Injectable({ providedIn: 'root' })
export class ImagesApi {
  private _fetch = inject(FETCH_API);

  /**
   * Fetches images
   *
   * @returns An images list that matches the given criteria
   */
  async getImages(params?: GetImagesParams): Promise<List<ImageConfig>> {
    const queryParams = buildQueryParamsString({
      pageSize: environment.imagesListPageSize,
      ...params,
    } as GetImagesParams);

    const response = await this._fetch(
      `${environment.apiUrl}/images${queryParams}`,
    );
    const json = await response.json();

    return mapImages(json);
  }
}
