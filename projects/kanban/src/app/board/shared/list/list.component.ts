import { Component, inject, input, signal } from '@angular/core';
import { BoardList } from '../../../../models';
import { AddCardComponent } from './add-card/add-card.component';
import { CardsService } from '../../data-access/cards.service';

@Component({
  selector: 'kb-list',
  standalone: true,
  imports: [AddCardComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent {
  private _cards = inject(CardsService);

  list = input.required<BoardList>();

  topCardCreator = signal<boolean>(false);

  createCard(title: string, insertOnTop?: boolean) {
    this._cards.createCard(this.list().id, title, insertOnTop);
  }
}
