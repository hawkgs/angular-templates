import { Component, computed, input, output } from '@angular/core';
import { LABEL_COLORS } from '../../label-coloring/label-colors';
import { Label } from '../../../../../models';

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

  color = computed(() => LABEL_COLORS.get(this.label().color)!);
}
