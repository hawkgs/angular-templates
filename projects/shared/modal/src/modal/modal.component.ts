import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  InjectionToken,
  Injector,
  StaticProvider,
  ViewContainerRef,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { ModalController } from '../modal.controller';
import { Modal } from '../types';

export const MODAL_DATA = new InjectionToken('MODAL_DATA');

@Component({
  selector: 'ngx-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent<D, R> implements AfterViewInit {
  private _cdRef = inject(ChangeDetectorRef);

  modal = input.required<Modal<D, R>>();
  content = viewChild('content', { read: ViewContainerRef });

  /**
   * Create the modal content component and insert it
   * in the host view container.
   */
  ngAfterViewInit() {
    const content = this.content();
    const modal = this.modal();
    if (!content || !modal) {
      return;
    }

    const injector = this._createInjector(modal.controller, modal.data);
    content.createComponent(modal.component, { injector });

    // We need to run a CD in order to avoid NG0100
    this._cdRef.detectChanges();
  }

  /**
   * Create an injector that includes the modal controller and the modal data
   * that are then passed to the modal content component for rendering and/or control.
   */
  private _createInjector(modalCtrl: ModalController<R>, data?: D) {
    const providers: StaticProvider[] = [
      {
        provide: MODAL_DATA,
        useValue: data,
      },
      {
        provide: ModalController,
        useValue: modalCtrl,
      },
    ];

    return Injector.create({ providers });
  }
}
