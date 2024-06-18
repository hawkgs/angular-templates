import { Pipe, PipeTransform } from '@angular/core';
import { List } from 'immutable';
import { DataItem } from '../../../data/types';

type Coor = { x: number; y: number };

@Pipe({
  name: 'sectorPathDefinition',
  standalone: true,
})
export class SectorPathDefinitionPipe implements PipeTransform {
  transform(
    data: List<DataItem>,
    args: { center: Coor; radius: number; idx: number },
  ) {
    const { center, radius, idx } = args;

    let start = 0;
    for (let i = 0; i < idx; i++) {
      start += data.get(i)!.value;
    }
    const end = start + data.get(idx)!.value;

    return this._arc(start * 360, end * 360, radius, center);
  }

  /**
   * Calculate arc.
   */
  private _arc(
    start: number,
    end: number,
    radius: number,
    center: Coor,
  ): string {
    const largeArc = end - start <= 180 ? 0 : 1;
    const startCoor = this._getAngleCoor(start, radius, center);
    const endCoor = this._getAngleCoor(end, radius, center);

    return `M ${endCoor.x} ${endCoor.y} A ${radius} ${radius} 0 ${largeArc} 0 ${startCoor.x} ${startCoor.y}`;
  }

  /**
   * Get angle coordinates (Cartesian coordinates).
   */
  private _getAngleCoor(degrees: number, radius: number, center: Coor): Coor {
    const rads = ((degrees - 90) * Math.PI) / 180;
    return {
      x: radius * Math.cos(rads) + center.x,
      y: radius * Math.sin(rads) + center.y,
    };
  }
}
