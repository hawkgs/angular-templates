// Represents a Fetch API mock created
// purely for demo purposes.

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
export const fetchMock =
  (mockFn: (url: string) => object) =>
  (url: string | URL | Request, init?: RequestInit): Promise<Response> => {
    log('Executing request ' + url);

    return simulateRequest(mockFn(url.toString()), init?.signal);
  };
