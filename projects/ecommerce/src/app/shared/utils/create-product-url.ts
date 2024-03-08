import { Product } from '../../state/models';

/**
 * Create a Product URL (Angular route array).
 *
 * @param p Product
 * @returns An Angular route
 */
export const createProductUrl = (p: Product): string[] => [
  'products',
  p.id,
  p.name
    .toLowerCase()
    .replace(/[^\w\s.]/g, '')
    .replace(/\s/g, '-'),
];
