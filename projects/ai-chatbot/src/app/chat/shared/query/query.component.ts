import { Component, input } from '@angular/core';
import { SafeHtmlPipe } from '@ngx-templates/shared/utils';
import { IconComponent } from '@ngx-templates/shared/icon';

import { Query } from '../../../../model';
import { QuerySkeletonComponent } from '../query-skeleton/query-skeleton.component';

@Component({
  selector: 'acb-query',
  standalone: true,
  imports: [SafeHtmlPipe, IconComponent, QuerySkeletonComponent],
  templateUrl: './query.component.html',
  styleUrl: './query.component.scss',
})
export class QueryComponent {
  query = input.required<Query>();
}
