import { Component, input, output, signal } from '@angular/core';
import { SELECT_COMPONENTS } from '@ngx-templates/shared/select';
import { TextStyle } from '../formatting.service';

export type FormatCommandType =
  | 'bold'
  | 'italics'
  | 'underlined'
  | 'hyperlink'
  | 'text-style';

export type FormatEvent = {
  command: FormatCommandType;
  parameter?: string;
};

@Component({
  selector: 'ate-formatting-bar',
  standalone: true,
  imports: [SELECT_COMPONENTS],
  templateUrl: './formatting-bar.component.html',
  styleUrl: './formatting-bar.component.scss',
})
export class FormattingBarComponent {
  isTextSelected = input.required<boolean>();
  format = output<FormatEvent>();
  textStyle = signal<TextStyle>('body');
}
