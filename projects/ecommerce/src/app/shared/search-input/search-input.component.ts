import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  forwardRef,
  inject,
  input,
  output,
  Renderer2,
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
export class SearchInputComponent
  implements ControlValueAccessor, AfterViewInit
{
  private _renderer = inject(Renderer2);
  private _doc = inject(DOCUMENT);

  inputRef = viewChild.required<ElementRef>('inputRef');
  value = signal<string>('');
  disabled = signal<boolean>(false);

  focused = output<boolean>();
  placeholder = input<string>('');
  debounce = input<number>(INPUT_DEBOUNCE);

  private _timeout?: ReturnType<typeof setTimeout>;
  private _onChange!: (v: string) => void;
  private _onTouched!: () => void;

  ngAfterViewInit() {
    const input = this.inputRef().nativeElement;

    // Note(Georgi): We are using this method
    // for adding a focus event listener since
    // doing that in the template breaks our hydration
    // event handling and we can't detect the resources
    // downloaded during an interaction. This is most
    // likely related to event replay.
    this._renderer.listen(input, 'focus', () => {
      this.focused.emit(true);
    });
    if (this._doc.activeElement === input) {
      this.focused.emit(true);
    }
  }

  onSearch(e: Event) {
    if (this._timeout) {
      clearTimeout(this._timeout);
    }

    const update = () => {
      const input = e.target as HTMLInputElement;
      this._onChange(input.value);
      this._onTouched();
    };

    if (this.debounce() > 0) {
      this._timeout = setTimeout(() => update(), this.debounce());
    } else {
      update();
    }
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
