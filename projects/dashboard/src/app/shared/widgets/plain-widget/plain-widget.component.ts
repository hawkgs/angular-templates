import {
  Component,
  ElementRef,
  NgZone,
  OnInit,
  Renderer2,
  inject,
  input,
  signal,
} from '@angular/core';
import { Widget } from '../widget';

export type PlainWidgetConfig = {
  style: 'red' | 'green' | 'blue' | 'purple' | 'orange' | 'gold';
};

@Component({
  selector: 'db-plain-widget',
  standalone: true,
  imports: [],
  templateUrl: './plain-widget.component.html',
  styleUrl: './plain-widget.component.scss',
})
export class PlainWidgetComponent implements OnInit, Widget<PlainWidgetConfig> {
  private _renderer = inject(Renderer2);
  private _elRef = inject(ElementRef);
  private _zone = inject(NgZone);

  config = input.required<PlainWidgetConfig>();
  counter = signal<number>(Math.round(Math.random() * 100));

  constructor() {
    const interval = Math.round(Math.max(1500, Math.random() * 10000));
    this._zone.runOutsideAngular(() => {
      setInterval(() => {
        this._zone.run(() => {
          this.counter.update((ct) => ct + 1);
        });
      }, interval);
    });
  }

  ngOnInit() {
    this._renderer.addClass(
      this._elRef.nativeElement,
      this.config().style as unknown as string,
    );
  }
}
