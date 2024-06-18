import { InputSignal } from '@angular/core';

export type WidgetType = 'plain' | 'bar-chart' | 'line-chart' | 'pie-chart';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WidgetConfig = any;

export interface Widget<T extends WidgetConfig, U> {
  config: InputSignal<T>;
  data: InputSignal<U>;
}
