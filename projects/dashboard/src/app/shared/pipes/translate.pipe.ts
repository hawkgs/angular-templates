import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translate',
  standalone: true,
})
export class TranslatePipe implements PipeTransform {
  transform(coor: number[]): string {
    return `translate(${coor[0]}, ${coor[1]})`;
  }
}
