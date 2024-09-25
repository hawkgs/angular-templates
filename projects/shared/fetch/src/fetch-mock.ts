// Represents a Fetch API mock created
// purely for demo purposes.

import { Injector } from '@angular/core';

type LogFn = (msg: string, obj?: object) => void;

// A delayed promise response
function simulateRequest(
  jsonData: object,
  config: FetchMockConfig,
  log: LogFn,
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
      log('Responding with data', jsonData || '<<EMPTY>>');
      completed = true;

      res({
        ok: true,
        json: () => Promise.resolve(jsonData),
      } as Response);
    }, config.requestDelay);
  });
}

/**
 * Fetch Mock configuration object
 */
export type FetchMockConfig = {
  /**
   * Delay of the request response in milliseconds (Default: `200`)
   */
  requestDelay: number;

  /**
   * Print the requests and their responses in the console (Default: `true`)
   */
  logging: boolean;
};

const DEFAULT_CFG: FetchMockConfig = {
  requestDelay: 200,
  logging: true,
};

export interface MockFn {
  (
    url: string,
    method: string,
    body: { [key: string]: string } | null,
    injector: Injector,
  ): object;
}

/**
 * Fetch API Mock
 *
 * @param url
 * @param init
 * @returns
 */
export const withFetchMock = (
  mockFn: MockFn,
  config?: Partial<FetchMockConfig>,
) => {
  const fullCfg: FetchMockConfig = { ...DEFAULT_CFG, ...config };

  // Used for logging the operation in the console
  const log = (msg: string, obj?: object) => {
    if (fullCfg?.logging) {
      console.info('Fetch API Mock:', msg, obj || '');
    }
  };

  return (injector: Injector) =>
    (url: string | URL | Request, options?: RequestInit): Promise<Response> => {
      const method = options?.method || 'GET';

      console.log(''); // Add some spacing in the console
      log(`Executing request ${method} ${url}`);

      const body = options?.body ? JSON.parse(options.body as string) : null;
      if (body) {
        log('Body', body);
      }

      return simulateRequest(
        mockFn(url.toString(), method, body, injector),
        fullCfg,
        log,
        options?.signal,
      );
    };
};
