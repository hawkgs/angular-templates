import { Component, HostBinding, input, signal } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { CommonModule } from '@angular/common';

// The breakpoints should kept in sync with _screen-breakpoints.scss,
// if changes are required.
type ScreenBreakpoint = '400w' | '600w' | '800w' | '1000w' | '1100w';

/**
 * Expandable container.
 */
@Component({
  selector: 'ec-expandable-cont',
  standalone: true,
  imports: [IconComponent, CommonModule],
  templateUrl: './expandable-cont.component.html',
  styleUrl: './expandable-cont.component.scss',
})
export class ExpandableContComponent {
  /**
   * Use for enhancing responsiveness.
   *
   * Provide an activation context (e.g. `400w` => will activate, if the screen `max-width: 400w`).
   * The container is active by default. An inactive container will render the
   * content straightaway without expand/collapse functionality.
   *
   * Refer to `_screen-breakpoints.scss` for the exact breakpoints sizes.
   */
  activateAt = input<ScreenBreakpoint | null>(null);
  expanded = signal<boolean>(false);

  @HostBinding('class.expanded')
  get isExpanded() {
    return this.expanded();
  }

  toggle() {
    this.expanded.set(!this.expanded());
  }
}
