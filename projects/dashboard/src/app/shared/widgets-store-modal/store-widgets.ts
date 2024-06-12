import { List } from 'immutable';
import { DataItem, DataSourceType, DataType } from '../../data/types';
import { WidgetConfig, WidgetType } from '../widgets/widget';

export type WidgetStoreItem = {
  type: WidgetType;
  demoConfig: WidgetConfig;
  previewData: DataType;
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
  {
    type: 'bar-chart',
    demoConfig: {},
    previewData: List([
      new DataItem({ value: 1 }),
      new DataItem({ value: 3 }),
      new DataItem({ value: 2 }),
    ]),
    supportedSizes: [2, 3, 4],
    supportedDataSource: DataSourceType.List,
  },
];
