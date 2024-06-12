import { InputSignal, Signal } from '@angular/core';

export type WidgetType = 'plain' | 'bar-chart';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WidgetConfig = any;

export interface Widget<T extends WidgetConfig, U> {
  config: InputSignal<T>;
  data: Signal<U>;
}
