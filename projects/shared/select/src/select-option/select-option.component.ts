import {
  AfterContentInit,
  Component,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

export type SelectedOption = {
  value: string;
  text: string;
};

@Component({
  selector: 'ngx-select-option',
  standalone: true,
  imports: [],
  templateUrl: './select-option.component.html',
  styleUrl: './select-option.component.scss',
})
export class SelectOptionComponent implements AfterContentInit {
  button = viewChild.required<ElementRef>('btn');
  value = input.required<string>();
  optionSelect = output<SelectedOption>();

  presentationText = signal<string>('');

  ngAfterContentInit() {
    this._extractPresentationText();
  }

  onSelect(e: Event) {
    e.stopPropagation();

    this.optionSelect.emit({
      value: this.value(),
      text: this.presentationText(),
    });
  }

  private _extractPresentationText() {
    const btnEl = this.button().nativeElement;
    this.presentationText.set(btnEl.innerText);
  }
}
