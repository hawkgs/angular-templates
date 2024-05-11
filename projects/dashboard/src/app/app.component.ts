import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DropGridComponent } from './shared/drag-and-drop/drop-grid.component';
import { WidgetComponent } from './shared/widget/widget.component';
import { DraggableDirective } from './shared/drag-and-drop/draggable.directive';
import { CommonModule } from '@angular/common';
import { List } from 'immutable';

type Widget = { id: string; position: number; type: string };

const list = List([
  {
    id: 'r1',
    position: 0,
    type: 'red',
  },
  {
    id: 'g1',
    position: 1,
    type: 'green',
  },
  { id: 'b1', position: 2, type: 'blue' },
  { id: 'p1', position: 4, type: 'purple' },
  { id: 'o1', position: 3, type: 'orange' },
]);

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
  disabled = signal<boolean>(false);
  widgets = signal<List<Widget>>(list);

  addWidget() {
    this.widgets.update((l) =>
      l.push({
        id: 'random' + Date.now(),
        position: l.size,
        type: 'gold',
      }),
    );
  }

  removeWidget(id: string) {
    this.widgets.update((l) => {
      const idx = l.findIndex((w) => w.id === id);
      return l.remove(idx);
    });
  }
}
