// Common environment variables
export interface CommonEnv {
  currency: 'USD' | 'EUR';
  productsListPageSize: number;
}

// Configuration-specific environment variables
export interface Environment extends CommonEnv {
  apiUrl: string;
}
