/* eslint-disable @angular-eslint/no-host-metadata-property */
/* eslint-disable @angular-eslint/component-selector */
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  inject,
  input,
} from '@angular/core';

type ButtonType = 'primary' | 'secondary' | 'danger';

@Component({
  selector: 'button[ngx-button]',
  imports: [],
  template: '<ng-content />',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ngx-button',
  },
})
export class ButtonComponent implements OnInit {
  private _renderer = inject(Renderer2);
  private _elRef = inject(ElementRef);

  btnType = input.required<ButtonType>();
  size = input<'compact' | 'large' | 'minimal'>('compact');

  ngOnInit() {
    const el = this._elRef.nativeElement;
    this._renderer.addClass(el, `${this.btnType()}-btn`);
    this._renderer.addClass(el, `${this.size()}-size-btn`);
  }
}
