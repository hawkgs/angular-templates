import { DraggableDirective } from './draggable.directive';
import { DropGridComponent } from './drop-grid.component';

export { DraggableDirective } from './draggable.directive';
export { DropGridComponent } from './drop-grid.component';

export const DRAG_AND_DROP_DIRECTIVES = [
  DraggableDirective,
  DropGridComponent,
] as const;
