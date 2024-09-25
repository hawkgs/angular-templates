import { Component, inject, input, signal } from '@angular/core';
import { BoardList } from '../../../../models';
import { AddCardComponent } from './add-card/add-card.component';
import { CardsService } from '../../data-access/cards.service';
import { ListsService } from '../../data-access/lists.service';

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
}
