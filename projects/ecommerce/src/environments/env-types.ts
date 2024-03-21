// Common environment variables
export interface CommonEnv {
  currency: 'USD' | 'EUR';
  productsListPageSize: number;
  shippingCost: number; // Currently, the shipping cost is fixed
  taxPercentage: number;
  toastDefaultTtl: number;
}

// Configuration-specific environment variables
export interface Environment extends CommonEnv {
  apiUrl: string;
}
