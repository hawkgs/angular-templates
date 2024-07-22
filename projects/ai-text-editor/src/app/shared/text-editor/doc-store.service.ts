import { inject, Injectable, signal } from '@angular/core';
import { LocalStorage } from '@ngx-templates/shared/services';

const DOC_STORE_LS_KEY = 'ate-doc';

@Injectable()
export class DocStoreService {
  private _storage = inject(LocalStorage);

  private _target?: HTMLElement;
  private _htmlContent = signal<string>('');
  htmlContent = this._htmlContent.asReadonly();

  constructor() {
    const content = this._storage.get(DOC_STORE_LS_KEY) || '';
    this._htmlContent.set(content);
  }

  provideTarget(target: HTMLElement) {
    this._target = target;
  }

  save() {
    if (!this._target) {
      return;
    }

    const content = this._target.innerHTML;
    this._storage.set(DOC_STORE_LS_KEY, content);
  }

  clearContent() {
    this._htmlContent.set('');
    this._storage.remove(DOC_STORE_LS_KEY);
  }
}
