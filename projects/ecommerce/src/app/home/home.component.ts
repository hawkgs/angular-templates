import { Component, inject } from '@angular/core';
import { ProductsService } from '../data-access/products.service';
import { ProductItemComponent } from '../shared/product-item/product-item.component';
import { ProductSearchComponent } from '../shared/product-search/product-search.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'ec-home',
  standalone: true,
  imports: [RouterModule, ProductItemComponent, ProductSearchComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  products = inject(ProductsService);
}
