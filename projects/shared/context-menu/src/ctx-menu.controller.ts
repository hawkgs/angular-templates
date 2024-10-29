import { WritableSignal } from '@angular/core';
import { CtxMenu } from './types';

export class CtxMenuController<T = void> {
  private _resolver!: (v: T | undefined) => void;

  constructor(
    private _menu: WritableSignal<CtxMenu<unknown, unknown> | null>,
  ) {}

  /**
   * A `Promise` that is resolved when the target modal is closed.
   */
  closed = new Promise<T | undefined>((res) => {
    this._resolver = res;
  });

  /**
   * Close the target modal.
   *
   * @param result Provided response data
   */
  close(result?: T) {
    this._menu.set(null);
    this._resolver(result);
  }
}
