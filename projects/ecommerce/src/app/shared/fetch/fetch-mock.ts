// Represents a Fetch API mock.
// Change the provider in app.component.ts
// in order to use the native fetch.

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
    response = [
      {
        id: '1',
        name: 'Tshirt',
        category: 'clothes',
        image: 'https://i.imgur.com/QkIa5tT.jpeg',
      },
      {
        id: '2',
        name: 'Sweatshirt',
        category: 'clothes',
        image: 'https://i.imgur.com/cSytoSD.jpeg',
      },
      {
        id: '3',
        name: 'Sofa',
        category: 'furniture',
        image: 'https://i.imgur.com/Qphac99.jpeg',
      },
    ];
  }

  return simulateRequest(response, init?.signal);
}
