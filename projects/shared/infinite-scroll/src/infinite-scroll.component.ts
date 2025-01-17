import {
  ChangeDetectionStrategy,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  inject,
  input,
  output,
} from '@angular/core';
import { WINDOW } from '@ngx-templates/shared/services';
import { IconComponent } from '@ngx-templates/shared/icon';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

// This is a scroll offset value that
// takes into account the relative size
// of the footer.
const SCROLL_OFFSET = 320;

export type CompleteFn = () => void;

@Component({
  selector: 'ngx-infinite-scroll',
  imports: [IconComponent],
  templateUrl: './infinite-scroll.component.html',
  styleUrl: './infinite-scroll.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfiniteScrollComponent implements OnInit, OnDestroy {
  private _win = inject(WINDOW);
  private _doc = inject(DOCUMENT);
  private _platformId = inject(PLATFORM_ID);
  private _renderer = inject(Renderer2);
  private _zone = inject(NgZone);

  private _endReached = false;
  private _listeners: (() => void)[] = [];

  /**
   * Provide a custom scroll container.
   *
   * Default: `window`
   */
  scrollCont = input<HTMLElement | null>(null);

  /**
   * Emitted when the end of the container is reached.
   *
   * @event CompleteFn – Should be called when the data is loaded.
   */
  loadNext = output<CompleteFn>();

  ngOnInit() {
    this._addEventListeners();
  }

  ngOnDestroy() {
    for (const l of this._listeners) {
      l();
    }
  }

  onLoadNext() {
    this._endReached = true;

    this.loadNext.emit(() => {
      this._endReached = false;
    });
  }

  private _addEventListeners() {
    if (!isPlatformBrowser(this._platformId)) {
      return;
    }

    this._zone.runOutsideAngular(() => {
      const scrollCont = this.scrollCont();
      let listener: () => void;

      const endReached = (scrollHeight: number, scrolledY: number) => {
        if (!this._endReached && SCROLL_OFFSET >= scrollHeight - scrolledY) {
          this._zone.run(() => this.onLoadNext());
        }
      };

      if (!scrollCont) {
        listener = this._renderer.listen(this._win, 'scroll', () => {
          const scrolledY = this._win.scrollY + this._win.innerHeight;
          const scrollHeight = this._doc.body.scrollHeight;
          endReached(scrollHeight, scrolledY);
        });
      } else {
        const el = scrollCont;
        listener = this._renderer.listen(el, 'scroll', () => {
          // Since the scroll could be inverted, we are using the absolute value.
          const scrolledY = el.clientHeight + Math.abs(el.scrollTop);
          endReached(el.scrollHeight, scrolledY);
        });
      }

      this._listeners.push(listener);
    });
  }
}
