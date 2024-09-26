import {
  Component,
  ElementRef,
  inject,
  Injector,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { CtxMenuService } from '@ngx-templates/shared/context-menu';

import { BoardList } from '../../../../models';
import { AddCardComponent } from './add-card/add-card.component';
import { CardsService } from '../../data-access/cards.service';
import { ListsService } from '../../data-access/lists.service';
import {
  ListCtxMenuComponent,
  ListCtxMenuData,
} from './list-ctx-menu/list-ctx-menu.component';

@Component({
  selector: 'kb-list',
  standalone: true,
  imports: [AddCardComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent {
  private _cards = inject(CardsService);
  private _lists = inject(ListsService);
  private _ctxMenu = inject(CtxMenuService);
  private _injector = inject(Injector);

  nameInput = viewChild.required<ElementRef>('nameInput');

  list = input.required<BoardList>();

  topCardCreator = signal<boolean>(false);

  createCard(title: string, insertOnTop?: boolean) {
    this._cards.createCard(this.list().id, title, insertOnTop);
  }

  updateName() {
    const name = this.nameInput().nativeElement.value;

    if (name) {
      this._lists.updateListName(this.list().id, name);
    } else {
      this.nameInput().nativeElement.value = this.list().name;
    }
  }

  openCtxMenu(e: MouseEvent) {
    this._ctxMenu.openMenu<ListCtxMenuData>(
      ListCtxMenuComponent,
      e,
      { listId: this.list().id },
      { injector: this._injector },
    );
  }
}
