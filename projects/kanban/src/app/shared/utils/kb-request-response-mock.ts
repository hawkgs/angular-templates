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

  // POST /boards/{id}/lists
  const handleListCreate = (boardId: string, listId: string) => {
    const list = {
      id: listId,
      name: body ? (body['name'] as string) : '',
      cards: [],
      pos: body && body['pos'] ? (body['pos'] as number) : listsCount++,
      boardId,
    };

    Store.board.lists.push(list);

    return list;
  };

  // PUT /boards/{id}/lists/{list_id}
  const handleListUpdate = (_: string, listId: string) => {
    const changes = {
      name: body ? (body['name'] as string) : '',
      pos: body && body['pos'] ? (body['pos'] as number) : listsCount++,
    };

    // WARNING: The code assumes that the ID exists. No handling for missing IDs.
    const idx = Store.board.lists.findIndex((l) => l.id === listId);

    const currentList = Store.board.lists[idx];
    const updatedList = {
      ...changes,
      ...currentList,
    };

    Store.board.lists[idx] = updatedList;

    return updatedList;
  };

  // DELETE /boards/{id}/lists/{list_id}
  const handleListDelete = (boardId: string, listId: string) => {
    // WARNING: The code assumes that the ID exists. No handling for missing IDs.
    const idx = Store.board.lists.findIndex((l) => l.id === listId);

    // TBD
  };

  // GET /boards/{id}
  const handleBoardsGet = () => Store.board; // We have a single board

  // Resource: /boards
  const handleBoards = () => {
    const [, boardId, secondaryResource, secId] = routeParams;

    if (method === 'GET' && !secondaryResource) {
      return handleBoardsGet();
    }

    // Resource: /boards/{id}/lists
    if (secondaryResource === 'lists') {
      switch (method) {
        case 'POST':
          return handleListCreate(boardId, secId);
        case 'PUT':
          return handleListUpdate(boardId, secId);
        case 'DELETE':
          return handleListDelete(boardId, secId);
      }
    }

    return {};
  };

  // GET /cards/{id}
  const handleCardsGet = (cardId: string) => {
    const idx = Store.cards.findIndex((c) => c.id === cardId);

    return Store.cards[idx] || {};
  };

  // POST /cards/{id}
  const handleCardsPost = () => {
    // TBD
  };

  // PUT /cards/{id}
  const handleCardsUpdate = (cardId: string) => {
    // TBD
  };

  // Resource: /cards
  const handleCards = () => {
    const [, cardId] = routeParams;

    switch (method) {
      case 'GET':
        return handleCardsGet(cardId);
      case 'POST':
        return handleCardsPost();
      case 'PUT':
        return handleCardsUpdate(cardId);
    }

    return {};
  };

  // Route handling
  switch (resource) {
    case 'boards':
      response = handleBoards();
      break;
    case 'cards':
      response = handleCards();
      break;
  }

  return response;
};
