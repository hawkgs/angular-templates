import { List } from 'immutable';
import { Product, ProductParameter } from '../models';
import { ApiProduct } from './api-types';

// Mappers add an aditional layer between the API call and the state update.
// They convert the external API response types to the internal immutable models.

export const mapProduct = (p: ApiProduct): Product =>
  new Product({
    id: p.id,
    name: p.name,
    description: p.description,
    category: p.category,
    image: p.image,
    price: p.price,
    discountPrice: p.discount_price,
    availableQuantity: p.available_quantity,
    parameters: List(
      (p.parameters || []).map(
        (pm) =>
          new ProductParameter({
            name: pm.name,
            value: pm.value,
          }),
      ),
    ),
  });

export const mapProducts = (products: ApiProduct[]): List<Product> =>
  List(products.map((p) => mapProduct(p)));
