import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CategoriesService } from './state/categories.service';

@Component({
  selector: 'ec-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  categories = inject(CategoriesService);

  ngOnInit(): void {
    this.categories.loadCategories();
  }
}
