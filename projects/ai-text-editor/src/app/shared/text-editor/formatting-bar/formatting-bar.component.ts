import { Component, input, output } from '@angular/core';

export type FormatCommandType = 'bold' | 'italics' | 'underlined' | 'hyperlink';

@Component({
  selector: 'ate-formatting-bar',
  standalone: true,
  imports: [],
  templateUrl: './formatting-bar.component.html',
  styleUrl: './formatting-bar.component.scss',
})
export class FormattingBarComponent {
  isTextSelected = input.required<boolean>();
  format = output<FormatCommandType>();
}
