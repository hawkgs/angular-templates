import { isPlatformServer } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  input,
  OnInit,
  PLATFORM_ID,
  Renderer2,
} from '@angular/core';

// Supported hydration triggers
type HydrationTrigger = 'immediate' | 'hover' | 'interaction';

const NON_HYDRATED_CLASS = 'ec-non-hydrated';
const HYDRATING_CLASS = 'ec-hydrating';
const HYDRATION_ANIM_DURATION = 1500;

/**
 * Visualizes the hydration process of a component.
 * Should wrap the @defer block.
 */
@Component({
  selector: 'ec-hydration-visualizer',
  standalone: true,
  template: '<ng-content></ng-content>',
  styleUrl: './hydration-visualizer.component.scss',
})
export class HydrationVisualizerComponent implements OnInit {
  private _renderer = inject(Renderer2);
  private _element = inject(ElementRef);
  private _platformId = inject(PLATFORM_ID);

  /**
   * The hydration trigger MUST be provided and be the same,
   * as the one in the @defer block, for the proper operation of the component.
   * Note that not all of the triggers are currently supported.
   */
  trigger = input.required<HydrationTrigger>();

  constructor() {
    // Only initiate hydration visualization for
    // server-rendered components.
    if (isPlatformServer(this._platformId)) {
      this._renderer.addClass(this._el, NON_HYDRATED_CLASS);
    }
  }

  private get _el(): HTMLElement {
    return this._element.nativeElement;
  }

  private get _isHydrated() {
    return !this._el.classList.contains(NON_HYDRATED_CLASS);
  }

  ngOnInit() {
    switch (this.trigger()) {
      case 'immediate':
        this._hydrate();
        break;
      case 'hover':
        this._renderer.listen(this._el, 'mouseenter', () => this._hydrate());
        break;
      case 'interaction':
        this._renderer.listen(this._el, 'click', () => this._hydrate());
        break;
    }
  }

  private _hydrate() {
    if (this._isHydrated) {
      return;
    }

    // Animate hydration
    this._renderer.removeClass(this._el, NON_HYDRATED_CLASS);
    this._renderer.addClass(this._el, HYDRATING_CLASS);
    setTimeout(
      () => this._renderer.removeClass(this._el, HYDRATING_CLASS),
      HYDRATION_ANIM_DURATION,
    );
  }
}
