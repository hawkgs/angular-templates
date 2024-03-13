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

  getJSON(key: string): object | null {
    if (!this._isBrowser) {
      return null;
    }

    const item = this.get(key);

    try {
      return JSON.parse(item || '');
    } catch {
      return null;
    }
  }

  set(key: string, data: string) {
    if (!this._isBrowser) {
      return;
    }

    localStorage.setItem(key, data);
  }

  setJSON(key: string, data: object) {
    if (!this._isBrowser) {
      return;
    }

    localStorage.setItem(key, JSON.stringify(data));
  }

  remove(key: string) {
    if (!this._isBrowser) {
      return;
    }

    localStorage.removeItem(key);
  }

  clear() {
    if (!this._isBrowser) {
      return;
    }

    localStorage.clear();
  }
}
