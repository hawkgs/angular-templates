import { Component, input, output } from '@angular/core';
import { Label } from '../../../../models';

@Component({
  selector: 'kb-label',
  standalone: true,
  imports: [],
  templateUrl: './label.component.html',
  styleUrl: './label.component.scss',
})
export class LabelComponent {
  label = input.required<Label>();
  labelClick = output<Label>();
}
