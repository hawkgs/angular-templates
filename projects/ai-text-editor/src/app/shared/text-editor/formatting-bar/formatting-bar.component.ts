import { Component, output } from '@angular/core';

export type FormatCommandType = 'bold' | 'italics' | 'underlined';

@Component({
  selector: 'ate-formatting-bar',
  standalone: true,
  imports: [],
  templateUrl: './formatting-bar.component.html',
  styleUrl: './formatting-bar.component.scss',
})
export class FormattingBarComponent {
  format = output<FormatCommandType>();
}
