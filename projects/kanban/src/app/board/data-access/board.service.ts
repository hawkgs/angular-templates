import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { List, Map as ImmutMap } from 'immutable';

import { Board, BoardList, Card } from '../../../models';
import { BoardsApi } from '../../api/boards-api.service';
import { CardsApi } from '../../api/cards-api.service';

const BOARD_ID = 'bd1';

/**
 * Board state.
 */
@Injectable()
export class BoardService {
  private _boardsApi = inject(BoardsApi);
  private _cardsApi = inject(CardsApi);
  private _board = signal<Board>(new Board({}));

  private _computedCardsLists = new Map<string, Signal<List<Card>>>();

  lists = computed<List<BoardList>>(() =>
    this._board()
      .lists.toList()
      .sort((a, b) => a.idx - b.idx),
  );

  cards = (listId: string): Signal<List<Card>> => {
    let computedList = this._computedCardsLists.get(listId);

    if (!computedList) {
      computedList = computed(() =>
        this._board()
          .cards.filter((c) => c.listId === listId)
          .sort((a, b) => a.idx - b.idx)
          .toList(),
      );
      this._computedCardsLists.set(listId, computedList);
    }

    return computedList;
  };

  async loadLists() {
    const { lists, cards } = await this._boardsApi.getBoardData(BOARD_ID);

    let listsMap = ImmutMap<string, BoardList>();
    let cardsMap = ImmutMap<string, Card>();

    // Note(Georgi): Reconsider if maps are needed
    lists.forEach((l) => {
      listsMap = listsMap.set(l.id, l);
    });
    cards.forEach((c) => {
      cardsMap = cardsMap.set(c.id, c);
    });

    this._board.update((board) =>
      board.set('cards', cardsMap).set('lists', listsMap),
    );
  }
}
