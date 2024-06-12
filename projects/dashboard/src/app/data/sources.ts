import { RandNumsList } from './rand-nums-list.data-source';
import { DataSourceDefinition, DataSourceType } from './types';
import { UsersNationalityList } from './users-nationality.data-source';

// Data sources available for use by the widgets that support the specific type(s).
export const DATA_SOURCES: DataSourceDefinition[] = [
  {
    id: 'rand-nums-list',
    name: 'Random Numbers',
    type: DataSourceType.SingleValued,
    useClass: RandNumsList,
  },
  {
    id: 'users-nationality-listt',
    name: 'Users Nationality',
    type: DataSourceType.List,
    useClass: UsersNationalityList,
  },
  // Add a new definition here
];
