import { Component, input } from '@angular/core';
import { Query } from '../../../../model';

@Component({
  selector: 'acb-query',
  standalone: true,
  imports: [],
  templateUrl: './query.component.html',
  styleUrl: './query.component.scss',
})
export class QueryComponent {
  query = input.required<Query>();
}
