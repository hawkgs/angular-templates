import { Component, model } from '@angular/core';

export type PriceRange = {
  from: number;
  to: number;
};

@Component({
  selector: 'ec-price-filter',
  standalone: true,
  imports: [],
  templateUrl: './price-filter.component.html',
  styleUrl: './price-filter.component.scss',
})
export class PriceFilterComponent {
  range = model<PriceRange>({ from: 0, to: 10000 });

  onFromChangeEnd(e: Event) {
    const input = e.target as HTMLInputElement;
    this.range.update((r) => ({ ...r, from: parseInt(input.value, 10) }));
  }

  onToChangeEnd(e: Event) {
    const input = e.target as HTMLInputElement;
    this.range.update((r) => ({ ...r, to: parseInt(input.value, 10) }));
  }
}
