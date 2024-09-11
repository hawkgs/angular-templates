// Common environment variables
export interface CommonEnv {}

// Configuration-specific environment variables
export interface Environment extends CommonEnv {
  apiUrl: string;
}
