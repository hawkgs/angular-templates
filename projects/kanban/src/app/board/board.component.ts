import { Component, inject, OnInit } from '@angular/core';
import { DRAG_AND_DROP_DIRECTIVES } from '@ngx-templates/shared/drag-and-drop';

import { provideBoardState } from './data-access/board-state.provider';
import { BoardService } from './data-access/board.service';
import { ListsService } from './data-access/lists.service';
import { CardsService } from './data-access/cards.service';
import { LabelsService } from './data-access/labels.service';

import { ListComponent } from './shared/list/list.component';
import { CardComponent } from './shared/card/card.component';
import { AddListComponent } from './shared/add-list/add-list.component';

@Component({
  selector: 'kb-board',
  standalone: true,
  imports: [
    ListComponent,
    CardComponent,
    DRAG_AND_DROP_DIRECTIVES,
    AddListComponent,
  ],
  providers: [
    provideBoardState(),
    BoardService,
    ListsService,
    CardsService,
    LabelsService,
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent implements OnInit {
  private _board = inject(BoardService);
  lists = inject(ListsService);
  cards = inject(CardsService);

  ngOnInit() {
    this._board.loadBoardData();
  }
}
