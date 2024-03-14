import { Component, computed, inject } from '@angular/core';

import { ProductItemComponent } from '../shared/product-item/product-item.component';
import { ProductSearchComponent } from './shared/product-search/product-search.component';
import { CategoryReelComponent } from './shared/category-reel/category-reel.component';
import { CategoriesService } from '../data-access/categories.service';

// Limit the number of categories
// that are shown on the home page.
const CATEGORY_REELS_COUNT = 3;

@Component({
  selector: 'ec-home',
  standalone: true,
  imports: [
    ProductItemComponent,
    ProductSearchComponent,
    CategoryReelComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private _categories = inject(CategoriesService);

  categories = computed(() =>
    this._categories.categoriesList().take(CATEGORY_REELS_COUNT),
  );
}
