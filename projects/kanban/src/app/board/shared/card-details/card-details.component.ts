import { Component, computed, inject, OnInit } from '@angular/core';
import { MODAL_DATA, ModalController } from '@ngx-templates/shared/modal';
import { CardsService } from '../../data-access/cards.service';
import { Card } from '../../../../models';

export interface CardDetailsData {
  cardId: string;
}

@Component({
  selector: 'kb-card-details',
  standalone: true,
  imports: [],
  templateUrl: './card-details.component.html',
  styleUrl: './card-details.component.scss',
})
export class CardDetailsComponent implements OnInit {
  data = inject<CardDetailsData>(MODAL_DATA);
  ctrl = inject(ModalController);
  private _cards = inject(CardsService);

  card = computed<Card>(
    () => this._cards.value().get(this.data.cardId) || new Card({}),
  );

  async ngOnInit() {
    if (!this.card().complete) {
      const card = await this._cards.loadCard(this.data.cardId);
      const exists = card && card.id;

      if (!exists) {
        this.ctrl.close();
      }
    }
  }
}
