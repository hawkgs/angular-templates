import { RandNumsList } from './rand-nums-list.data-source';
import { DataSourceDefinition, DataSourceType } from './types';

// Data sources available for use by the widgets that support the specific type(s).
export const DATA_SOURCES: DataSourceDefinition[] = [
  {
    id: 'rand-nums-list',
    name: 'Random Numbers',
    type: DataSourceType.SingleValued,
    useClass: RandNumsList,
  },
  // Add a new definition here
];
