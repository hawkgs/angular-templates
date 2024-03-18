import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  forwardRef,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

// Input debounce time
const INPUT_DEBOUNCE = 250;

@Component({
  selector: 'ec-search-input',
  standalone: true,
  imports: [],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchInputComponent),
      multi: true,
    },
  ],
})
export class SearchInputComponent implements ControlValueAccessor {
  inputRef = viewChild<ElementRef>('inputRef');
  value = signal<string>('');
  disabled = signal<boolean>(false);
  @Output() focused = new EventEmitter<boolean>();

  placeholder = input<string>('');

  private _timeout?: ReturnType<typeof setTimeout>;
  private _onChange!: (v: string) => void;
  private _onTouched!: () => void;

  onSearch(e: Event) {
    if (this._timeout) {
      clearTimeout(this._timeout);
    }

    this._timeout = setTimeout(() => {
      const input = e.target as HTMLInputElement;
      this._onChange(input.value);
      this._onTouched();
    }, INPUT_DEBOUNCE);
  }

  writeValue(value: string): void {
    this.value.set(value);
  }

  registerOnChange(fn: (v: string) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this._onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean) {
    this.disabled.set(isDisabled);
  }
}
