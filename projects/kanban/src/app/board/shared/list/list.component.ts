import { Component, inject, input, signal } from '@angular/core';
import { BoardList } from '../../../../models';
import { BoardService } from '../../data-access/board.service';
import { AddCardComponent } from './add-card/add-card.component';

@Component({
  selector: 'kb-list',
  standalone: true,
  imports: [AddCardComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent {
  private _board = inject(BoardService);

  list = input.required<BoardList>();

  topCardCreator = signal<boolean>(false);

  createCard(title: string, insertOnTop?: boolean) {
    this._board.createCard(this.list().id, title, insertOnTop);
  }
}
