import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { THEME_COMPONENTS, ThemeService } from '@ngx-templates/shared/theme';
import { IconComponent } from '@ngx-templates/shared/icon';

import { CategoriesService } from '../../data-access/categories.service';

@Component({
  selector: 'ec-footer',
  standalone: true,
  imports: [RouterModule, IconComponent, THEME_COMPONENTS],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  theme = inject(ThemeService);
  categories = inject(CategoriesService);
}
