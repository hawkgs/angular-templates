import { Signal, Type } from '@angular/core';
import { List, Record } from 'immutable';

export enum DataSourceType {
  SingleValued = 'SingleValued',
  List = 'List',
}

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

export type DataType = DataItem | List<DataItem>;

export interface DataSource<T extends DataType> {
  data: Signal<T>;
}

export type DataSourceDefinition = {
  id: string;
  name: string;
  type: DataSourceType;
  useClass: Type<unknown>;
};
