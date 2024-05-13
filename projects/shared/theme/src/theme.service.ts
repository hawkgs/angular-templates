import { DOCUMENT } from '@angular/common';
import {
  Injectable,
  Renderer2,
  RendererFactory2,
  Signal,
  inject,
  signal,
} from '@angular/core';
import { LocalStorage } from '@ngx-templates/shared/services';

const THEME_LS_KEY = 'ngx-theme';
type LsThemeType = 'light' | 'dark';
export type ThemeType = LsThemeType | 'system';

const getThemeClass = (t: ThemeType) => `ngx-${t}-theme`;

/**
 * Provides an API for changing the UI theme
 * The initialization logic can be found in index.html
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private _doc = inject(DOCUMENT);
  private _storage = inject(LocalStorage);

  private _renderer: Renderer2;
  private _current = signal<ThemeType | null>(null);

  constructor(rendererFactory: RendererFactory2) {
    this._renderer = rendererFactory.createRenderer(null, null);
  }

  /**
   * Returns a read-only Signal with the current theme.
   *
   * @returns
   */
  getTheme(): Signal<ThemeType> {
    this._initSignal();
    return this._current.asReadonly() as Signal<ThemeType>;
  }

  /**
   * Change current theme to light, dark or system one
   *
   * @param theme
   */
  setTheme(theme: ThemeType) {
    this._initSignal();

    const doc = this._doc.documentElement;

    if (this._current() !== 'system') {
      this._renderer.removeClass(doc, getThemeClass(this._current()!));
      this._storage.remove(THEME_LS_KEY);
    }
    if (theme !== 'system') {
      this._renderer.addClass(doc, getThemeClass(theme));
      this._storage.set(THEME_LS_KEY, theme);
    }

    this._current.set(theme);
  }

  /**
   * Initialize the current theme signal from the local storage, if null.
   */
  private _initSignal() {
    if (!this._current()) {
      const current = this._storage.get(THEME_LS_KEY) as LsThemeType | null;
      this._current.set(current ? current : 'system');
    }
  }
}
