import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CategoriesService } from './data-access/categories.service';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { LoaderComponent } from './shared/loader/loader.component';
import { LoaderService } from './shared/loader.service';
import { ToastFeedComponent } from './shared/toast-feed/toast-feed.component';

@Component({
  selector: 'ec-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    LoaderComponent,
    ToastFeedComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  categories = inject(CategoriesService);
  loader = inject(LoaderService);

  ngOnInit(): void {
    this.categories.loadCategories();
  }
}
