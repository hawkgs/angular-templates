import {
  Component,
  computed,
  ElementRef,
  inject,
  OnInit,
  viewChild,
} from '@angular/core';
import {
  MODAL_DATA,
  ModalController,
  ModalService,
} from '@ngx-templates/shared/modal';
import { CardsService } from '../../data-access/cards.service';
import { Card } from '../../../../models';
import {
  ConfirmDeleteData,
  ConfirmDeleteModalComponent,
} from '../confirm-delete-modal/confirm-delete-modal.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

export interface CardDetailsData {
  cardId: string;
}

@Component({
  selector: 'kb-card-details',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './card-details.component.html',
  styleUrl: './card-details.component.scss',
})
export class CardDetailsComponent implements OnInit {
  data = inject<CardDetailsData>(MODAL_DATA);
  ctrl = inject(ModalController);

  private _cards = inject(CardsService);
  private _modal = inject(ModalService);
  private _formBuilder = inject(FormBuilder);

  descriptionForm = this._formBuilder.group({
    description: [''],
  });

  titleInput = viewChild.required<ElementRef>('titleInput');

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

    this._setDescription();
  }

  updateTitle() {
    const title = this.titleInput().nativeElement.value;

    if (title) {
      this._cards.updateCardContent(this.data.cardId, { title });
    } else {
      this.titleInput().nativeElement.value = this.card().title;
    }
  }

  async updateDescription() {
    const description = this.descriptionForm.value.description || '';
    await this._cards.updateCardContent(this.data.cardId, { description });
    this.resetDescriptionForm();
  }

  resetDescriptionForm() {
    this.descriptionForm.reset();
    this._setDescription();
  }

  deleteCard() {
    this._modal
      .createModal<
        ConfirmDeleteData,
        boolean
      >(ConfirmDeleteModalComponent, { entity: 'card' })
      .closed.then((shouldDelete) => {
        if (shouldDelete) {
          this._cards.deleteCard(this.data.cardId);
          this.ctrl.close();
        }
      });
  }

  private _setDescription() {
    const description = this.card().description;
    this.descriptionForm.controls.description.setValue(description);
  }
}
