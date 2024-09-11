import { Injectable, inject } from '@angular/core';
import { List } from 'immutable';
import { FETCH_API } from '@ngx-templates/shared/fetch';

import {
  mapBoardList,
  mapBoardListsCards,
  mapBoardLists,
  mapLabel,
  mapLabels,
} from './utils/internal-mappers';
import { environment } from '../../environments/environment';
import { BoardList, Card, Label } from '../../models';
import {
  mapApiRequestBoardList,
  mapApiRequestLabel,
} from './utils/external-mappers';

@Injectable({ providedIn: 'root' })
export class BoardsApi {
  private _fetch = inject(FETCH_API);

  async getBoardData(boardId: string): Promise<{
    lists: List<BoardList>;
    cards: List<Card>;
    labels: List<Label>;
  }> {
    const response = await this._fetch(
      `${environment.apiUrl}/boards/${boardId}`,
    );
    const json = await response.json();

    const lists = mapBoardLists(json);
    const cards = mapBoardListsCards(json);
    const labels = mapLabels(json);

    return {
      lists,
      cards,
      labels,
    };
  }

  // Lists

  async createBoardList(boardId: string, list: BoardList): Promise<BoardList> {
    const response = await this._fetch(
      `${environment.apiUrl}/boards/${boardId}/lists`,
      {
        method: 'POST',
        body: JSON.stringify(mapApiRequestBoardList(list)),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const json = await response.json();

    return mapBoardList(json);
  }

  async updateBoardListName(
    boardId: string,
    list: BoardList,
  ): Promise<BoardList> {
    const response = await this._fetch(
      `${environment.apiUrl}/boards/${boardId}/lists/${list.id}`,
      {
        method: 'PUT',
        body: JSON.stringify(mapApiRequestBoardList(list)),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const json = await response.json();

    return mapBoardList(json);
  }

  async deleteBoardList(boardId: string, listId: string): Promise<void> {
    await this._fetch(
      `${environment.apiUrl}/boards/${boardId}/lists/${listId}`,
      {
        method: 'DELETE',
      },
    );
  }

  // Labels

  async createLabel(boardId: string, label: Label): Promise<Label> {
    const response = await this._fetch(
      `${environment.apiUrl}/boards/${boardId}/labels`,
      {
        method: 'POST',
        body: JSON.stringify(mapApiRequestLabel(label)),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const json = await response.json();

    return mapLabel(json);
  }

  async updateLabel(boardId: string, label: Label): Promise<Label> {
    const response = await this._fetch(
      `${environment.apiUrl}/boards/${boardId}/labels/${label.id}`,
      {
        method: 'PUT',
        body: JSON.stringify(mapApiRequestLabel(label)),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const json = await response.json();

    return mapLabel(json);
  }

  async deleteLabel(boardId: string, labelId: string): Promise<void> {
    await this._fetch(
      `${environment.apiUrl}/boards/${boardId}/labels/${labelId}`,
      {
        method: 'DELETE',
      },
    );
  }
}
