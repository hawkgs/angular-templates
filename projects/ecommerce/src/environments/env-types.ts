// Common environment variables
export interface CommonEnv {
  currency: 'usd' | 'eur';
  productsListPageSize: number;
}

// Configuration-specific environment variables
export interface Environment extends CommonEnv {
  apiUrl: string;
}
