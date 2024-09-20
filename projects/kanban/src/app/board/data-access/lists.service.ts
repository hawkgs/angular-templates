import { computed, inject, Injectable } from '@angular/core';
import { BOARD_ID, BOARD_STATE } from './board-state.provider';
import { BoardList } from '../../../models';
import { BoardsApi } from '../../api/boards-api.service';

@Injectable()
export class ListsService {
  private _board = inject(BOARD_STATE);
  private _boardsApi = inject(BoardsApi);

  value = computed(() => this._board().lists);

  async createList(name: string) {
    const list = new BoardList({
      name,
      boardId: BOARD_ID,
    });

    const dbList = await this._boardsApi.createBoardList(BOARD_ID, list);
    this._board.update((b) => b.set('lists', b.lists.push(dbList)));
  }
}
