import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WidgetGridComponent } from './shared/widget-grid/widget-grid.component';

@Component({
  selector: 'db-root',
  standalone: true,
  imports: [RouterOutlet, WidgetGridComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'dashboard';
}
