import { WritableSignal } from '@angular/core';
import { List } from 'immutable';

/**
 * Toast item
 */
export class Toast {
  public createdAt = new Date().getTime();

  constructor(
    public name: string,
    public ttl: number,
    private _list: WritableSignal<List<Toast>>,
  ) {
    setTimeout(() => this.destroy(), this.ttl);
  }

  /**
   * Remove the toast from the list (i.e. the DOM)
   */
  destroy() {
    const list = this._list();
    const idx = list.findIndex((t) => t === this);

    this._list.update((l) => l.remove(idx));
  }
}
