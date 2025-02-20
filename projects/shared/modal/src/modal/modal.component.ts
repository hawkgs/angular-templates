import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  InjectionToken,
  Injector,
  StaticProvider,
  ViewContainerRef,
  afterNextRender,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { ModalController } from '../modal.controller';
import { Modal } from '../types';

export const MODAL_DATA = new InjectionToken('MODAL_DATA');

@Component({
  selector: 'ngx-modal',
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent<D, R> implements AfterViewInit {
  private _cdRef = inject(ChangeDetectorRef);

  modal = input.required<Modal<D, R>>();
  invisible = input<boolean>(false);
  content = viewChild.required('content', { read: ViewContainerRef });
  dialog = viewChild.required<ElementRef>('dialog');

  constructor() {
    afterNextRender({ write: () => this.dialog().nativeElement.showModal() });
  }

  /**
   * Create the modal content component and insert it
   * in the host view container.
   */
  ngAfterViewInit() {
    const modal = this.modal();
    const injector = this._createInjector(
      modal.controller,
      modal.data,
      modal.config.injector,
    );
    this.content().createComponent(modal.component, { injector });

    // We need to run a CD in order to avoid NG0100
    this._cdRef.detectChanges();
  }

  /**
   * Close the modal, if the backdrop is clicked.
   */
  onModalMousedown({ clientX, clientY }: MouseEvent) {
    // Unfortunately, this is the only way to implement
    // "close on backdrop click" while using HTML dialog at this stage.
    const { top, left, bottom, right } = (
      this.dialog().nativeElement as Element
    ).getBoundingClientRect();

    const insideX = left <= clientX && clientX <= right;
    const insideY = top <= clientY && clientY <= bottom;
    const outside = !(insideX && insideY);

    if (outside) {
      this.modal().controller.close();
    }
  }

  /**
   * Create an injector that includes the modal controller and the modal data
   * that are then passed to the modal content component for rendering and/or control.
   */
  private _createInjector(
    modalCtrl: ModalController<R>,
    data?: D,
    parentInjector?: Injector,
  ) {
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

    return Injector.create({
      providers,
      parent: parentInjector,
    });
  }
}
