import Data from '../../../assets/mock-data/data.json';
import { ApiProduct } from '../../api/utils/api-types';

const DEFAULT_PAGE_SIZE = 3;
const DEFAULT_PAGE = 1;

/**
 * Returns mocked data based on a request URL
 *
 * @param url Request URL
 * @returns
 */
export function requestResponseMock(url: string): object {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let response: any = {};

  // Return a list of products
  if (/products\??[\w=\-&]*$/.test(url)) {
    // Do not return the complete data for a product
    let products = Data.products.map(
      (p) =>
        ({
          id: p.id,
          name: p.name,
          price: p.price,
          discount_price: p.discount_price,
          available_quantity: p.available_quantity,
          category_id: p.category_id,
          images: [p.images[0]],
        } as ApiProduct),
    );
    const queryParamsStr = url.split('?').pop();

    // Filter by the provided query params, if any
    const queryParams: { [key: string]: string } = queryParamsStr
      ? queryParamsStr
          .split('&')
          .map((pair) => pair.split('='))
          .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {})
      : {};

    if (queryParams['categoryId']) {
      products = products.filter(
        (p) => p.category_id === queryParams['categoryId'],
      );
    }

    const page = ~~queryParams['page'] || DEFAULT_PAGE;
    const pageSize = ~~queryParams['pageSize'] || DEFAULT_PAGE_SIZE;
    const idx = (page - 1) * pageSize;

    products = products.slice(idx, idx + pageSize);

    response = products;
  }

  // Return a single product (with complete data)
  if (/products\/[0-9]+/.test(url)) {
    const id = url.split('/').pop();
    response = Data.products.find((p) => p.id === id);
  }

  // Return all categories
  if (url.endsWith('categories')) {
    response = Data.categories;
  }

  return response;
}
