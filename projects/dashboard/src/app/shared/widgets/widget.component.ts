import { Component, HostBinding, input, output } from '@angular/core';
import { IconComponent } from '@ngx-templates/shared/icon';
import { PlainWidgetComponent } from './plain-widget/plain-widget.component';
import { WidgetConfig } from './widget';

export type WidgetType = 'plain';

@Component({
  selector: 'db-widget',
  standalone: true,
  imports: [IconComponent, PlainWidgetComponent],
  templateUrl: './widget.component.html',
  styleUrl: './widget.component.scss',
})
export class WidgetComponent {
  type = input.required<WidgetType>();
  size = input<number>(1);
  config = input<WidgetConfig>();
  editMode = input<boolean>(false);
  remove = output<void>();

  @HostBinding('style.grid-column')
  get gridColumn() {
    return 'span ' + this.size().toString();
  }
}
