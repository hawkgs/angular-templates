import { ApiImage } from '../../api/utils/api-types';

const IMAGES: ApiImage[] = [
  {
    src: 'images/img-1.jpg',
    width: 6000,
    height: 4000,
    metadata: {
      name: 'Flower',
    },
  },
  {
    src: 'images/img-2.jpg',
    width: 7087,
    height: 4724,
    metadata: {
      name: 'Desert',
    },
  },
  {
    src: 'images/img-3.jpg',
    width: 5842,
    height: 3895,
  },
  {
    src: 'images/img-4.jpg',
    width: 5568,
    height: 3712,
    metadata: {
      name: 'Bridge',
    },
  },
  {
    src: 'images/img-5.jpg',
    width: 5500,
    height: 3668,
    metadata: {
      name: 'Landscape',
    },
  },
  {
    src: 'images/img-6.jpg',
    width: 3827,
    height: 5657,
    metadata: {
      name: 'Cliffs',
    },
  },
];

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
  const paramsStr = url.split('?').pop();

  const params: { [key: string]: string } = paramsStr
    ? paramsStr
        .split('&')
        .map((pair) => pair.split('='))
        .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {})
    : {};

  if (/images\??[\w,=\-\\+&]*$/.test(url)) {
    const page = ~~params['page'] || DEFAULT_PAGE;
    const pageSize = ~~params['pageSize'] || DEFAULT_PAGE_SIZE;
    const idx = (page - 1) * pageSize;

    response = {
      total: IMAGES.length,
      images: IMAGES.slice(idx, idx + pageSize),
    };
  }

  if (/image\/[0-9]+/.test(url)) {
    const idx = parseInt(url.split('/').pop() || '', 10);

    if (!isNaN(idx)) {
      const img = IMAGES[idx];
      response = img;
    }
  }

  return response;
}
