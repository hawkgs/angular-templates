import { AfterViewInit, Directive, inject } from '@angular/core';
import { VISUALIZER } from './hydration-visualizer/hydration-visualizer.component';

const MARK_HYDRATED_DELAY = 500;

@Directive({
  selector: '[ecHydrationTarget]',
  standalone: true,
})
export class HydrationTargetDirective implements AfterViewInit {
  visualizer = inject(VISUALIZER);

  ngAfterViewInit() {
    setTimeout(() => {
      // We are marking a component hydrated after a
      // certain delay. This is helpful when the
      // component might initiate other network calls
      // like requesting images.
      this.visualizer.notify('hydrated');
    }, MARK_HYDRATED_DELAY);
  }
}
