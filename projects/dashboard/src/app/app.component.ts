import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DraggableDirective } from './shared/draggable/draggable.directive';

@Component({
  selector: 'db-root',
  standalone: true,
  imports: [RouterOutlet, DraggableDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'dashboard';
}
