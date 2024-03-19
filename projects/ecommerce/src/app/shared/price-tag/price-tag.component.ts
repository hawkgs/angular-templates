import { Component, input } from '@angular/core';
import { Product } from '../../../models';
import { CurrencyPipe } from '../pipes/currency.pipe';
import { PercentPipe } from '@angular/common';

@Component({
  selector: 'ec-price-tag',
  standalone: true,
  imports: [CurrencyPipe, PercentPipe],
  templateUrl: './price-tag.component.html',
  styleUrl: './price-tag.component.scss',
})
export class PriceTagComponent {
  product = input.required<Product>();
  type = input<'minimal' | 'normal'>('minimal');
}
