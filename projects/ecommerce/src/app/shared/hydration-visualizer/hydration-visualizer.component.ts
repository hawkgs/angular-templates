import { isPlatformServer } from '@angular/common';
import {
  afterNextRender,
  AfterRenderPhase,
  Component,
  ElementRef,
  inject,
  input,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  OnDestroy,
} from '@angular/core';

// Supported hydration triggers
type HydrationTrigger = 'immediate' | 'hover' | 'interaction' | 'viewport';

const NON_HYDRATED_CLASS = 'ec-non-hydrated';
const HYDRATING_CLASS = 'ec-hydrating';
const HYDRATION_ANIM_DURATION = 1500;

let once = false;

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
export class HydrationVisualizerComponent implements OnInit, OnDestroy {
  private _renderer = inject(Renderer2);
  private _element = inject(ElementRef);
  private _platformId = inject(PLATFORM_ID);

  private _listeners: (() => void)[] = [];
  private _observerResolver!: (io: IntersectionObserver) => void;
  private _observer = new Promise<IntersectionObserver>(
    (res) => (this._observerResolver = res),
  );

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

    // Initializing the intersection observer during SSR
    // breaks the UI. This is why we are forced to do it
    // in the browser; hence, all the prerequisite code.
    afterNextRender(
      () => {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              this._hydrate();
            }
          },
          { threshold: 0.1 },
        );
        this._observerResolver(observer);
      },
      { phase: AfterRenderPhase.Read },
    );
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
        this._listeners.push(
          this._renderer.listen(this._el, 'mouseenter', () => {
            this._hydrate();
          }),
        );
        break;
      case 'interaction':
        this._listeners.push(
          this._renderer.listen(this._el, 'click', () => this._hydrate()),
        );
        break;
      case 'viewport':
        this._observer.then((o) => o.observe(this._el));
        break;
    }
  }

  ngOnDestroy() {
    this._listeners.forEach((fn) => fn());
    this._observer.then((o) => o.unobserve(this._el));
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
