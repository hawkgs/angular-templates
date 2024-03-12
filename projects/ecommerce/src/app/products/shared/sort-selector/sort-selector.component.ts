import { Component, model } from '@angular/core';

export type SortType = 'default' | 'price_asc' | 'price_desc';

export const SORT_VALUES: SortType[] = ['default', 'price_asc', 'price_desc'];

enum SortTypeEnum {
  Default = 'default',
  PriceAsc = 'price_asc',
  PriceDesc = 'price_desc',
}

@Component({
  selector: 'ec-sort-selector',
  standalone: true,
  imports: [],
  templateUrl: './sort-selector.component.html',
  styleUrl: './sort-selector.component.scss',
})
export class SortSelectorComponent {
  SortTypeEnum = SortTypeEnum;

  value = model<SortType>('default');

  onSortTypeChange(e: Event) {
    const select = e.target as HTMLSelectElement;
    this.value.set(select.value as SortType);
  }
}
