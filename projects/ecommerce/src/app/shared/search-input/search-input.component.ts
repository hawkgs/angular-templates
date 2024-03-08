import { Component, EventEmitter, Output } from '@angular/core';

const INPUT_DEBOUNCE = 250;

@Component({
  selector: 'ec-search-input',
  standalone: true,
  imports: [],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss',
})
export class SearchInputComponent {
  @Output() search = new EventEmitter<string>();
  private _timeout?: ReturnType<typeof setTimeout>;

  onSearch(e: Event) {
    if (this._timeout) {
      clearTimeout(this._timeout);
    }

    this._timeout = setTimeout(() => {
      const input = e.target as HTMLInputElement;
      this.search.emit(input.value);
    }, INPUT_DEBOUNCE);
  }
}
