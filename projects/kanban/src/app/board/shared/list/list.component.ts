import {
  Component,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { ModalService } from '@ngx-templates/shared/modal';
import { BoardList } from '../../../../models';
import { AddCardComponent } from './add-card/add-card.component';
import { CardsService } from '../../data-access/cards.service';
import { ListsService } from '../../data-access/lists.service';
import {
  ConfirmDeleteData,
  ConfirmDeleteModalComponent,
} from '../confirm-delete-modal/confirm-delete-modal.component';

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
  private _modals = inject(ModalService);

  titleInput = viewChild.required<ElementRef>('titleInput');

  list = input.required<BoardList>();

  topCardCreator = signal<boolean>(false);

  createCard(title: string, insertOnTop?: boolean) {
    this._cards.createCard(this.list().id, title, insertOnTop);
  }

  moveList(dir: 'left' | 'right') {
    const id = this.list().id;
    const pos = this._lists.value().findIndex((l) => l.id === id);
    const newPos =
      dir === 'left'
        ? Math.max(0, pos - 1)
        : Math.min(pos + 1, this._lists.value().size);

    this._lists.updateListPosition(this.list().id, newPos);
  }

  deleteList() {
    this._modals
      .createModal<
        ConfirmDeleteData,
        boolean
      >(ConfirmDeleteModalComponent, { entity: 'list' })
      .closed.then((shouldDelete) => {
        if (shouldDelete) {
          this._lists.deleteList(this.list().id);
        }
      });
  }

  onTitleInputBlur(e: Event) {
    const name = this.titleInput().nativeElement.value;

    if (name) {
      this._lists.updateListName(this.list().id, name);
    } else {
      this.titleInput().nativeElement.value = this.list().name;
    }
  }
}
