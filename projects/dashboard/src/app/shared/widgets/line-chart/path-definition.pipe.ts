import { Pipe, PipeTransform } from '@angular/core';
import { TabularDataItem } from '../../../data/types';

@Pipe({
  name: 'pathDefinition',
  standalone: true,
})
export class PathDefinitionPipe implements PipeTransform {
  transform(
    data: TabularDataItem,
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
