import { Record } from 'immutable';

interface CategoryConfig {
  id: string;
  name: string;
}

const categoryRecord = Record<CategoryConfig>({
  id: '',
  name: '',
});

export class Category extends categoryRecord {
  constructor(config: Partial<CategoryConfig>) {
    super(config);
  }
}
