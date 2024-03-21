import { Injectable, signal } from '@angular/core';
import { List } from 'immutable';

import { environment as env } from '../../../environments/environment';
import { Toast } from './toast';

type ToastOptions = { ttl: number };

/**
 * Provides a very simple interface for
 * creation of notification toasts.
 */
@Injectable({ providedIn: 'root' })
export class ToastsService {
  private _toasts = signal<List<Toast>>(List([]));

  readonly value = this._toasts.asReadonly();

  create(text: string, options?: Partial<ToastOptions>) {
    const toast = new Toast(
      text,
      options?.ttl || env.toastDefaultTtl,
      this._toasts,
    );

    this._toasts.update((l) => l.push(toast));
  }
}
