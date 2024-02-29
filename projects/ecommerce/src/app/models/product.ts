import { Record } from 'immutable';

interface ProductConfig {
  id: string;
  name: string;
  image: string;
  category: string;
}

const productRecord = Record<ProductConfig>({
  id: '',
  name: '',
  image: '',
  category: '',
});

export class Product extends productRecord {
  constructor(config: Partial<ProductConfig>) {
    super(config);
  }
}
