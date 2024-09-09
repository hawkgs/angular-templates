import {
  Directive,
  ElementRef,
  inject,
  input,
  OnInit,
  Renderer2,
} from '@angular/core';

// Supported hydration triggers
type HydrationTrigger = 'immediate' | 'hover' | 'interaction';

const NON_HYDRATED_CLASS = 'ec-non-hydrated';
const HYDRATING_CLASS = 'ec-hydrating';
const HYDRATION_ANIM_DURATION = 1500;

/**
 * Visualizes the hydration process of a component.
 *
 * The hydration trigger MUST be provided and the same,
 * as the one in the @defer block, for the proper operation of the directive.
 * Note that not all of the triggers are currently supported.
 */
@Directive({
  selector: '[ecHydrationVisualizer]',
  standalone: true,
})
export class HydrationVisualizerDirective implements OnInit {
  private _renderer = inject(Renderer2);
  private _element = inject(ElementRef);
  private _hydrated = false;

  trigger = input.required<HydrationTrigger>({
    alias: 'ecHydrationVisualizer',
  });

  constructor() {
    this._renderer.addClass(this._el, NON_HYDRATED_CLASS);
  }

  private get _el() {
    return this._element.nativeElement;
  }

  ngOnInit() {
    switch (this.trigger()) {
      case 'immediate':
        this._hydrate();
        break;
      case 'hover':
        this._renderer.listen(this._el, 'mouseover', () => this._hydrate());
        break;
      case 'interaction':
        this._renderer.listen(this._el, 'click', () => this._hydrate());
        break;
    }
  }

  private _hydrate() {
    if (this._hydrated) {
      return;
    }

    this._hydrated = true;

    // Animate hydration
    this._renderer.removeClass(this._el, NON_HYDRATED_CLASS);
    this._renderer.addClass(this._el, HYDRATING_CLASS);
    setTimeout(
      () => this._renderer.removeClass(this._el, HYDRATING_CLASS),
      HYDRATION_ANIM_DURATION,
    );
  }
}
