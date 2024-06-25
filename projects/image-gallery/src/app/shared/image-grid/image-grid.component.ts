import { Component, computed, signal } from '@angular/core';
import { ImageComponent, ImageConfig } from './image/image.component';
import { List } from 'immutable';
import { IMAGES } from './images';

const COLUMNS_COUNT = 4;
const IMG_CFGS = IMAGES.map((ar, i) => ({
  aspectRatio: ar,
  idx: i,
  priority: i <= COLUMNS_COUNT * 3,
}));

@Component({
  selector: 'ig-image-grid',
  standalone: true,
  imports: [ImageComponent],
  templateUrl: './image-grid.component.html',
  styleUrl: './image-grid.component.scss',
})
export class ImageGridComponent {
  images = signal<List<ImageConfig>>(List(IMG_CFGS));
  columnsCount = signal(COLUMNS_COUNT);

  columns = computed<List<List<ImageConfig>>>(() => {
    let columns = List<List<ImageConfig>>([]);
    const columnsCount = this.columnsCount();

    this.images().forEach((c, i) => {
      const colIdx = i % columnsCount;
      let col = columns.get(colIdx) || List<ImageConfig>([]);
      col = col.push(c);

      columns = columns.set(colIdx, col);
    });

    return columns;
  });
}
