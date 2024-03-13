import { inject } from '@angular/core';
import { ProductsService } from '../../data-access/products.service';
import { ActivatedRouteSnapshot, CanActivateFn } from '@angular/router';

/**
 * Product details route guard – attempt loading the product by the ID param
 */
export const canActivateProductDetails: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
): Promise<boolean> => {
  const products = inject(ProductsService);
  const id = route.paramMap.get('id');

  if (!id) {
    return false;
  }

  // If the product is not in the state,
  // perform an API call
  if (!products.value().has(id)) {
    await products.loadProduct(id);
    // Check again
    return products.value().has(id);
  }

  return true;
};
