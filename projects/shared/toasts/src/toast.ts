import { WritableSignal } from '@angular/core';
import { List } from 'immutable';

import { ToastConfig, ToastType } from './types';

const DEFAULT_CFG: ToastConfig = {
  ttl: 1000,
  type: ToastType.Default,
};

/**
 * Toast item
 */
export class Toast {
  public createdAt = new Date().getTime();
  config: ToastConfig;

  constructor(
    public name: string,
    private _list: WritableSignal<List<Toast>>,
    config?: Partial<ToastConfig>,
  ) {
    this.config = { ...DEFAULT_CFG, ...config };
    setTimeout(() => this.destroy(), this.config.ttl);
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
