import { Component, inject, input } from '@angular/core';
import { BoardList } from '../../../../models';
import { BoardService } from '../../data-access/board.service';

@Component({
  selector: 'kb-list',
  standalone: true,
  imports: [],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent {
  private _board = inject(BoardService);

  list = input.required<BoardList>();

  createCard() {
    this._board.createCard(this.list().id, 'Random card');
  }
}
