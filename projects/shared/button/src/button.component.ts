/* eslint-disable @angular-eslint/no-host-metadata-property */
/* eslint-disable @angular-eslint/component-selector */
import {
  Component,
  ElementRef,
  HostBinding,
  OnInit,
  Renderer2,
  inject,
  input,
} from '@angular/core';

type ButtonType = 'primary' | 'secondary';

@Component({
  selector: 'button[ngx-button]',
  standalone: true,
  imports: [],
  template: '<ng-content></ng-content>',
  styleUrl: './button.component.scss',
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
