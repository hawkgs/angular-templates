import { TestBed } from '@angular/core/testing';
import { Category } from '../../models';
import { CategoriesApi } from './categories-api.service';
import { fetchMockApiProvider } from '../shared/fetch';

describe('CategoriesApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [fetchMockApiProvider, CategoriesApi],
    });
  });

  it('should fetch categories', async () => {
    const categoriesApi = TestBed.inject(CategoriesApi);
    const categories = await categoriesApi.getCategories();

    expect(categories.size).toBeGreaterThan(0);
    expect(
      categories
        .map((p) => p instanceof Category)
        .reduce((p, c) => p && c, true),
    ).toBeTruthy();
  });
});
