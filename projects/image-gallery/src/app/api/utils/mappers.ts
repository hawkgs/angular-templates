import { List } from 'immutable';
import { ImageConfig } from '../../shared/image-config';
import { ApiImage } from './api-types';

// TBD
export const mapImages = (c: ApiImage[]): List<ImageConfig> => List(c);
