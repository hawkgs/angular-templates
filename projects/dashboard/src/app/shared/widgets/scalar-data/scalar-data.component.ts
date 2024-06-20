import {
  Component,
  OnChanges,
  SimpleChanges,
  computed,
  input,
  signal,
} from '@angular/core';
import { IconComponent } from '@ngx-templates/shared/icon';

import { Widget } from '../widget';
import { DataItem } from '../../../data/types';
import { FormatThousandsPipe } from '../../pipes/format-thousands.pipe';
import { WidgetTooltipDirective } from '../widget-tooltip/widget-tooltip.directive';

export type ScalarDataConfig = void;

@Component({
  selector: 'db-scalar-data',
  standalone: true,
  imports: [FormatThousandsPipe, WidgetTooltipDirective, IconComponent],
  templateUrl: './scalar-data.component.html',
  styleUrl: './scalar-data.component.scss',
})
export class ScalarDataComponent
  implements Widget<ScalarDataConfig, DataItem>, OnChanges
{
  data = input.required<DataItem>();
  config = input<ScalarDataConfig>();
  prevData = signal<DataItem | undefined>(undefined);

  change = computed(() => {
    const prevData = this.prevData();
    return prevData ? this.data().value - prevData.value : 0;
  });

  ngOnChanges(changes: SimpleChanges) {
    this.prevData.set(changes['data'].previousValue);
  }
}
