import { Component, computed, input, output } from '@angular/core';
import { WidgetType } from '../../widgets/widget';

const WIDGET_NAMES: { [key in WidgetType]: string } = {
  plain: 'Plain',
  'bar-chart': 'Bar Chart',
  'line-chart': 'Line Chart',
};

@Component({
  selector: 'db-widget-item',
  standalone: true,
  imports: [],
  templateUrl: './widget-item.component.html',
  styleUrl: './widget-item.component.scss',
})
export class WidgetItemComponent {
  type = input.required<WidgetType>();
  widgetName = computed(() => WIDGET_NAMES[this.type()]);
  widgetClick = output<WidgetType>();
}
