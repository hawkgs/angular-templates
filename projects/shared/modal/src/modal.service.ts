/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, Type, signal } from '@angular/core';
import { ModalController } from './modal.controller';
import { List } from 'immutable';
import { Modal, ModalConfig } from './types';

const DEFAULT_CONFIG: ModalConfig = {
  modalWindowUi: true,
  animated: true,
};

@Injectable({ providedIn: 'root' })
export class ModalService {
  private _modals = signal<List<Modal<any, any>>>(List([]));
  private _ct = 0;

  modals = this._modals.asReadonly();

  /**
   * Creates a modal by a provided content component.
   *
   * The first template type represents the input data, if any.
   * The second one – the response data, if any.
   *
   * @param component Modal content component
   * @param data Data passed to the content
   * @returns A modal controller
   */
  createModal<D = void, R = void>(
    component: Type<unknown>,
    data?: D,
    config?: Partial<ModalConfig>,
  ): ModalController<R> {
    const controller = new ModalController<R>(this._ct, this._modals);
    const modal: Modal<D, R> = {
      component,
      data,
      controller,
      id: this._ct,
      config: { ...DEFAULT_CONFIG, ...config },
    };
    this._modals.update((m) => m.push(modal));

    this._ct++;

    return controller;
  }

  /**
   * Closes currently opened modal on focus.
   */
  closeCurrent() {
    if (this._modals().size) {
      this._modals.update((modals) => modals.remove(modals.size - 1));
    }
  }

  /**
   * Close all opened modals.
   */
  closeAll() {
    this._modals.set(List([]));
  }
}
