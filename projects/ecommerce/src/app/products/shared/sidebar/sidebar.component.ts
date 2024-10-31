import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { ProductSearchComponent } from '../product-search/product-search.component';
import { ExpandableContComponent } from '../../../shared/expandable-cont/expandable-cont.component';
import { CategoryPickerComponent } from '../category-picker/category-picker.component';
import {
  PriceFilterComponent,
  PriceRange,
} from '../price-filter/price-filter.component';
import {
  SortSelectorComponent,
  SortType,
} from '../sort-selector/sort-selector.component';

/**
 * Created as a hydration demo
 */
@Component({
  selector: 'ec-sidebar',
  standalone: true,
  imports: [
    ProductSearchComponent,
    ExpandableContComponent,
    CategoryPickerComponent,
    PriceFilterComponent,
    SortSelectorComponent,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  defaults = input.required<{
    categoryName: string;
    priceRange: PriceRange;
  }>();

  categoryId = input.required<string>();
  priceRange = input.required<PriceRange>();
  sortType = input.required<SortType>();

  productSearch = output<string>();
  priceRangeChange = output<PriceRange>();
  sort = output<SortType>();
}
