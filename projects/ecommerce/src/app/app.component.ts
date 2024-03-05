import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductsService } from './state/products.service';
import { ThemeService } from './shared/theme.service';
import { fetchMockApiProvider } from './shared/fetch';
import { ProductsApi } from './api/products-api.service';
import { CategoriesApi } from './api/categories-api.service';
import { CategoriesService } from './state/categories.service';

@Component({
  selector: 'ec-root',
  standalone: true,
  imports: [RouterOutlet],
  // Substitute "fetchMockApiProvider" with "fetchApiProvider"
  // in order to perform actual network requests via the Fetch API
  providers: [
    fetchMockApiProvider,
    CategoriesApi,
    ProductsApi,
    CategoriesService,
    ProductsService,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  categories = inject(CategoriesService);
  products = inject(ProductsService);
  theme = inject(ThemeService);

  ngOnInit(): void {
    this.categories.loadCategories();
  }

  getProducts() {
    this.products.loadProducts();
  }
}
