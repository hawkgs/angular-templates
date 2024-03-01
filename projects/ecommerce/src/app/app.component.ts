import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiModule } from './api/api.module';
import { ProductsService } from './state/products.service';
import { ThemeService } from './shared/theme.service';

@Component({
  selector: 'ec-root',
  standalone: true,
  imports: [RouterOutlet, ApiModule],
  providers: [ProductsService],
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
