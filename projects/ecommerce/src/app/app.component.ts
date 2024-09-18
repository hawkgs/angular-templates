import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TOASTS_COMPONENTS } from '@ngx-templates/shared/toasts';

import { CategoriesService } from './data-access/categories.service';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { LoaderComponent } from './shared/loader/loader.component';
import { LoaderService } from './shared/loader.service';
import {
  HYDRATION_DIRECTIVES,
  HydrationControlPanelComponent,
} from './shared/hydration';
import { HydrationService } from './shared/hydration/hydration.service';

@Component({
  selector: 'ec-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    LoaderComponent,
    TOASTS_COMPONENTS,
    HydrationControlPanelComponent,
    HYDRATION_DIRECTIVES,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  categories = inject(CategoriesService);
  loader = inject(LoaderService);
  hydration = inject(HydrationService);

  ngOnInit(): void {
    this.categories.loadCategories();
  }
}
