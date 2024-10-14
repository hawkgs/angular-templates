import { Provider } from '@angular/core';

const DEFAULT_DELAY = 2000;
const LOREM_IPSUM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

interface IGeminiApi {
  generateChatName(userQuery: string): Promise<string>;
  generateQueryResponse(userQuery: string): Promise<string>;
}

/**
 * Gemini API
 */
export class GeminiApi implements IGeminiApi {
  generateChatName(userQuery: string): Promise<string> {
    return Promise.resolve('TBD Name');
  }

  generateQueryResponse(userQuery: string): Promise<string> {
    return Promise.resolve('TBD Query');
  }
}

/**
 * Gemini API Mock
 */
class GeminiApiMock implements IGeminiApi {
  constructor(private _delay: number) {}

  generateChatName(_: string): Promise<string> {
    return this._delayResponse('Lorem Ipsum ' + Math.round(Math.random() * 10));
  }

  generateQueryResponse(_: string): Promise<string> {
    return this._delayResponse(LOREM_IPSUM);
  }

  private _delayResponse(response: string) {
    return new Promise<string>((res) =>
      setTimeout(() => res(response), this._delay),
    );
  }
}

export const provideGeminiApi = (config: {
  mockedData: boolean;
  delay?: number;
}): Provider => ({
  provide: GeminiApi,
  useValue: !config.mockedData
    ? new GeminiApi()
    : new GeminiApiMock(config.delay || DEFAULT_DELAY),
});
