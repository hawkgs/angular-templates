import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiModule } from './api/api.module';
import { ProductsService } from './state/products.service';

@Component({
  selector: 'ec-root',
  standalone: true,
  imports: [RouterOutlet, ApiModule],
  providers: [ProductsService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'ecommerce';
  products = inject(ProductsService);

  getProducts() {
    this.products.loadProducts();
  }
}
