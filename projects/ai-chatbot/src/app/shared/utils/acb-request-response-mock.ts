import { Injector } from '@angular/core';
import { FETCH_MOCK_STATE, MockFn } from '@ngx-templates/shared/fetch';
import { environment } from '../../../environments/environment';

const DEFAULT_PAGE_SIZE = 15;
const DEFAULT_PAGE = 1;

type MockStore = {
  chats: Map<
    string,
    {
      id: string;
      name: string;
      createdAt: string;
      updatedAt: string;
      queries: {
        id: string;
        message: string;
        response: string;
        createdAt: string;
      }[];
    }
  >;
};

const DefaultState: MockStore = {
  chats: new Map(),
};

/**
 * Returns mocked data based on a request URL
 *
 * @param url Request URL
 * @returns
 */
export const acbRequestResponseMock: MockFn = (
  url: string,
  method: string,
  body: { [key: string]: string | number } | null,
  injector: Injector,
): object => {
  const store = injector.get<{ state: MockStore | null }>(
    FETCH_MOCK_STATE,
    undefined,
    { optional: true },
  );

  if (!store) {
    throw new Error(
      '[CHAT FETCH MOCK] The mocks uses Fetch state. Please provide it via `provideFetchMockState()` in your app config.',
    );
  }

  // Define store manipulation functions
  const getStore = (): MockStore => {
    if (!store.state) {
      store.state = DefaultState;
    }
    return store.state!;
  };
  const updateStore = (updater: (s: MockStore) => MockStore) => {
    store.state = updater(structuredClone(getStore()));
  };

  const routeParams = url.replace(environment.apiUrl + '/', '').split('/');
  const resource = routeParams[0];

  // GET /chats
  const handleChatsGet = () =>
    Array.from(getStore().chats)
      .map(([_, c]) => ({
        id: c.id,
        name: c.name,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      }))
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );

  // POST /chats
  const handleChatsPost = () => {
    const createdDt = new Date().toISOString();
    const message = (body as { message: string })['message'];

    // Gemini API – temp
    const name = 'Lorem Ipsum';
    const response =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

    const chat = {
      id: 'c' + Date.now().toString(),
      name,
      createdAt: createdDt,
      updatedAt: createdDt,
      queries: [
        {
          id: 'q' + Date.now().toString(),
          message,
          response,
          createdAt: createdDt,
        },
      ],
    };

    updateStore((s) => {
      s.chats.set(chat.id, chat);
      return s;
    });

    return chat;
  };

  // GET /chats/{id}/queries
  const handleQueriesGet = (chatId: string) => {
    const queryParamsStr = url.split('?')[1];
    const queryParams: { [key: string]: string } = queryParamsStr
      ? queryParamsStr
          .split('&')
          .map((pair) => pair.split('='))
          .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {})
      : {};

    const pageSize = ~~queryParams['pageSize'] || DEFAULT_PAGE_SIZE;
    const page = ~~queryParams['page'] || DEFAULT_PAGE;
    const idx = (page - 1) * pageSize;

    return getStore()
      .chats.get(chatId)
      ?.queries.slice(idx, idx + pageSize);
  };

  // POST /chats/{id}/queries
  const handleQueriesPost = (chatId: string) => {
    const message = (body as { message: string })['message'];

    // Gemini API – temp
    const response =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

    const query = {
      id: 'q' + Date.now().toString(),
      message,
      response,
      createdAt: new Date().toISOString(),
    };

    updateStore((s) => {
      const chat = s.chats.get(chatId);
      chat?.queries.unshift(query);
      return s;
    });

    return query;
  };

  // Resource: /chats
  const resourceChats = () => {
    const [, chatId, secondaryResource] = routeParams;

    if (!secondaryResource) {
      switch (method) {
        case 'GET':
          return handleChatsGet();
        case 'POST':
          return handleChatsPost();
      }
    }

    if (secondaryResource === 'queries') {
      switch (method) {
        case 'GET':
          return handleQueriesGet(chatId);
        case 'POST':
          return handleQueriesPost(chatId);
      }
    }

    return {};
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let response: any = {};

  if (resource === 'chats') {
    response = resourceChats();
  }

  return response;
};
