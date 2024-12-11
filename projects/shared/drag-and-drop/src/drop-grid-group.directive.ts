import { Directive, InjectionToken } from '@angular/core';
import { DropGridComponent } from './drop-grid.component';

export const DROP_GRID_GROUP = new InjectionToken<Set<DropGridComponent>>(
  'DropGridGroup',
);

/**
 * Drop grid group host directive.
 *
 * Groups are NOT supported on a mobile.
 */
@Directive({
  selector: '[ngxDropGridGroup]',
  providers: [
    { provide: DROP_GRID_GROUP, useValue: new Set<DropGridComponent>() },
  ],
})
export class DropGridGroupDirective {}
