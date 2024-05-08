import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  Coor,
  DraggableDirective,
} from './shared/draggable/draggable.directive';

@Component({
  selector: 'db-root',
  standalone: true,
  imports: [RouterOutlet, DraggableDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'dashboard';

  anchor = signal<Coor>({ x: 0, y: 0 });

  onDragStart({ elContPos }: { elContPos: Coor }) {
    this.anchor.set(elContPos);
  }

  onDrag({ pos }: { pos: Coor }) {
    // console.log(pos);
  }
}
