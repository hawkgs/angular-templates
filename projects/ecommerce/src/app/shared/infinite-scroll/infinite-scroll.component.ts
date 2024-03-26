import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  Renderer2,
  inject,
} from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { WINDOW } from '../window.provider';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

// This is a scroll offset value that
// takes into account the relative size
// of the footer.
const SCROLL_OFFSET = 320;

@Component({
  selector: 'ec-infinite-scroll',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './infinite-scroll.component.html',
  styleUrl: './infinite-scroll.component.scss',
})
export class InfiniteScrollComponent implements OnInit, OnDestroy {
  private _win = inject(WINDOW);
  private _doc = inject(DOCUMENT);
  private _platformId = inject(PLATFORM_ID);
  private _renderer = inject(Renderer2);
  private _bottomReached = false;
  private _listeners: (() => void)[] = [];

  @Output() loadNext = new EventEmitter<() => void>();

  ngOnInit() {
    if (isPlatformBrowser(this._platformId)) {
      const listener = this._renderer.listen(this._win, 'scroll', () => {
        const scrolledY = this._win.scrollY + this._win.innerHeight;
        const scrollHeight = this._doc.body.scrollHeight;

        if (!this._bottomReached && SCROLL_OFFSET >= scrollHeight - scrolledY) {
          this.onLoadNext();
        }
      });

      this._listeners.push(listener);
    }
  }

  ngOnDestroy() {
    this._listeners.forEach((l) => l());
  }

  onLoadNext() {
    this._bottomReached = true;

    this.loadNext.emit(() => {
      this._bottomReached = false;
    });
  }
}
