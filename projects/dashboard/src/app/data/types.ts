import { Signal, Type } from '@angular/core';
import { List, Record } from 'immutable';

// Data item type
export enum DataSourceType {
  SingleValued = 'SingleValued',
  List = 'List',
}

// Data item immutable object
interface DataItemConfig {
  label: string;
  value: number;
}

const dataItemRecord = Record<DataItemConfig>({
  label: '',
  value: 0,
});

export class DataItem extends dataItemRecord {
  constructor(config: Partial<DataItemConfig>) {
    super(config);
  }
}

// Tabular data item immutable object
interface TabularDataItemConfig {
  label: string;
  values: List<number>;
}

const tabularDataItemRecord = Record<TabularDataItemConfig>({
  label: '',
  values: List([]),
});

export class TabularDataItem extends tabularDataItemRecord {
  constructor(config: Partial<DataItemConfig>) {
    super(config);
  }
}

export type DataType = DataItem | List<DataItem> | List<TabularDataItem>;

// Definition type
export type DataSourceDefinition = {
  id: string;
  name: string;
  type: DataSourceType;
  useClass: Type<unknown>;
};

/**
 * Defines the interface of a data source service.
 */
export interface DataSource<T extends DataType> {
  /**
   * Data signal consumed by the widget.
   */
  data: Signal<T>;

  /**
   * Initialization method called every time a widget
   * that uses the data source is rendered.
   */
  init: () => void;
}
