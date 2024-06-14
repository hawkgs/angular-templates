import { DataSourceDefinition, DataSourceType } from './types';

import { RandNumsList } from './rand-nums-list.data-source';
import { TrafficTable } from './traffic.data-source';
import { UsersNationalityList } from './users-nationality-list.data-source';

// Data sources available for use by the widgets that support the specific type(s).
export const DATA_SOURCES: DataSourceDefinition[] = [
  {
    id: 'rand-nums-list',
    name: 'Random Numbers',
    type: DataSourceType.SingleValued,
    useClass: RandNumsList,
  },
  {
    id: 'users-nationality-list',
    name: 'Users Nationality',
    type: DataSourceType.List,
    useClass: UsersNationalityList,
  },
  {
    id: 'traffic-table',
    name: 'Traffic',
    type: DataSourceType.Tabular,
    useClass: TrafficTable,
  },
  // Add a new definition here
];
