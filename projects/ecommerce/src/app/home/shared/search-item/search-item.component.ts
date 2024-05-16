import { Component, ElementRef, Input, input, viewChild } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Product } from '../../../../models';
import { createProductUrl } from '../../../shared/utils/create-product-url';
import { ProductImageComponent } from '../../../shared/product-image/product-image.component';

@Component({
  selector: 'ec-search-item',
  standalone: true,
  imports: [RouterModule, ProductImageComponent],
  templateUrl: './search-item.component.html',
  styleUrl: './search-item.component.scss',
})
export class SearchItemComponent {
  anchorRef = viewChild.required<ElementRef>('anchorRef');
  createUrl = createProductUrl;

  product = input.required<Product>();

  @Input()
  set focused(value: boolean) {
    if (value) {
      this.anchorRef().nativeElement.focus();
    } else {
      this.anchorRef().nativeElement.blur();
    }
  }
}
