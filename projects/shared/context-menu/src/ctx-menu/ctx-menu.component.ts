import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  InjectionToken,
  Injector,
  input,
  signal,
  StaticProvider,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { WINDOW, provideWindow } from '@ngx-templates/shared/services';

import { CtxMenu } from '../types';
import { CtxMenuController } from '../ctx-menu.controller';

const COOR_MARGIN = 15; // px

export const CTX_MENU_DATA = new InjectionToken('CTX_MENU_DATA');

@Component({
  selector: 'ngx-ctx-menu',
  imports: [],
  providers: [provideWindow()],
  templateUrl: './ctx-menu.component.html',
  styleUrl: './ctx-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CtxMenuComponent<D, R> implements AfterViewInit {
  private _win = inject(WINDOW);

  menu = input.required<CtxMenu<D, R>>();

  container = viewChild.required<ElementRef>('container');
  content = viewChild.required('content', { read: ViewContainerRef });

  posOffset = signal<{ x: number; y: number }>({ x: 0, y: 0 });

  // Position of the menu
  translate = computed(() => {
    const scrollX = this._win.scrollX;
    const scrollY = this._win.scrollY;

    let { x, y } = this.menu().coor;

    x += scrollX + COOR_MARGIN + this.posOffset().x;
    y += scrollY + COOR_MARGIN + this.posOffset().y;

    return `translate(${x}px, ${y}px)`;
  });

  ngAfterViewInit() {
    const menu = this.menu();
    const injector = this._createInjector(menu);
    this.content().createComponent(menu.component, { injector });

    this._calculatePositionOffset();
  }

  @HostListener('document:mousedown')
  onDocumentMousedown() {
    this.menu()?.controller.close();
  }

  private _createInjector(ctxMenu: CtxMenu<D, R>) {
    const providers: StaticProvider[] = [
      {
        provide: CTX_MENU_DATA,
        useValue: ctxMenu.data,
      },
      {
        provide: CtxMenuController,
        useValue: ctxMenu.controller,
      },
    ];

    return Injector.create({
      providers,
      parent: ctxMenu.config.injector,
    });
  }

  private _calculatePositionOffset() {
    const { width, height } =
      this.container().nativeElement.getBoundingClientRect();
    const { x, y } = this.menu().coor;

    const offset = { x: 0, y: 0 };
    const x2 = x + width;
    const y2 = y + height;

    if (x2 >= this._win.innerWidth) {
      offset.x = -width - COOR_MARGIN * 2;
    }
    if (y2 >= this._win.innerHeight) {
      offset.y = -height - COOR_MARGIN * 2;
    }

    this.posOffset.set(offset);
  }
}
