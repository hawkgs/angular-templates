import { InjectionToken, Provider } from '@angular/core';

export type Fetch = (
  input: string | URL | Request,
  init?: RequestInit,
) => Promise<Response>;

export const FETCH_API = new InjectionToken<Fetch>('FETCH_API');

export const fetchApiProvider: Provider = {
  provide: FETCH_API,
  // We need to bind the native fetch to globalThis since we are in SSR mode
  // or it will throw an "Illegal invocation"
  useValue: fetch.bind(globalThis),
};
