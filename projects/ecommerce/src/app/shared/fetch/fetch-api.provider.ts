import { InjectionToken, Provider } from '@angular/core';
import { fetchMock } from '../utils/fetch-mock';

export type Fetch = (
  input: string | URL | Request,
  init?: RequestInit,
) => Promise<Response>;

export const FETCH_API = new InjectionToken<Fetch>('FETCH_API');

// Native Fetch API provider
export const fetchApiProvider: Provider = {
  provide: FETCH_API,
  // We need to bind the native fetch to globalThis since we are in SSR mode
  // or it will throw an "Illegal invocation"
  useValue: fetch.bind(globalThis),
};

// This provider injects a Fetch API mock.
// Use "fetchApiProvider", if you want to perform actual
// network requests.
export const fetchMockApiProvider: Provider = {
  provide: FETCH_API,
  useValue: fetchMock,
};
