import {
  computed,
  inject,
  Injectable,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { isPlatformServer, Location } from '@angular/common';
import { Map, Set as ImmutSet } from 'immutable';
import { WINDOW } from '@ngx-templates/shared/services';

import { HydrationVisualizerComponent } from './hydration-visualizer/hydration-visualizer.component';

type ExtWindow = Window & { swSetFetchDelay: (d: number) => void };

@Injectable({ providedIn: 'root' })
export class HydrationService {
  private _win = inject<ExtWindow>(WINDOW);
  private _platformId = inject(PLATFORM_ID);
  private _location = inject(Location);

  private _hydratedCmps = signal<ImmutSet<string>>(ImmutSet());
  private _fetchedResources = signal<Map<string, number>>(Map());
  private _totalFetched = signal<number>(0);

  hydratedCmps = computed(() => this._hydratedCmps().size);

  // Hydrated
  fetchedKbs = computed(
    () => this._fetchedResources().reduce((acc, curr) => acc + curr, 0) / 1024,
  );

  // Everything
  totalFetchedKbs = computed(() => this._totalFetched() / 1024);

  disabled = this._location.path().includes('hydration=false');
  fetchDelay = 0; // in ms

  private _componentsHydrating = new Set<string>();

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
      if (isPlatformServer(this._platformId)) {
        return;
      }
      if (state === 'started') {
        // Set a fetch delay on a hydration start
        this._win.swSetFetchDelay(this.fetchDelay);

        this._componentsHydrating.add(visId);
        this._hydratedCmps.update((s) => s.add(visId));
      } else {
        this._componentsHydrating.delete(visId);

        // If there are no more hydrating components, unset the delay
        if (!this._componentsHydrating.size) {
          this._win.swSetFetchDelay(0);
        }
      }
    });
  }

  private _listenForNetworkCalls() {
    new PerformanceObserver((list) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      list.getEntries().forEach((entry: any) => {
        if (entry.responseStart - entry.requestStart > 0) {
          // If the SW is enabled, the transfer size will be 0
          const size = entry.transferSize || entry.encodedBodySize;
          this._totalFetched.update((t) => t + size);

          if (this._componentsHydrating.size) {
            this._fetchedResources.update((m) => m.set(entry.name, size));
          }
        }
      });
    }).observe({ type: 'resource', buffered: true });
  }
}
