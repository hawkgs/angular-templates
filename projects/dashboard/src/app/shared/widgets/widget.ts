import { InputSignal } from '@angular/core';

export type WidgetType = 'plain';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WidgetConfig = any;

export interface Widget<T extends WidgetConfig> {
  config: InputSignal<T>;
}
