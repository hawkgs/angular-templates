import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ThemeService } from '../theme.service';
import { CategoriesService } from '../../data-access/categories.service';
import { IconComponent } from '../icon/icon.component';
import { ThemeSwitchComponent } from './theme-switch/theme-switch.component';

@Component({
  selector: 'ec-footer',
  standalone: true,
  imports: [RouterModule, IconComponent, ThemeSwitchComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  theme = inject(ThemeService);
  categories = inject(CategoriesService);
}
