import { HydrationTargetDirective } from './hydration-target.directive';
import { HydrationVisualizerComponent } from './hydration-visualizer/hydration-visualizer.component';

export const HYDRATION_DIRECTIVES = [
  HydrationVisualizerComponent,
  HydrationTargetDirective,
] as const;

export { HydrationStatsComponent } from './hydration-stats/hydration-stats.component';
