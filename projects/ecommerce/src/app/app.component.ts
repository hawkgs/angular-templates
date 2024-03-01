import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductsService } from './state/products.service';
import { ThemeService } from './shared/theme.service';
import { fetchApiProvider } from './shared/fetch';
import { ProductsApi } from './api/products-api.service';

@Component({
  selector: 'ec-root',
  standalone: true,
  imports: [RouterOutlet],
  providers: [fetchApiProvider, ProductsApi, ProductsService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  products = inject(ProductsService);
  theme = inject(ThemeService);

  getProducts() {
    this.products.loadProducts();
  }
}
