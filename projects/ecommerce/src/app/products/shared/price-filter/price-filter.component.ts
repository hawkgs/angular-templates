import { DOCUMENT } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  model,
  viewChild,
} from '@angular/core';

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
  private _doc = inject(DOCUMENT);

  fromInput = viewChild.required<ElementRef>('fromInput');
  toInput = viewChild.required<ElementRef>('toInput');

  default = input.required<PriceRange>();
  range = model<PriceRange>({ from: 0, to: 0 });

  // Blur inputs on Enter press
  @HostListener('document:keypress', ['$event'])
  onKeyPress(e: KeyboardEvent) {
    if (e.code === 'Enter') {
      const activeEl = this._doc.activeElement;

      if (this.fromInput().nativeElement === activeEl) {
        this.fromInput().nativeElement.blur();
      } else if (this.toInput().nativeElement === activeEl) {
        this.toInput().nativeElement.blur();
      }
    }
  }

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
