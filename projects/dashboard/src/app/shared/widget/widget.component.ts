import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  inject,
  input,
  output,
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

  type = input<string>('');
  remove = output<void>();

  ngOnInit() {
    this._renderer.addClass(this._elRef.nativeElement, this.type());
  }
}
