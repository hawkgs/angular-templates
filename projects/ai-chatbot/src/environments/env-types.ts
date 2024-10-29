// Common environment variables
export interface CommonEnv {
  chatPageSize: number;
}

// Configuration-specific environment variables
export interface Environment extends CommonEnv {
  apiUrl: string;
}
