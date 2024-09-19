import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { List } from 'immutable';

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

  lists = computed(() => this._board().lists);
  labels = computed(() => this._board().labels);

  cards = (listId: string): Signal<List<Card>> => {
    let computedList = this._computedCardsLists.get(listId);

    if (!computedList) {
      computedList = computed(() =>
        this._board()
          .cards.filter((c) => c.listId === listId)
          .sort((a, b) => a.pos - b.pos)
          .toList(),
      );
      this._computedCardsLists.set(listId, computedList);
    }

    return computedList;
  };

  async loadLists() {
    const board = await this._boardsApi.getBoardData(BOARD_ID);
    this._board.set(board);
  }

  async createList(name: string) {
    const list = new BoardList({
      name,
      boardId: BOARD_ID,
    });

    const dbList = await this._boardsApi.createBoardList(BOARD_ID, list);
    this._board.update((b) => b.set('lists', b.lists.push(dbList)));
  }

  async createCard(listId: string, title: string) {
    const card = new Card({
      listId,
      title,
    });

    const dbCard = await this._cardsApi.createCard(card);
    this._board.update((b) => b.set('cards', b.cards.set(dbCard.id, dbCard)));
  }
}
