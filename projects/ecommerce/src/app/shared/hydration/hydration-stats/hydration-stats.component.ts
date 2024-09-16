import {
  Component,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { HydrationService } from '../hydration.service';

@Component({
  selector: 'ec-hydration-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hydration-stats.component.html',
  styleUrl: './hydration-stats.component.scss',
})
export class HydrationStatsComponent {
  hydration = inject(HydrationService);
  private _router = inject(Router);

  private _firstSkipped = false;

  percentHydrated = computed(
    () =>
      (this.hydration.fetchedKbs() / this.hydration.totalFetchedKbs()) * 100,
  );

  showHydrationStats = signal<boolean>(true);

  constructor() {
    const routerEvents = toSignal(this._router.events);

    effect(() => {
      const event = routerEvents();
      if (event instanceof NavigationEnd) {
        if (this._firstSkipped) {
          untracked(() => {
            this.showHydrationStats.set(false);
          });
        }
        this._firstSkipped = true;
      }
    });
  }
}
