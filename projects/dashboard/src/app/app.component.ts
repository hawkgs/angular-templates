import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DropGridComponent } from './shared/drop-grid/drop-grid.component';
import { WidgetComponent } from './shared/widget/widget.component';
import { DraggableDirective } from './shared/draggable/draggable.directive';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'db-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    DropGridComponent,
    WidgetComponent,
    DraggableDirective,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'dashboard';
  widgets = ['red', 'green', 'blue', 'purple', 'orange'];
}
