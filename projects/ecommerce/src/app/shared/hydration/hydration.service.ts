import { computed, inject, Injectable, signal } from '@angular/core';
import { Map, Set as ImmutSet } from 'immutable';
import { WINDOW } from '@ngx-templates/shared/services';

import { HydrationVisualizerComponent } from './hydration-visualizer/hydration-visualizer.component';

@Injectable({ providedIn: 'root' })
export class HydrationService {
  private _win = inject(WINDOW);

  private _hydratedCmps = signal<ImmutSet<string>>(ImmutSet());
  private _fetchedResources = signal<Map<string, number>>(Map());
  private _totalFetched = signal<number>(0);

  private _componentsHydrating = new Set<string>();

  hydratedCmps = computed(() => this._hydratedCmps().size);

  // Hydrated
  fetchedKbs = computed(
    () => this._fetchedResources().reduce((acc, curr) => acc + curr, 0) / 1024,
  );

  // Everything
  totalFetchedKbs = computed(() => this._totalFetched() / 1024);

  constructor() {
    this._listenForNetworkCalls();

    // Note(Georgi): Temp
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this._win as any).hydstats = () => {
      console.log(this._fetchedResources().toJS());
    };
  }

  registerVisualizer(v: HydrationVisualizerComponent) {
    v.hydration.subscribe(({ visId, state }) => {
      if (state === 'started') {
        this._componentsHydrating.add(visId);
        this._hydratedCmps.update((s) => s.add(visId));
      } else {
        this._componentsHydrating.delete(visId);
      }
    });
  }

  private _listenForNetworkCalls() {
    new PerformanceObserver((list) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      list.getEntries().forEach((entry: any) => {
        if (entry.responseStart - entry.requestStart > 0) {
          this._totalFetched.update((t) => t + entry.transferSize);

          if (this._componentsHydrating.size) {
            this._fetchedResources.update((m) =>
              m.set(entry.name, entry.transferSize),
            );
          }
        }
      });
    }).observe({ type: 'resource', buffered: true });
  }
}
