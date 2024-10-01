import { Component, inject, Injector, OnInit, signal } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
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
import {
  CardDetailsComponent,
  CardDetailsData,
} from './shared/card-details/card-details.component';

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
  private _modal = inject(ModalService);
  private _injector = inject(Injector);
  private _route = inject(ActivatedRoute);

  disabledSpacerListId = signal<string>('');

  ngOnInit() {
    const id = this._route.snapshot.paramMap.get('id');
    if (id) {
      this.openCard(id, false);
    }
    this._board.loadBoardData();
  }

  openCard(cardId: string, animated: boolean = true) {
    this._location.go('c/' + cardId);
    this._modal
      .createModal<CardDetailsData>(
        CardDetailsComponent,
        {
          cardId,
        },
        // Since the outlet is located in the AppComponent
        // but we need the state services, we must provide
        // the current injector.
        { injector: this._injector, animated },
      )
      .closed.then(() => {
        this._location.go('/');
      });
  }

  onCardMoved(listId: string, moved: { id: string; pos: number }) {
    this.cards.updateCardPosition(moved.id, { listId, pos: moved.pos });
  }

  disabledSpacerFor(listId: string, enabled: boolean) {
    if (enabled) {
      this.disabledSpacerListId.set(listId);
    } else {
      this.disabledSpacerListId.set('');
    }
  }
}
