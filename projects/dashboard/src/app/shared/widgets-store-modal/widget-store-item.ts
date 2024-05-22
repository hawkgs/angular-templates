import { WidgetConfig, WidgetType } from '../widgets/widget';

export type WidgetStoreItem = {
  type: WidgetType;
  demoConfig: WidgetConfig;
  supportedSizes: number[];
  supportedDataSource: string;
};
