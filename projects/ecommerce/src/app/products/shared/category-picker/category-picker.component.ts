import { Component, inject, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CategoriesService } from '../../../data-access/categories.service';

@Component({
  selector: 'ec-category-picker',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './category-picker.component.html',
  styleUrl: './category-picker.component.scss',
})
export class CategoryPickerComponent {
  categories = inject(CategoriesService);
  categoryId = input.required<string>();
}
