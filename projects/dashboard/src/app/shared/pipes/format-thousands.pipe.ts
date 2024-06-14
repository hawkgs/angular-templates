import { Pipe, PipeTransform } from '@angular/core';
import { precisionRound } from '../utils';

@Pipe({
  name: 'formatThousands',
  standalone: true,
})
export class FormatThousandsPipe implements PipeTransform {
  transform(value: number) {
    if (value >= 1000000) {
      const d = value / 1000000;
      return precisionRound(d, 1) + 'M';
    } else if (value >= 1000) {
      const d = value / 1000;
      return precisionRound(d, 1) + 'K';
    }
    return precisionRound(value, 1);
  }
}
