import { Injector, Type } from '@angular/core';
import { CtxMenuController } from './ctx-menu.controller';

/**
 * Context menu configuration object
 */
export type CtxMenuConfig = {
  /**
   * Provide a custom injector.
   */
  injector?: Injector;
};

/**
 * A context menu object
 */
export interface CtxMenu<D, R> {
  component: Type<unknown>;
  controller: CtxMenuController<R>;
  data?: D;
  coor: { x: number; y: number };
  config: CtxMenuConfig;
}
