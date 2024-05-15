import { WritableSignal } from '@angular/core';
import { List } from 'immutable';
import { Modal } from './types';

export class ModalController<T = void> {
  private _resolver!: (v: T | undefined) => void;

  constructor(
    private _id: number,
    private _modals: WritableSignal<List<Modal<unknown, unknown>>>,
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
    this._resolver(result);

    this._modals.update((modals) => {
      const idx = modals.findIndex((m) => m.id === this._id);
      return modals.remove(idx);
    });
  }
}
