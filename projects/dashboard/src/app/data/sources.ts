import { RandNumsList } from './rand-nums-list.data-source';
import { DataSourceDefinition, DataSourceType } from './types';

export const DATA_SOURCES: DataSourceDefinition[] = [
  {
    id: 'rand-nums-list',
    name: 'Random Numbers',
    type: DataSourceType.SingleValued,
    useClass: RandNumsList,
  },
];
