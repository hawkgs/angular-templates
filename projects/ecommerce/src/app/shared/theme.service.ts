import { DOCUMENT } from '@angular/common';
import { Injectable, Renderer2, RendererFactory2, inject } from '@angular/core';
import { LocalStorage } from './local-storage.service';

const THEME_LS_KEY = 'ec-theme';
type LsThemeType = 'light' | 'dark';
type ThemeType = LsThemeType | 'system';

const getThemeClass = (t: ThemeType) => `ec-${t}-theme`;

/**
 * Provides an API for changing the UI theme
 * The initialization logic can be found in index.html
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private _doc = inject(DOCUMENT);
  private _storage = inject(LocalStorage);

  private _renderer: Renderer2;
  private _current: ThemeType | null = null;

  constructor(rendererFactory: RendererFactory2) {
    this._renderer = rendererFactory.createRenderer(null, null);
  }

  /**
   * Change current theme to light, dark or system one
   *
   * @param theme
   */
  setTheme(theme: ThemeType) {
    if (!this._current) {
      const current = this._storage.get(THEME_LS_KEY) as LsThemeType | null;
      this._current = current ? current : 'system';
    }

    const doc = this._doc.documentElement;

    if (this._current !== 'system') {
      this._renderer.removeClass(doc, getThemeClass(this._current));
      this._storage.remove(THEME_LS_KEY);
    }
    if (theme !== 'system') {
      this._renderer.addClass(doc, getThemeClass(theme));
      this._storage.set(THEME_LS_KEY, theme);
    }

    this._current = theme;
  }
}
