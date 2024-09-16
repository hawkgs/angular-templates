import {
  Component,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { SwitchComponent } from '@ngx-templates/shared/switch';
import { WINDOW } from '@ngx-templates/shared/services';
import { HydrationService } from '../hydration.service';
import { LoaderComponent } from '../../loader/loader.component';

@Component({
  selector: 'ec-hydration-stats',
  standalone: true,
  imports: [CommonModule, SwitchComponent, LoaderComponent],
  templateUrl: './hydration-stats.component.html',
  styleUrl: './hydration-stats.component.scss',
})
export class HydrationStatsComponent {
  hydration = inject(HydrationService);
  private _win = inject(WINDOW);
  private _router = inject(Router);
  private _location = inject(Location);

  private _firstSkipped = false;

  percentHydrated = computed(
    () =>
      (this.hydration.fetchedKbs() / this.hydration.totalFetchedKbs()) * 100,
  );

  showHydrationStats = signal<boolean>(true);
  showOverlay = signal<boolean>(false);

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

  onDisabledChange() {
    // We need to block the UI until the page is reloaded
    this.showOverlay.set(true);

    const disabled = !this.hydration.disabled;
    const queryParam = disabled ? 'hydration=false' : '';
    const path = this._location.path();
    let url = '';

    if (path.indexOf('?') > -1) {
      if (!disabled && path.includes('hydration=false')) {
        url = path.replace('hydration=false', '');
      } else {
        url = path + '&' + queryParam;
      }
    } else {
      url = path + '?' + queryParam;
    }

    // We need to force a reload
    this._win.location.href = url;
  }

  onDelayInput(e: Event) {
    const target = e.target as HTMLInputElement;
    const delay = parseInt(target.value, 10);
    this.hydration.fetchDelay = !isNaN(delay) ? delay : 0;
  }
}
