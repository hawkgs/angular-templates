import {
  ChangeDetectionStrategy,
  Component,
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
import { IconComponent } from '@ngx-templates/shared/icon';

import { HydrationService } from '../hydration.service';
import { LoaderComponent } from '../../loader/loader.component';

const MAX_DELAY = 10000;

@Component({
  selector: 'ec-hydration-control-panel',
  standalone: true,
  imports: [CommonModule, SwitchComponent, LoaderComponent, IconComponent],
  templateUrl: './hydration-control-panel.component.html',
  styleUrl: './hydration-control-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HydrationControlPanelComponent {
  hydration = inject(HydrationService);
  private _win = inject(WINDOW);
  private _router = inject(Router);
  private _location = inject(Location);

  private _firstSkipped = false;

  MAX_DELAY = MAX_DELAY;

  visible = signal<boolean>(true);
  showHydrationStats = signal<boolean>(true);
  showOverlay = signal<boolean>(false);

  constructor() {
    const routerEvents = toSignal(this._router.events);

    effect(() => {
      const event = routerEvents();
      if (event instanceof NavigationEnd) {
        if (this._firstSkipped) {
          untracked(() => {
            // this.showHydrationStats.set(false);
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
    let delay = parseInt(target.value, 10);
    delay = !isNaN(delay) ? delay : 0;
    delay = Math.max(Math.min(delay, MAX_DELAY), 0);

    this.hydration.fetchDelay = delay;
  }
}
