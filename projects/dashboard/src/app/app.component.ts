import {
  AfterContentInit,
  Component,
  EmbeddedViewRef,
  Injector,
  NgZone,
  TemplateRef,
  ViewContainerRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  Coor,
  DraggableDirective,
} from './shared/draggable/draggable.directive';
import { WidgetComponent } from './shared/widget/widget.component';

@Component({
  selector: 'db-root',
  standalone: true,
  imports: [RouterOutlet, DraggableDirective, WidgetComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements AfterContentInit {
  title = 'dashboard';

  // Note: This is under development. Test code. Move to a Grid component
  private _injector = inject(Injector);
  private _zone = inject(NgZone);

  widget = viewChild('draggableWidget', { read: TemplateRef });
  leftCont = viewChild('leftCont', { read: ViewContainerRef });
  rightCont = viewChild('rightCont', { read: ViewContainerRef });

  anchor = signal<Coor>({ x: 0, y: 0 });
  cont: 'left' | 'right' = 'left';
  drag = false;
  private _widgetViewRef?: EmbeddedViewRef<unknown>;

  ngAfterContentInit(): void {
    this._widgetViewRef = this.widget()!.createEmbeddedView(this._injector);
    this.leftCont()!.insert(this._widgetViewRef);
  }

  onDragStart({ elContPos }: { elContPos: Coor }) {
    this.anchor.set(elContPos);
    this.drag = true;
  }

  onDrag({ pos }: { pos: Coor }) {
    const mid = window.innerHeight / 2;

    if (pos.x >= mid && this.cont === 'left') {
      console.log('Updating anchor to RIGHT 546 30');

      this._zone.run(() => {
        this.anchor.set({
          x: mid - 24,
          y: 30,
        });
      });
      this.cont = 'right';
    } else if (pos.x < mid && this.cont === 'right') {
      console.log('Updating anchor to LEFT 30 30');

      this._zone.run(() => {
        this.anchor.set({
          x: 30,
          y: 30,
        });
      });
      this.cont = 'left';
    }
  }

  onAnchored() {
    this.drag = false;

    if (this.cont === 'right') {
      this.leftCont()!.detach();
      this.rightCont()!.insert(this._widgetViewRef!);
    } else {
      this.rightCont()!.detach();
      this.leftCont()!.insert(this._widgetViewRef!);
    }
  }
}
