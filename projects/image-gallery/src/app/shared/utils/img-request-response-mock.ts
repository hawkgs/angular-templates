import { ApiImage } from '../../api/utils/api-types';

// Note(Georgi): Temp
export const IMAGES: [number, number][] = [
  [4, 3],
  [1, 1],
  [4, 3],
  [3, 2],
  [1, 1],
  [4, 3],
  [1, 1],
  [3, 2],
  [3, 4],
  [3, 2],
  [1, 1],
  [3, 2],
  [4, 5],
  [16, 9],
  [4, 3],
  [4, 5],
  [3, 4],
  [3, 4],
  [16, 9],
  [3, 4],
  [16, 9],
  [4, 5],
  [3, 2],
  [4, 5],
  [16, 9],
];

const IMG_CFGS: ApiImage[] = IMAGES.map((ar, i) => ({
  src: 'test-image.jpg?id=' + i,
  width: ar[0] * 100,
  height: ar[1] * 100,
  metadata: { name: 'Test Image', 'Focal Length': '50mm', Aperture: 'f/1.8' },
}));

/**
 * Returns mocked data based on a request URL
 *
 * @param url Request URL
 * @returns
 */
export function imgGalleryRequestResponseMock(url: string): object {
  return IMG_CFGS;
}
