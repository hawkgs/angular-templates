import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  THEME_COMPONENTS,
  IconComponent,
  ThemeService,
} from '@ngx-templates/shared';

import { CategoriesService } from '../../data-access/categories.service';

@Component({
  selector: 'ec-footer',
  standalone: true,
  imports: [RouterModule, IconComponent, THEME_COMPONENTS],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  theme = inject(ThemeService);
  categories = inject(CategoriesService);
}
