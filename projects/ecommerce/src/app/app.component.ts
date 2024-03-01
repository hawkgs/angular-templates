import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductsService } from './state/products.service';
import { ThemeService } from './shared/theme.service';
import { fetchMockApiProvider } from './shared/fetch';
import { ProductsApi } from './api/products-api.service';

@Component({
  selector: 'ec-root',
  standalone: true,
  imports: [RouterOutlet],
  // Substitute "fetchMockApiProvider" with "fetchApiProvider"
  // in order to perform actual network requests via the Fetch API
  providers: [fetchMockApiProvider, ProductsApi, ProductsService],
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
