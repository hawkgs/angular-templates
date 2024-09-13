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
  HostBinding,
  InjectionToken,
  output,
} from '@angular/core';
import { HydrationService } from '../hydration.service';

// Supported hydration triggers
type HydrationTrigger = 'immediate' | 'hover' | 'interaction' | 'viewport';

const NON_HYDRATED_CLASS = 'ec-non-hydrated';
const HYDRATING_CLASS = 'ec-hydrating';
const HYDRATION_ANIM_DURATION = 1500;

export type HydrationState = 'started' | 'hydrated';

export const VISUALIZER = new InjectionToken<HydrationVisualizerComponent>(
  'VISUALIZER',
);

// Note(Georgi): Temp
let id = 0;

/**
 * Visualizes the hydration process of a component.
 * Should wrap the @defer block.
 */
@Component({
  selector: 'ec-hydration-visualizer',
  standalone: true,
  template: '<ng-content></ng-content>',
  styleUrl: './hydration-visualizer.component.scss',
  providers: [
    {
      provide: VISUALIZER,
      useExisting: HydrationVisualizerComponent,
    },
  ],
})
export class HydrationVisualizerComponent implements OnInit, OnDestroy {
  private _renderer = inject(Renderer2);
  private _element = inject(ElementRef);
  private _platformId = inject(PLATFORM_ID);
  private _hydrationService = inject(HydrationService);

  private _id: string;
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

  /**
   * Disable hydration of the wrapped component.
   */
  disabled = input<boolean>(false);

  hydration = output<{ visId: string; state: HydrationState }>();

  constructor() {
    // Only initiate hydration visualization for
    // server-rendered components.
    if (isPlatformServer(this._platformId)) {
      this._renderer.addClass(this._el, NON_HYDRATED_CLASS);
    }

    this._id = id.toString();
    id++;

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

    this._hydrationService.registerVisualizer(this);
  }

  @HostBinding('style.pointer-events')
  private get _pointerEvents() {
    return this.disabled() ? 'none' : 'initial';
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
          this._renderer.listen(this._el, 'mouseenter', (e: Event) => {
            e.stopImmediatePropagation();
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

  notify(state: HydrationState) {
    this.hydration.emit({ visId: this._id, state });
  }

  private _hydrate() {
    if (this._isHydrated) {
      return;
    }
    this.notify('started');

    // Animate hydration
    this._renderer.removeClass(this._el, NON_HYDRATED_CLASS);
    this._renderer.addClass(this._el, HYDRATING_CLASS);
    setTimeout(
      () => this._renderer.removeClass(this._el, HYDRATING_CLASS),
      HYDRATION_ANIM_DURATION,
    );
  }
}
