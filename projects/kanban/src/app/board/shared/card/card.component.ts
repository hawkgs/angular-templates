import { Component, input, output } from '@angular/core';
import { Card } from '../../../../models';

@Component({
  selector: 'kb-card',
  standalone: true,
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  card = input.required<Card>();
  open = output<Card>();
}
