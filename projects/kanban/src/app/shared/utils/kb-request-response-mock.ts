import { MockFn } from '@ngx-templates/shared/fetch';

import MockData from '../../../../public/mock-data.json';
import { environment } from '../../../environments/environment';
import {
  ApiBoardDataResponse,
  ApiCard,
  ApiRequestCard,
  ApiRequestLabel,
} from '../../api/utils/api-types';

type MockData = {
  board: ApiBoardDataResponse;
  cards: ApiCard[];
};

// Note(Georgi): The cards and lists have specific order/position in their
// respective containers. In Store.cards, this is represented by the `pos`
// property (i.e. the array order is not important). However, in Store.lists and
// Store.lists.cards (small ver of cards) the order of the items in the array is
// crucial since they represent the actual position.
const Store = MockData as MockData;

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
  const routeParams = url.replace(environment.apiUrl + '/', '').split('/');
  const resource = routeParams[0];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).devDbStoreState = () => Store;

  // POST /boards/{id}/lists
  const handleListsCreate = (_: string) => {
    const list = {
      id: 'ls' + Date.now(),
      name: body ? (body['name'] as string) : '',
      cards: [],
    };

    Store.board.lists.push(list);

    return list;
  };

  // PUT /boards/{id}/lists/{list_id}
  const handleListsUpdate = (_: string, listId: string) => {
    const name = body ? (body['name'] as string) : '';
    const pos = body && body['pos'] ? (body['pos'] as number) : -1;

    // WARNING: The code assumes that the ID exists. No handling for missing IDs.
    const idx = Store.board.lists.findIndex((l) => l.id === listId);

    const currentList = Store.board.lists[idx];
    const updatedList = {
      ...currentList,
      ...{ name },
    };

    if (pos === -1) {
      Store.board.lists[idx] = updatedList;
    } else {
      Store.board.lists.splice(currentList.pos!, 1); // Remove from old pos
      Store.board.lists.splice(pos, 0, updatedList); // Insert at new pos
    }

    return updatedList;
  };

  // DELETE /boards/{id}/lists/{list_id}
  const handleListsDelete = (_: string, listId: string) => {
    // WARNING: The code assumes that the ID exists. No handling for missing IDs.
    const idx = Store.board.lists.findIndex((l) => l.id === listId);

    Store.board.lists.splice(idx, 1);
  };

  // Resource: /boards/{id}/lists
  const resourceLists = (boardId: string, listId: string) => {
    switch (method) {
      case 'POST':
        return handleListsCreate(boardId);
      case 'PUT':
        return handleListsUpdate(boardId, listId);
      case 'DELETE':
        return handleListsDelete(boardId, listId);
    }
    return {};
  };

  // POST /boards/{id}/labels
  const handleLabelsCreate = (_: string) => {
    const cBody = body as ApiRequestLabel;
    const label = {
      id: 'l' + Date.now(),
      name: cBody['name'] || '',
      color: cBody['color'] || '',
    };

    Store.board.labels.push(label);

    return label;
  };

  // PUT /boards/{id}/labels/{label_id}
  const handleLabelsUpdate = (_: string, labelId: string) => {
    const cBody = body as ApiRequestLabel;
    const changes = {
      ...(cBody['name'] ? { name: cBody['name'] } : {}),
      ...(cBody['color'] ? { color: cBody['color'] } : {}),
    };

    // WARNING: The code assumes that the ID exists. No handling for missing IDs.
    const idx = Store.board.labels.findIndex((l) => l.id === labelId);

    const currentLabel = Store.board.labels[idx];
    const updatedLabel = {
      ...currentLabel,
      ...changes,
    };

    Store.board.labels[idx] = updatedLabel;

    return updatedLabel;
  };

  // DELETE /boards/{id}/labels/{label_id}
  const handleLabelsDelete = (_: string, labelId: string) => {
    // WARNING: The code assumes that the ID exists. No handling for missing IDs.
    const idx = Store.board.labels.findIndex((l) => l.id === labelId);

    Store.board.labels.splice(idx, 1);

    // Remove from cards
    const removeLabelIdFromCard = (card: ApiCard) => {
      const lIdx = card.labelIds.indexOf(labelId);
      if (lIdx > -1) {
        card.labelIds.splice(lIdx, 1);
      }
    };

    Store.board.lists.forEach((list) =>
      list.cards.forEach(removeLabelIdFromCard),
    );

    Store.cards.forEach(removeLabelIdFromCard);
  };

  // Resource: /boards/{id}/labels
  const resourceLabels = (boardId: string, labelId: string) => {
    switch (method) {
      case 'POST':
        return handleLabelsCreate(boardId);
      case 'PUT':
        return handleLabelsUpdate(boardId, labelId);
      case 'DELETE':
        return handleLabelsDelete(boardId, labelId);
    }
    return {};
  };

  // GET /boards/{id}
  const handleBoardsGet = (_: string) => Store.board; // We have a single board for now

  // Resource: /boards
  const resourceBoards = () => {
    const [, boardId, secondaryResource, secId] = routeParams;

    if (method === 'GET' && !secondaryResource) {
      return handleBoardsGet(boardId);
    }

    switch (secondaryResource) {
      case 'lists':
        return resourceLists(boardId, secId);
      case 'labels':
        return resourceLabels(boardId, secId);
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
    const cBody = body as ApiRequestCard;
    const partialCard = {
      id: 'c' + Date.now(),
      title: cBody['title'] || '',
      labelIds: [],
    };

    const listId = cBody['listId'] || '';

    // WARNING: The code assumes that the ID exists. No handling for missing IDs.
    const listIdx = Store.board.lists.findIndex((l) => l.id === listId);
    const list = Store.board.lists[listIdx];

    const fullCard = {
      ...partialCard,
      listId: cBody['listId'] || '',
      description: cBody['description'] || '',
      pos: list.cards.length,
    };

    // Push in the main cards store
    Store.cards.push(fullCard);

    // Push the partial card in the list
    list.cards.push(partialCard);

    return fullCard;
  };

  // PUT /cards/{id}
  const handleCardsUpdate = (cardId: string) => {
    const cBody = body as ApiRequestCard;
    const pos = cBody['pos'] ? cBody['pos'] : -1;
    const listId = cBody['listId'] ? cBody['listId'] : '';

    const changes = {
      ...(pos > -1 ? { pos } : {}),
      ...(listId ? { listId } : {}),
      ...(cBody['title'] ? { title: cBody['title'] } : {}),
      ...(cBody['description'] ? { description: cBody['description'] } : {}),
      ...(cBody['labelIds'] ? { labelIds: cBody['labelIds'] } : {}),
    };

    // WARNING: The code assumes that the ID exists. No handling for missing IDs.
    const idx = Store.cards.findIndex((c) => c.id === cardId);
    const currentCard = Store.cards[idx];
    const updatedCard = {
      ...currentCard,
      ...changes,
    };

    // We can just substitute the card in the cards list
    // since the position is already part of the object and
    // the order in the array doesn't matter.
    Store.cards[idx] = updatedCard;

    const updatedPartialCard = {
      id: updatedCard.id,
      title: updatedCard.title,
      labelIds: updatedCard.labelIds,
    };

    // WARNING: The code assumes that the ID exists. No handling for missing IDs.
    const listIdx = Store.board.lists.findIndex((l) => l.id === listId);
    const list = Store.board.lists[listIdx];

    if (currentCard.listId === listId) {
      if (pos === -1) {
        list.cards[idx] = updatedPartialCard; // Replace
      } else {
        list.cards.splice(currentCard.pos!, 1); // Remove from old pos
        list.cards.splice(pos, 0, updatedPartialCard); // Insert at new pos
      }
    } else {
      // WARNING: The code assumes that the ID exists. No handling for missing IDs.
      const formerListIdx = Store.board.lists.findIndex(
        (l) => l.id === currentCard.listId,
      );
      const formerList = Store.board.lists[formerListIdx];

      // Remove from the old/former list
      formerList.cards.splice(currentCard.pos!, 1);

      // Insert in the new list
      list.cards.splice(pos, 0, updatedPartialCard);
    }

    return updatedCard;
  };

  // DELETE /cards/{id}
  const handleCardsDelete = (cardId: string) => {
    // WARNING: The code assumes that the ID exists. No handling for missing IDs.
    const idx = Store.cards.findIndex((c) => c.id === cardId);
    const card = Store.cards[idx];

    Store.cards.splice(idx, 1);

    // WARNING: The code assumes that the ID exists. No handling for missing IDs.
    const listIdx = Store.board.lists.findIndex((l) => l.id === card.listId);
    const list = Store.board.lists[listIdx];

    // The card position should correspond to the index in Store.lists.cards.
    list.cards.splice(card.pos as number, 1);
  };

  // Resource: /cards
  const resourceCards = () => {
    const [, cardId] = routeParams;

    switch (method) {
      case 'GET':
        return handleCardsGet(cardId);
      case 'POST':
        return handleCardsPost();
      case 'PUT':
        return handleCardsUpdate(cardId);
      case 'DELETE':
        return handleCardsDelete(cardId);
    }

    return {};
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let response: any = {};

  // Route handling
  switch (resource) {
    case 'boards':
      response = resourceBoards();
      break;
    case 'cards':
      response = resourceCards();
      break;
  }

  return response;
};
