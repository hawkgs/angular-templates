import { inject, Injectable } from '@angular/core';

import { BoardsApi } from '../../api/boards-api.service';
import { BOARD_STATE } from './board-state.provider';

const BOARD_ID = 'bd1';

@Injectable()
export class BoardService {
  private _board = inject(BOARD_STATE);
  private _boardsApi = inject(BoardsApi);

  async loadBoardData() {
    const board = await this._boardsApi.getBoardData(BOARD_ID);
    this._board.set(board);
  }
}
