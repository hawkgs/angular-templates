import {
  AfterViewInit,
  Directive,
  inject,
  ViewContainerRef,
} from '@angular/core';
import { VISUALIZER } from './hydration-visualizer/hydration-visualizer.component';
import { HydrationService } from './hydration.service';

const MARK_HYDRATED_DELAY = 500;

const hydratedComponents = new Set<string>();

@Directive({
  selector: '[ecHydrationTarget]',
  standalone: true,
})
export class HydrationTargetDirective implements AfterViewInit {
  private _visualizer = inject(VISUALIZER);
  private _hydration = inject(HydrationService);
  private _vcr = inject(ViewContainerRef);

  ngAfterViewInit() {
    // We are marking a component hydrated after a
    // certain delay (MARK_HYDRATED). This is helpful when the
    // component might initiate other network calls
    // like requesting images.
    //
    // Additionally, if a component has already been
    // hydrated but there is a fetch delay, we need to
    // add it to the total delay since the fetch requests
    // triggered by the component will be delayed anyway.
    //
    // This is a very specific implementation that suits ec-category-reel
    const element = this._vcr.element.nativeElement.tagName;
    const hydrated = hydratedComponents.has(element);
    let delay = !hydrated ? 0 : this._hydration.fetchDelay;
    delay += MARK_HYDRATED_DELAY;

    hydratedComponents.add(element);

    setTimeout(() => {
      this._visualizer.notify('hydrated');
    }, delay);
  }
}
