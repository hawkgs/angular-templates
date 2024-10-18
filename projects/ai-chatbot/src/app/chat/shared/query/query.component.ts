import { Component, input } from '@angular/core';
import { Query } from '../../../../model';
import { SafeHtmlPipe } from '@ngx-templates/shared/utils';

@Component({
  selector: 'acb-query',
  standalone: true,
  imports: [SafeHtmlPipe],
  templateUrl: './query.component.html',
  styleUrl: './query.component.scss',
})
export class QueryComponent {
  query = input.required<Query>();
}
