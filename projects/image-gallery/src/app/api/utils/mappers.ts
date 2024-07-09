import { List } from 'immutable';
import { ApiImage } from './api-types';
import { Image } from '../../shared/image';

export const mapImages = (c: ApiImage[]): List<Image> =>
  List(
    c.map(
      (api) =>
        new Image({
          src: api.src,
          width: api.width,
          height: api.height,
          metadata: api.metadata,
        }),
    ),
  );
