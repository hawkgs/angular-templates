// Common environment variables
export interface CommonEnv {
  currency: 'usd' | 'eur';
}

// Configuration-specific environment variables
export interface Environment extends CommonEnv {
  apiUrl: string;
}
