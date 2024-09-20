import { Component, inject, Injector, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { DRAG_AND_DROP_DIRECTIVES } from '@ngx-templates/shared/drag-and-drop';
import { ModalService } from '@ngx-templates/shared/modal';

import { provideBoardState } from './data-access/board-state.provider';
import { BoardService } from './data-access/board.service';
import { ListsService } from './data-access/lists.service';
import { CardsService } from './data-access/cards.service';
import { LabelsService } from './data-access/labels.service';

import { ListComponent } from './shared/list/list.component';
import { CardComponent } from './shared/card/card.component';
import { AddListComponent } from './shared/add-list/add-list.component';
import { Card } from '../../models';
import {
  CardDetailsComponent,
  CardDetailsData,
} from './shared/card-details/card-details.component';
import { ActivatedRoute } from '@angular/router';

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
  lists = inject(ListsService);
  cards = inject(CardsService);

  private _board = inject(BoardService);
  private _location = inject(Location);
  private _modals = inject(ModalService);
  private _injector = inject(Injector);
  private _route = inject(ActivatedRoute);

  ngOnInit() {
    const id = this._route.snapshot.paramMap.get('id');
    if (id) {
      this.openCard(id);
    }
    this._board.loadBoardData();
  }

  openCard(cardId: string) {
    this._location.go('c/' + cardId);
    this._modals
      .createModal<CardDetailsData>(
        CardDetailsComponent,
        {
          cardId,
        },
        // Since the outlet is located in the AppComponent
        // but we need the state services, we must provide
        // the current injector.
        { injector: this._injector },
      )
      .closed.then(() => {
        this._location.go('/');
      });
  }
}
