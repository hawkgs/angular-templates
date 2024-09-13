import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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

  percentHydrated = computed(
    () =>
      (this.hydration.fetchedKbs() / this.hydration.totalFetchedKbs()) * 100,
  );
}
