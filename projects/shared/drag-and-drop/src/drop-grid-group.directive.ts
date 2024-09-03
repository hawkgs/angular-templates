import { Directive, InjectionToken } from '@angular/core';
import { DropGridComponent } from './drop-grid.component';

export const DROP_GRID_GROUP = new InjectionToken<Set<DropGridComponent>>(
  'DropGridGroup',
);

@Directive({
  selector: '[ngxDropGridGroup]',
  standalone: true,
  providers: [
    { provide: DROP_GRID_GROUP, useValue: new Set<DropGridComponent>() },
  ],
})
export class DropGridGroupDirective {}
