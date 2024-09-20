import {
  InjectionToken,
  Provider,
  signal,
  WritableSignal,
} from '@angular/core';
import { Board } from '../../../models';

export const BOARD_ID = 'bd1';

export const BOARD_STATE = new InjectionToken<WritableSignal<Board>>(
  'BOARD_STATE',
);

export const provideBoardState = (): Provider => ({
  provide: BOARD_STATE,
  useValue: signal<Board>(new Board({})),
});
