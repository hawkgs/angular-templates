import { TestBed } from '@angular/core/testing';
import { fetchMockApiProvider } from '../shared/fetch';
import { CategoriesService } from './categories.service';

describe('CategoriesService', () => {
  let categoriesService: CategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [fetchMockApiProvider, CategoriesService],
    });

    categoriesService = TestBed.inject(CategoriesService);
  });

  it('should load categories', async () => {
    await categoriesService.loadCategories();

    expect(categoriesService.categoriesList().size).toBeGreaterThan(0);
  });
});
