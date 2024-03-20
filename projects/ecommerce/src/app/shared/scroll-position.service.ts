import { Injectable, inject } from '@angular/core';
import { WINDOW } from './window.provider';

/**
 * Manage scroll Y/top.
 * Provide separately for each component-page.
 */
@Injectable()
export class ScrollPosition {
  private _win = inject(WINDOW);
  private _scrollY: number = 0;

  save() {
    this._scrollY = this._win.scrollY;
  }

  apply() {
    this._win.scrollTo({ top: this._scrollY });
  }

  reset() {
    this._scrollY = 0;
    this._win.scrollTo({ top: 0 });
  }
}
