// Represents a Fetch API mock.
// Change the provider in app.component.ts
// in order to use the native fetch.

import Data from '../../../assets/mock-data/data.json';

const REQUEST_DELAY = 500;

// A delayed promise response
const simulateRequest = (
  jsonData: object,
  abortSignal?: AbortSignal | null,
): Promise<Response> => {
  let timeout: ReturnType<typeof setTimeout>;

  // Abort the request if a signal is provided
  abortSignal?.addEventListener('abort', () => {
    clearTimeout(timeout);
  });

  return new Promise((res) => {
    timeout = setTimeout(() => {
      res({
        json: () => Promise.resolve(jsonData),
      } as Response);
    }, REQUEST_DELAY);
  });
};

export function fetchMock(url: string, init?: RequestInit): Promise<Response> {
  let response = {};

  if (url.endsWith('products')) {
    response = Data.products;
  }

  if (url.endsWith('categories')) {
    response = Data.categories;
  }

  return simulateRequest(response, init?.signal);
}
