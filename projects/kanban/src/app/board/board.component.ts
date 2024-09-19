import { Component, inject, OnInit } from '@angular/core';
import { DRAG_AND_DROP_DIRECTIVES } from '@ngx-templates/shared/drag-and-drop';

import { ListComponent } from './shared/list/list.component';
import { CardComponent } from './shared/card/card.component';
import { BoardService } from './data-access/board.service';

@Component({
  selector: 'kb-board',
  standalone: true,
  imports: [ListComponent, CardComponent, DRAG_AND_DROP_DIRECTIVES],
  providers: [BoardService],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent implements OnInit {
  board = inject(BoardService);

  ngOnInit() {
    this.board.loadLists();
  }

  createList() {
    this.board.createList('Dummy');
  }
}
