import { DraggableDirective } from './src/draggable.directive';
import { DropGridComponent } from './src/drop-grid.component';

export { DraggableDirective } from './src/draggable.directive';
export { DropGridComponent } from './src/drop-grid.component';

export const DRAG_AND_DROP_DIRECTIVES = [
  DraggableDirective,
  DropGridComponent,
] as const;
