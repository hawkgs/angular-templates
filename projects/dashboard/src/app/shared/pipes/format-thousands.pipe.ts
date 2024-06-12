import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatThousands',
  standalone: true,
})
export class FormatThousandsPipe implements PipeTransform {
  transform(value: number): string {
    if (value >= 1000000) {
      return Math.round(value / 1000000) + 'M';
    } else if (value >= 1000) {
      return Math.round(value / 1000) + 'K';
    }
    return value.toString();
  }
}
