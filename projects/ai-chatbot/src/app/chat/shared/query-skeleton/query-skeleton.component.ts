import { Component, computed, input } from '@angular/core';

const DEFAULT_LINES_COUNT = 3;

@Component({
  selector: 'acb-query-skeleton',
  standalone: true,
  imports: [],
  templateUrl: './query-skeleton.component.html',
  styleUrl: './query-skeleton.component.scss',
})
export class QuerySkeletonComponent {
  lines = input<number>(DEFAULT_LINES_COUNT);
  linesOnly = input<boolean>(false);

  linesArr = computed(() => new Array(this.lines()).fill(null));
}
