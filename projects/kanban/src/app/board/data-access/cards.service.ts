import { computed, inject, Injectable, Signal } from '@angular/core';
import { BOARD_STATE } from './board-state.provider';
import { List } from 'immutable';
import { Card } from '../../../models';
import { CardsApi } from '../../api/cards-api.service';

@Injectable()
export class CardsService {
  private _board = inject(BOARD_STATE);
  private _cardsApi = inject(CardsApi);

  private _computedCardsLists = new Map<string, Signal<List<Card>>>();

  fromList = (listId: string): Signal<List<Card>> => {
    let computedList = this._computedCardsLists.get(listId);

    if (!computedList) {
      // Note(Georgi): No need to sort. The drop-grid does that internally.
      computedList = computed(() =>
        this._board()
          .cards.filter((c) => c.listId === listId)
          .toList(),
      );
      this._computedCardsLists.set(listId, computedList);
    }

    return computedList;
  };

  async createCard(listId: string, title: string, insertOnTop?: boolean) {
    const card = new Card({
      listId,
      title,
    });

    const dbCard = await this._cardsApi.createCard(card, insertOnTop);

    this._board.update((b) => {
      if (insertOnTop) {
        const listCards = b.cards
          .filter((c) => c.listId === listId)
          .map((c) => c.set('pos', c.pos + 1));

        b = b.set('cards', b.cards.concat(listCards));

        console.log(b.cards.toJS());
      }

      return b.set('cards', b.cards.set(dbCard.id, dbCard));
    });
  }
}