import {
  Component,
  ElementRef,
  NgZone,
  OnInit,
  Renderer2,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

@Component({
  selector: 'db-widget',
  standalone: true,
  imports: [],
  templateUrl: './widget.component.html',
  styleUrl: './widget.component.scss',
})
export class WidgetComponent implements OnInit {
  private _renderer = inject(Renderer2);
  private _elRef = inject(ElementRef);
  private _zone = inject(NgZone);

  type = input<string>('');
  remove = output<void>();
  counter = signal<number>(Math.round(Math.random() * 100));

  constructor() {
    // const interval = Math.round(Math.max(1500, Math.random() * 10000));
    // this._zone.runOutsideAngular(() => {
    //   setInterval(() => {
    //     this._zone.run(() => {
    //       this.counter.update((ct) => ct + 1);
    //     });
    //   }, interval);
    // });
  }

  ngOnInit() {
    this._renderer.addClass(this._elRef.nativeElement, this.type());
  }
}
