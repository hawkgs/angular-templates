import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CategoriesService } from '../../../data-access/categories.service';

@Component({
  selector: 'ec-category-picker',
  imports: [RouterModule],
  templateUrl: './category-picker.component.html',
  styleUrl: './category-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryPickerComponent {
  categories = inject(CategoriesService);
  categoryId = input.required<string>();
  defaultCategoryName = input.required<string>();
}
