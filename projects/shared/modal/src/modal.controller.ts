import { WritableSignal } from '@angular/core';
import { Map } from 'immutable';
import { Modal } from './types';

export class ModalController<T = void> {
  private _resolver!: (v: T | undefined) => void;

  constructor(
    private _id: number,
    private _modals: WritableSignal<Map<number, Modal<unknown, unknown>>>,
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
    this._modals.update((m) => m.remove(this._id));
  }
}
