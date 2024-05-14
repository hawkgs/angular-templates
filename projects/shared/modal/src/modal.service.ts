/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, Type, computed, signal } from '@angular/core';
import { ModalController } from './modal.controller';
import { Map } from 'immutable';
import { Modal } from './types';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private _modals = signal<Map<number, Modal<any, any>>>(Map([]));
  private _ct = 0;

  modals = computed(() => this._modals().toList());

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
  ): ModalController<R> {
    const controller = new ModalController<R>(this._ct, this._modals);
    const modal: Modal<D, R> = {
      component,
      data,
      controller,
      id: this._ct,
    };
    this._modals.update((m) => m.set(this._ct, modal));

    this._ct++;

    return controller;
  }

  /**
   * Close all opened modals.
   */
  closeAll() {
    this._modals.set(Map([]));
  }
}
