import { Injectable } from '@angular/core';

/**
 * localStorage wrapper. Browser-only.
 * Should not be used during the server-side
 * rendering phase (no use case).
 */
// We intentionally don't check if the platform is browser.
// Otherwise, we won't get an error on the server, if we
// happen to use LS during the render phase. As a result,
// any problems caused by that might go unnoticed or hard
// to track.
@Injectable({ providedIn: 'root' })
export class LocalStorage {
  get(key: string): string | null {
    return localStorage.getItem(key);
  }

  getJSON(key: string): object | null {
    const item = this.get(key);

    try {
      return JSON.parse(item || '');
    } catch {
      return null;
    }
  }

  set(key: string, data: string) {
    localStorage.setItem(key, data);
  }

  setJSON(key: string, data: object) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  remove(key: string) {
    localStorage.removeItem(key);
  }

  clear() {
    localStorage.clear();
  }
}
