import { TestBed } from '@angular/core/testing';
import { fetchMockApiProvider } from '../../../../shared/fetch';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let productsService: ProductsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [fetchMockApiProvider, ProductsService],
    });

    productsService = TestBed.inject(ProductsService);
  });

  it('should load a product', async () => {
    await productsService.loadProduct('6631');

    expect(productsService.value().size).toEqual(1);
    expect(productsService.value().first()?.id).toEqual('6631');
  });
});
