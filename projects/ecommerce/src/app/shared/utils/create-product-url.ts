import { Product } from '../../state/models';

export const createProductUrl = (p: Product): string[] => [
  'products',
  p.id,
  p.name
    .toLowerCase()
    .replace(/[^\w\s.]/g, '')
    .replace(/\s/g, '-'),
];
