import { inject } from '@angular/core';
import { ProductsService } from '../../data-access/products.service';
import { ActivatedRouteSnapshot, CanActivateFn } from '@angular/router';
import { LoaderService } from '../../shared/loader.service';

/**
 * Product details route guard – attempt loading the product by the ID param
 */
export const canActivateProductDetails: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
): Promise<boolean> => {
  const products = inject(ProductsService);
  const loader = inject(LoaderService);
  const id = route.paramMap.get('id');

  if (!id) {
    return false;
  }

  // If the product is not in the state,
  // perform an API call.
  if (!products.value().has(id)) {
    loader.showLoader();
    await products.loadProduct(id);
    loader.hideLoader();

    // Check again if the ID exists after the request.
    return products.value().has(id);
  }

  return true;
};
