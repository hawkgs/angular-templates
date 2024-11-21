import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'ngx-select-option',
  imports: [],
  templateUrl: './select-option.component.html',
  styleUrl: './select-option.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectOptionComponent implements AfterContentInit {
  button = viewChild.required<ElementRef>('btn');
  value = input.required<string>();
  optionSelect = output<string>();

  presentationText = signal<string>('');

  ngAfterContentInit() {
    this._extractPresentationText();
  }

  onSelect(e: Event) {
    e.stopPropagation();

    this.optionSelect.emit(this.value());
  }

  // Note(Georgi): A rather unorthodox way to obtain the presentation text
  private _extractPresentationText() {
    const btnEl = this.button().nativeElement;
    this.presentationText.set(btnEl.innerText);
  }
}
