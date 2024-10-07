import { isPlatformServer } from '@angular/common';
import {
  afterNextRender,
  Component,
  ElementRef,
  inject,
  input,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  OnDestroy,
  InjectionToken,
  output,
  NgZone,
} from '@angular/core';
import { HydrationService } from '../hydration.service';

// Supported hydration triggers
type HydrationTrigger = 'immediate' | 'hover' | 'interaction' | 'viewport';

const NON_HYDRATED_CLASS = 'non-hydrated';
const HYDRATING_CLASS = 'hydrating';
const DELAY_CLASS = 'artificial-delay';
const HYDRATION_ANIM_DURATION = 1500;

export type HydrationState = 'started' | 'hydrated';

export const VISUALIZER = new InjectionToken<HydrationVisualizerComponent>(
  'VISUALIZER',
);

let instanceId = 0;

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

  // Until we transition to zoneless mode
  private _zone = inject(NgZone);

  hydrating = false;

  private _id: string;
  private _listeners: (() => void)[] = [];
  private _observerResolver!: (io: IntersectionObserver) => void;
  private _observer = new Promise<IntersectionObserver>(
    (res) => (this._observerResolver = res),
  );
  private _destroyed = false;

  /**
   * The hydration trigger MUST be provided and be the same,
   * as the one in the @defer block, for the proper operation of the component.
   * Note that not all of the triggers are currently supported.
   */
  trigger = input.required<HydrationTrigger>();

  hydration = output<{ visId: string; state: HydrationState }>();

  constructor() {
    // Only initiate hydration visualization for
    // server-rendered components.
    if (isPlatformServer(this._platformId)) {
      this._renderer.addClass(this._el, NON_HYDRATED_CLASS);
    }

    this._id = instanceId.toString();
    instanceId++;

    // Initializing the intersection observer during SSR
    // breaks the UI. This is why we are forced to do it
    // in the browser; hence, all the prerequisite code.
    afterNextRender(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            this._hydrate();
          }
        },
        { threshold: 0.1 },
      );
      this._observerResolver(observer);
    });

    this._hydrationService.registerVisualizer(this);
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
    this._destroyed = true;
    this._listeners.forEach((fn) => fn());
    this._observer.then((o) => o.unobserve(this._el));
  }

  notify(state: HydrationState) {
    // Sometimes `notify` is called from the hydration target
    // after the visualizer had been destroyed. Have to
    // investigate why this occurs (probabaly the artifical delay with
    // setTimeout; i.e. both components are already destroyed after nav).
    // This is rather a patch. Another way would be to inject the
    // visualizer as a WeakRef potentially.
    if (!this._destroyed) {
      this.hydration.emit({ visId: this._id, state });
    }
  }

  private _hydrate() {
    if (this._isHydrated || this.hydrating) {
      return;
    }
    this.notify('started');
    this.hydrating = true;

    // Animate hydration

    if (this._hydrationService.fetchDelay) {
      // Enable an additional animation, if there is a fetch delay
      this._renderer.addClass(this._el, DELAY_CLASS);
    }

    // Note(Georgi): This is temporary needed to mark the
    // component as stable as soon as possible and proceed
    // with partial hydation (else, it will be delayed).
    this._zone.runOutsideAngular(() => {
      setTimeout(() => {
        this._renderer.removeClass(this._el, NON_HYDRATED_CLASS);
        this._renderer.removeClass(this._el, DELAY_CLASS);
        this._renderer.addClass(this._el, HYDRATING_CLASS);

        setTimeout(
          () => this._renderer.removeClass(this._el, HYDRATING_CLASS),
          HYDRATION_ANIM_DURATION,
        );
      }, this._hydrationService.fetchDelay);
    });
  }
}
