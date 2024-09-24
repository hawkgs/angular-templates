import { InjectionToken, Injector, Provider } from '@angular/core';

export type Fetch = (
  input: string | URL | Request,
  init?: RequestInit,
) => Promise<Response>;

export const FETCH_API = new InjectionToken<Fetch>('FETCH_API');

/**
 * Provide Fetch API.
 *
 * @param customImpl Use in case you want to provide your own implementation (e.g. a mock).
 * @returns Fetch `Provider`
 */
export const provideFetchApi = (
  customImpl?: (() => Fetch) | ((injector: Injector) => Fetch),
): Provider => ({
  provide: FETCH_API,
  // We need to bind the native fetch to globalThis since we are in SSR mode
  // or it will throw an "Illegal invocation"
  useFactory: (injector: Injector) =>
    customImpl ? customImpl(injector) : fetch.bind(globalThis),
  deps: [Injector],
});
