import { Pipe, PipeTransform } from '@angular/core';
import { TabularDataRow } from '../../../data/types';

@Pipe({
  name: 'linePathDefinition',
  standalone: true,
})
export class LinePathDefinitionPipe implements PipeTransform {
  transform(
    data: TabularDataRow,
    args: { dataPointSpacing: number; chartHeight: number },
  ): string {
    const vals = data.values;
    const { dataPointSpacing, chartHeight } = args;
    const first = vals.first() || 0;

    let d = `M0 ${chartHeight - first}`;

    for (let i = 1; i < vals.size; i++) {
      d += ` L${i * dataPointSpacing} ${chartHeight - vals.get(i)!}`;
    }

    return d;
  }
}
