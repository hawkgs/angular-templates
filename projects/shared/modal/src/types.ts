import { Type } from '@angular/core';
import { ModalController } from './modal.controller';

/**
 * A modal object.
 */
export interface Modal<D, R> {
  id: number;
  component: Type<unknown>;
  controller: ModalController<R>;
  data?: D;
}
