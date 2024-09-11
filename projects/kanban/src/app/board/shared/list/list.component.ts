import { Component, input } from '@angular/core';
import { BoardList } from '../../../../models';

@Component({
  selector: 'kb-list',
  standalone: true,
  imports: [],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent {
  list = input.required<BoardList>();
}
