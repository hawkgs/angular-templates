import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  inject,
  input,
} from '@angular/core';
import { Widget } from '../widget';
import { DataItem } from '../../../data/types';

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
export class PlainWidgetComponent
  implements OnInit, Widget<PlainWidgetConfig, DataItem>
{
  private _renderer = inject(Renderer2);
  private _elRef = inject(ElementRef);

  config = input.required<PlainWidgetConfig>();
  data = input.required<DataItem>();

  ngOnInit() {
    this._renderer.addClass(
      this._elRef.nativeElement,
      this.config().style as unknown as string,
    );
  }
}
