import { Component, input, model } from '@angular/core';

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
  default = input.required<PriceRange>();
  range = model<PriceRange>({ from: 0, to: 0 });

  onFromChangeEnd(e: Event) {
    const input = e.target as HTMLInputElement;

    this.range.update((r) => ({
      ...r,
      from: Math.min(
        parseInt(input.value, 10) || this.default().from,
        this.range().to,
      ),
    }));
  }

  onToChangeEnd(e: Event) {
    const input = e.target as HTMLInputElement;

    this.range.update((r) => ({
      ...r,
      to: Math.max(
        this.range().from,
        parseInt(input.value, 10) || this.default().to,
      ),
    }));
  }
}
