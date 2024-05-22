import { DataItem, DataSourceType } from '../../data/types';
import { WidgetConfig, WidgetType } from '../widgets/widget';

export type WidgetStoreItem = {
  type: WidgetType;
  demoConfig: WidgetConfig;
  previewData: DataItem;
  supportedSizes: number[];
  supportedDataSource: DataSourceType;
};

// List of available widgets to add to the dashboard.
export const STORE_WIDGETS: WidgetStoreItem[] = [
  {
    type: 'plain',
    demoConfig: { style: 'grey' },
    previewData: new DataItem({ value: 1337 }),
    supportedSizes: [1, 2, 3, 4],
    supportedDataSource: DataSourceType.SingleValued,
  },
];
