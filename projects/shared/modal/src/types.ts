import { Injector, Type } from '@angular/core';
import { ModalController } from './modal.controller';

/**
 * Modal configuration object
 */
export type ModalConfig = {
  /**
   * Render the modal component in a window container.
   * Enabled by default.
   */
  modalWindowUi: boolean;

  /**
   * Animate modal pop up.
   * Enabled by default.
   */
  animated: boolean;

  /**
   * Provide a custom injector.
   */
  injector?: Injector;
};

/**
 * A modal object.
 */
export interface Modal<D, R> {
  id: number;
  component: Type<unknown>;
  controller: ModalController<R>;
  data?: D;
  config: ModalConfig;
}
