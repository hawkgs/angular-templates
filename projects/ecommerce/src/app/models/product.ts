import { List, Record } from 'immutable';

/**
 * Product Parameter
 */

interface ProductParameterConfig {
  name: string;
  value: string;
}

/**
 * Product
 */

interface ProductConfig {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  price: number;
  discountPrice: number;
  availableQuantity: number;
  parameters: List<Record<ProductParameterConfig>>;
}

const productRecord = Record<ProductConfig>({
  id: '',
  name: '',
  description: '',
  category: '',
  image: '',
  price: 0,
  discountPrice: 0,
  availableQuantity: 0,
  parameters: List([]),
});

export class Product extends productRecord {
  constructor(config: Partial<ProductConfig>) {
    super(config);
  }
}
