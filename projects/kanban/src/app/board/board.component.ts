import { Component } from '@angular/core';
import { ListComponent } from './shared/list/list.component';
import { CardComponent } from './shared/card/card.component';

@Component({
  selector: 'kb-board',
  standalone: true,
  imports: [ListComponent, CardComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {}
