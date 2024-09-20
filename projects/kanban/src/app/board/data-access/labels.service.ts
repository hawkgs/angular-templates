import { computed, inject, Injectable } from '@angular/core';
import { BOARD_STATE } from './board-state.provider';

@Injectable()
export class LabelsService {
  private _board = inject(BOARD_STATE);

  value = computed(() => this._board().labels);
}
