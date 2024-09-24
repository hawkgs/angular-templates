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

  value = computed(() => this._board().cards);

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

  async loadCard(cardId: string) {
    const dbCard = await this._cardsApi.getCard(cardId);

    if (dbCard) {
      this._board.update((b) => b.set('cards', b.cards.set(dbCard.id, dbCard)));
    }

    return dbCard;
  }

  async createCard(listId: string, title: string, insertOnTop?: boolean) {
    const card = new Card({
      listId,
      title,
    });

    const dbCard = await this._cardsApi.createCard(card, insertOnTop);

    if (!dbCard) {
      return;
    }

    this._board.update((b) => {
      if (insertOnTop) {
        const listCards = b.cards
          .filter((c) => c.listId === listId)
          .map((c) => c.set('pos', c.pos + 1));

        b = b.set('cards', b.cards.concat(listCards));
      }

      return b.set('cards', b.cards.set(dbCard.id, dbCard));
    });
  }

  async updateCardPosition(
    cardId: string,
    changes: { pos: number; listId?: string },
  ) {
    const dbCard = await this._cardsApi.updateCard(cardId, changes);

    if (!dbCard) {
      return;
    }

    this._board.update((b) => {
      let cards = b.cards;
      const card = cards.get(cardId);

      // Handle transfer between lists
      // Note(Georgi): There is a room for optimization
      // by introducing some store denormalization which
      // will make filter calculations redundant.
      if (card?.listId !== changes.listId) {
        const oldCard = b.cards.get(cardId);
        const oldListUpdatedPos = b.cards
          .filter((c) => c.listId === oldCard?.listId && c.pos > oldCard.pos)
          .map((c) => c.set('pos', c.pos - 1));
        const newListUpdatedPos = b.cards
          .filter((c) => c.listId === dbCard.listId && c.pos >= changes.pos)
          .map((c) => c.set('pos', c.pos + 1));

        cards = cards.concat(oldListUpdatedPos).concat(newListUpdatedPos);
      }

      cards = cards.set(dbCard.id, dbCard);

      return b.set('cards', cards);
    });
  }

  async updateCardContent(
    cardId: string,
    content: { title?: string; description?: string; labelIds?: string[] },
  ) {
    const dbCard = await this._cardsApi.updateCard(cardId, content);

    if (dbCard) {
      this._board.update((b) => {
        return b.set('cards', b.cards.set(dbCard.id, dbCard));
      });
    }
  }

  async deleteCard(cardId: string) {
    await this._cardsApi.deleteCard(cardId);
  }
}
