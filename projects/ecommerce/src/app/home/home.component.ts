import { Component, inject } from '@angular/core';
import { ProductsService } from '../state/products.service';
import { ProductItemComponent } from '../shared/product-item/product-item.component';

@Component({
  selector: 'ec-home',
  standalone: true,
  imports: [ProductItemComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  products = inject(ProductsService);
}
