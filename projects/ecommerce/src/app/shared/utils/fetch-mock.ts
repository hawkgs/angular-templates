// Represents a Fetch API mock created
// purely for demo purposes.
//
// Change the provider in app.component.ts
// in order to use the native fetch.
//
// The mock, along with the mock data in /assets, can be
// safely deleted afterwards.

import { requestResponseMock } from './request-response-mock';

const REQUEST_DELAY = 200;
const LOGGING_ENABLED = true;

// Used for logging the operation in the console
const log = (msg: string, obj?: object) => {
  if (LOGGING_ENABLED) {
    console.info('Fetch API Mock:', msg, obj || '');
  }
};

// A delayed promise response
function simulateRequest(
  jsonData: object,
  abortSignal?: AbortSignal | null,
): Promise<Response> {
  let timeout: ReturnType<typeof setTimeout>;
  let rejector: (r: Response) => void = () => {};
  let completed = false;

  // Abort the request if a signal is provided
  abortSignal?.addEventListener('abort', () => {
    if (!completed) {
      log('Request aborted');

      clearTimeout(timeout);
      rejector({ ok: false } as Response);
    }
  });

  return new Promise((res, rej) => {
    rejector = rej;

    timeout = setTimeout(() => {
      log('Responding with data', jsonData);
      completed = true;

      res({
        ok: true,
        json: () => Promise.resolve(jsonData),
      } as Response);
    }, REQUEST_DELAY);
  });
}

/**
 * Fetch API Mock
 *
 * @param url
 * @param init
 * @returns
 */
export function fetchMock(url: string, init?: RequestInit): Promise<Response> {
  log('Executing request ' + url);

  return simulateRequest(requestResponseMock(url), init?.signal);
}
