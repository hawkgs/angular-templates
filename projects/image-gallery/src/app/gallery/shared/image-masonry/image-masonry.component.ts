import {
  Component,
  ElementRef,
  HostListener,
  Renderer2,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { WINDOW } from '@ngx-templates/shared/services';
import { List } from 'immutable';

import { ImageComponent } from './image/image.component';
import { Image } from '../../../shared/image';

const COLUMNS_COUNT = 4;
const RESIZE_DEBOUNCE = 100;
const PRIORITIZE_FIRST = 4;

type ExtendedImage = {
  index: number;
  image: Image;
};

@Component({
  selector: 'ig-image-masonry',
  standalone: true,
  imports: [ImageComponent],
  templateUrl: './image-masonry.component.html',
  styleUrl: './image-masonry.component.scss',
})
export class ImageMasonryComponent {
  private _renderer = inject(Renderer2);
  private _elementRef = inject(ElementRef);
  private _win = inject(WINDOW);
  private _timeout?: ReturnType<typeof setTimeout>;

  PRIORITIZE_FIRST = PRIORITIZE_FIRST;

  images = input.required<List<Image>>();
  imageClick = output<{ index: number }>();

  columnsCount = signal(COLUMNS_COUNT);

  columns = computed<List<List<ExtendedImage>>>(() => {
    let columns = List<List<ExtendedImage>>([]);
    const columnsCount = this.columnsCount();

    this.images().forEach((image, i) => {
      const colIdx = i % columnsCount;
      let col = columns.get(colIdx) || List<ExtendedImage>([]);
      col = col.push({ image, index: i });

      columns = columns.set(colIdx, col);
    });

    return columns;
  });

  constructor() {
    this._updateColumnsCount();

    effect(() => {
      const gridTemplateColumns = `repeat(${this.columnsCount()}, 1fr)`;
      this._renderer.setStyle(
        this._elementRef.nativeElement,
        'grid-template-columns',
        gridTemplateColumns,
      );
    });
  }

  @HostListener('window:resize')
  onResize() {
    if (this._timeout) {
      clearTimeout(this._timeout);
    }
    this._timeout = setTimeout(
      () => this._updateColumnsCount(),
      RESIZE_DEBOUNCE,
    );
  }

  private _updateColumnsCount() {
    const width = this._win.innerWidth;
    let cols = COLUMNS_COUNT;

    if (width <= 500) {
      cols = 1;
    } else if (width <= 700) {
      cols = 2;
    } else if (width <= 900) {
      cols = 3;
    }

    if (cols !== this.columnsCount()) {
      this.columnsCount.set(cols);
    }
  }
}
