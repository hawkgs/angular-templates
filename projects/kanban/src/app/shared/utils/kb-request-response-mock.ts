import { MockFn } from '@ngx-templates/shared/fetch';

import MockData from '../../../../public/mock-data.json';
import { environment } from '../../../environments/environment';
import { ApiBoardDataResponse, ApiCard } from '../../api/utils/api-types';

type MockData = {
  board: ApiBoardDataResponse;
  cards: ApiCard[];
};

const Store = MockData as MockData;

let listsCount = Store.board.lists.length;

/**
 * Returns mocked data based on a request URL
 *
 * @param url Request URL
 * @returns
 */
export const kanbanRequestResponseMock: MockFn = (
  url: string,
  method?: string,
  body?: { [key: string]: string | number },
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let response: any = {};
  const routeParams = url.replace(environment.apiUrl + '/', '').split('/');
  const resource = routeParams[0];

  // Boards resource
  if (resource === 'boards') {
    const [, boardId, secondaryResource, secId] = routeParams;

    // Boards data
    if (!secondaryResource) {
      response = Store.board;
    }

    // Lists resource – create and update
    if (
      secondaryResource === 'lists' &&
      (method === 'POST' || method === 'PUT')
    ) {
      const list = {
        id: secId,
        name: body ? (body['name'] as string) : '',
        cards: [],
        idx: body && body['idx'] ? (body['idx'] as number) : listsCount++,
        boardId,
      };

      const idx = Store.board.lists.findIndex((l) => l.id === secId);
      if (idx > -1) {
        Store.board.lists[idx] = list;
      } else {
        Store.board.lists.push(list);
      }

      response = list;
    }
  }

  // Cards resource
  if (resource === 'cards') {
    const [, cardId] = routeParams;
    const idx = Store.cards.findIndex((c) => c.id === cardId);

    let card = {};
    if (idx > -1) {
      card = Store.cards[idx];
    }

    if (method === 'GET') {
      response = card;

      // In progress - TBD
    }
  }

  return response;
};
