import { ApiImage } from '../../api/utils/api-types';

// Note(Georgi): Temp
export const ASPECT_RATIOS: [number, number][] = [
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
  [3, 4],
  [16, 9],
  [4, 5],
  [3, 2],
  [4, 5],
  [16, 9],
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
];

const IMAGES: ApiImage[] = ASPECT_RATIOS.map(([x, y], i) => ({
  id: i.toString(),
  src: 'test-image.jpg?id=' + i,
  width: x * 100,
  height: y * 100,
  metadata: {
    name: 'Test Image ' + i,
    'Focal Length': '50mm',
    Aperture: 'f/1.8',
  },
}));

// const IMAGES: ApiImage[] = [
//   {
//     src: 'images/img-1.jpg',
//     width: 6000,
//     height: 4000,
//     metadata: {
//       name: 'Flower',
//     },
//   },
//   {
//     src: 'images/img-2.jpg',
//     width: 7087,
//     height: 4724,
//     metadata: {
//       name: 'Desert',
//     },
//   },
//   {
//     src: 'images/img-3.jpg',
//     width: 5842,
//     height: 3895,
//   },
//   {
//     src: 'images/img-4.jpg',
//     width: 5568,
//     height: 3712,
//     metadata: {
//       name: 'Bridge',
//     },
//   },
//   {
//     src: 'images/img-5.jpg',
//     width: 5500,
//     height: 3668,
//     metadata: {
//       name: 'Landscape',
//     },
//   },
//   {
//     src: 'images/img-6.jpg',
//     width: 3827,
//     height: 5657,
//     metadata: {
//       name: 'Cliffs',
//     },
//   },
// ];

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE = 1;

/**
 * Returns mocked data based on a request URL
 *
 * @param url Request URL
 * @returns
 */
export function imgGalleryRequestResponseMock(url: string): object {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let response: any = {};
  const params: { [key: string]: string } = url
    .split('?')[1]
    .split('&')
    .map((pair) => pair.split('='))
    .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {});

  if (/images\??[\w,=\-\\+&]*$/.test(url)) {
    const page = ~~params['page'] || DEFAULT_PAGE;
    const pageSize = ~~params['pageSize'] || DEFAULT_PAGE_SIZE;
    const idx = (page - 1) * pageSize;

    response = {
      total: IMAGES.length,
      images: IMAGES.slice(idx, idx + pageSize),
    };
  }

  return response;
}
