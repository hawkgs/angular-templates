import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';

/**
 * localStorage wrapper. Browser-only.
 * Should not be used during the server-side
 * rendering phase (no use case).
 */
@Injectable({ providedIn: 'root' })
export class LocalStorage {
  private _platformId = inject(PLATFORM_ID);

  private get _isBrowser() {
    return isPlatformBrowser(this._platformId);
  }

  get(key: string): string | null {
    if (!this._isBrowser) {
      return null;
    }
    return localStorage.getItem(key);
  }

  set(key: string, data: string) {
    if (this._isBrowser) {
      localStorage.setItem(key, data);
    }
  }

  remove(key: string) {
    if (this._isBrowser) {
      localStorage.removeItem(key);
    }
  }

  clear() {
    if (this._isBrowser) {
      localStorage.clear();
    }
  }
}
