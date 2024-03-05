import { List, Record } from 'immutable';

/**
 * Product Parameter
 */

interface ProductParameterConfig {
  name: string;
  value: string;
}

const productParameterRecord = Record<ProductParameterConfig>({
  name: '',
  value: '',
});

export class ProductParameter extends productParameterRecord {
  constructor(config: ProductParameterConfig) {
    super(config);
  }
}

/**
 * Product
 */

// Note(Georgi): Think about a "isComplete" flag
interface ProductConfig {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  images: List<string>;
  price: number;
  discountPrice: number;
  availableQuantity: number;
  parameters: List<ProductParameter>;
}

const productRecord = Record<ProductConfig>({
  id: '',
  name: '',
  description: '',
  categoryId: '',
  images: List([]),
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
