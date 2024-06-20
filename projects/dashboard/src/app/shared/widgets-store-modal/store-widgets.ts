import { List } from 'immutable';
import {
  DataItem,
  DataSourceType,
  DataType,
  TabularData,
  TabularDataRow,
} from '../../data/types';
import { WidgetConfig, WidgetType } from '../widgets/widget';

export type WidgetStoreItem = {
  type: WidgetType;
  demoConfig: WidgetConfig;
  previewData: DataType;
  supportedSizes: number[];
  supportedDataSource: DataSourceType;
};

/**
 * List of available widgets to add to the dashboard.
 */
export const STORE_WIDGETS: WidgetStoreItem[] = [
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
  {
    type: 'line-chart',
    demoConfig: {},
    previewData: new TabularData({
      rows: List([
        new TabularDataRow({ values: List([10, 20, 30, 35]) }),
        new TabularDataRow({ values: List([5, 30, 10, 15]) }),
        new TabularDataRow({ values: List([25, 10, 0, 0]) }),
      ]),
      colLabels: List(['', '', '', '']),
    }),
    supportedSizes: [2, 3, 4],
    supportedDataSource: DataSourceType.Tabular,
  },
  {
    type: 'pie-chart',
    demoConfig: {},
    previewData: List([
      new DataItem({ value: 1 }),
      new DataItem({ value: 3 }),
      new DataItem({ value: 2 }),
    ]),
    supportedSizes: [1],
    supportedDataSource: DataSourceType.List,
  },
  {
    type: 'table',
    demoConfig: {},
    previewData: new TabularData({
      rows: List([
        new TabularDataRow({ values: List([10, 20, 30, 35]), label: 'i' }),
        new TabularDataRow({ values: List([5, 30, 10, 15]), label: 'ii' }),
        new TabularDataRow({ values: List([25, 10, 0, 0]), label: 'iii' }),
      ]),
      colLabels: List(['A', 'B', 'C', 'D']),
    }),
    supportedSizes: [2, 3, 4],
    supportedDataSource: DataSourceType.Tabular,
  },
  {
    type: 'scalar-data',
    demoConfig: {},
    previewData: new DataItem({ value: 42 }),
    supportedSizes: [1],
    supportedDataSource: DataSourceType.SingleValued,
  },
];
