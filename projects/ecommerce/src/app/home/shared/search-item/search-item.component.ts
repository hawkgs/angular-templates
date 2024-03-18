import { Component, ElementRef, Input, input, viewChild } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Product } from '../../../../models';
import { createProductUrl } from '../../../shared/utils/create-product-url';

@Component({
  selector: 'ec-search-item',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './search-item.component.html',
  styleUrl: './search-item.component.scss',
})
export class SearchItemComponent {
  anchorRef = viewChild<ElementRef>('anchorRef');
  createUrl = createProductUrl;

  product = input.required<Product>();

  @Input()
  set focused(value: boolean) {
    if (value) {
      this.anchorRef()?.nativeElement.focus();
    } else {
      this.anchorRef()?.nativeElement.blur();
    }
  }
}
