import { List } from 'immutable';
import { Product } from '../models';
import { ApiProduct } from './api-types';

// Mappers add an aditional layer between the API call and the state update.
// They convert the external API response types to the internal immutable models.

export const mapProduct = (p: ApiProduct): Product =>
  new Product({
    id: p.id,
    name: p.name,
    category: p.category,
    image: p.image,
  });

export const mapProducts = (products: ApiProduct[]): List<Product> =>
  List(products.map((p) => mapProduct(p)));
