import { Product } from '../../state/models';

export function createProductUrl(p: Product): string[] {
  return [
    'products',
    p.id,
    p.name
      .toLowerCase()
      .replace(/[^\w\s.]/g, '')
      .replace(/\s/g, '-'),
  ];
}
