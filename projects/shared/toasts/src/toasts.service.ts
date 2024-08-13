import { Injectable, signal } from '@angular/core';
import { List } from 'immutable';
import { Toast } from './toast';
import { ToastConfig } from './types';

/**
 * Provides a very simple interface for
 * creation of notification toasts.
 */
@Injectable({ providedIn: 'root' })
export class ToastsService {
  private _toasts = signal<List<Toast>>(List([]));

  readonly value = this._toasts.asReadonly();

  create(text: string, config?: Partial<ToastConfig>): Promise<void> {
    const toast = new Toast(text, this._toasts, config);

    this._toasts.update((l) => l.push(toast));

    return toast.destroyPromise;
  }
}
