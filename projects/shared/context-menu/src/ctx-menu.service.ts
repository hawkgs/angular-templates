/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, signal, Type } from '@angular/core';
import { CtxMenuController } from './ctx-menu.controller';
import { CtxMenu, CtxMenuConfig } from './types';

const DEFAULT_CONFIG: CtxMenuConfig = {};

@Injectable({ providedIn: 'root' })
export class CtxMenuService {
  private _menu = signal<CtxMenu<any, any> | null>(null);
  menu = this._menu.asReadonly();

  /**
   * Open a context menu.
   *
   * @param component The component representing the menu
   * @param event A mouse event with the absolute coordinates relative to the viewport
   * @param data Data passed to the menu
   */
  openMenu<D = void, R = void>(
    component: Type<unknown>,
    event: MouseEvent,
    data?: D,
    config?: Partial<CtxMenuConfig>,
  ): CtxMenuController<R> {
    event.stopPropagation();

    const controller = new CtxMenuController<R>(this._menu);
    const coor = {
      x: event.clientX,
      y: event.clientY,
    };

    const ctxMenu: CtxMenu<D, R> = {
      component,
      data,
      controller,
      coor,
      config: { ...DEFAULT_CONFIG, ...config },
    };
    this._menu.set(ctxMenu);

    return controller;
  }
}
