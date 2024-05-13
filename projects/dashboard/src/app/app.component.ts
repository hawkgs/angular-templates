import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule, DOCUMENT } from '@angular/common';
import { DRAG_AND_DROP_DIRECTIVES } from '@ngx-templates/shared';
import { List } from 'immutable';

import { WidgetComponent } from './shared/widget/widget.component';

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
    WidgetComponent,
    DRAG_AND_DROP_DIRECTIVES,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  doc = inject(DOCUMENT);

  title = 'dashboard';
  disabled = signal<boolean>(false);
  widgets = signal<List<Widget>>(list);

  constructor() {
    let l = list;
    for (let i = 0; i < 50; i++) {
      l = l.push({
        id: 'vr' + i,
        position: list.size,
        type: 'empty',
      });
    }
    this.widgets.set(l);
  }

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
