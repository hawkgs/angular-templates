import { Component, forwardRef, input, model, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ngx-switch',
  standalone: true,
  imports: [],
  templateUrl: './switch.component.html',
  styleUrl: './switch.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SwitchComponent),
      multi: true,
    },
  ],
})
export class SwitchComponent implements ControlValueAccessor {
  on = model<boolean>(false);
  disabled = signal<boolean>(false);
  title = input<string>();

  private _onChange?: (v: boolean) => void;
  private _onTouched?: () => void;

  onSwitchToggle(e: Event) {
    const checkbox = e.target as HTMLInputElement;
    const checked = checkbox.checked;
    this.writeValue(checked);

    if (this._onChange && this._onTouched) {
      this._onChange(checked);
      this._onTouched();
    }
  }

  writeValue(value: boolean): void {
    console.log('on', value);
    this.on.set(value);
  }

  registerOnChange(fn: (v: boolean) => void): void {
    console.log('accessor init');
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    console.log('accessor init');

    this._onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
