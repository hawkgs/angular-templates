import { Record } from 'immutable';

interface QueryConfig {
  id: string;
  query: string;
  createdAt: Date;
}

const queryRecord = Record<QueryConfig>({
  id: '',
  query: '',
  createdAt: new Date(0),
});

export class Query extends queryRecord {
  constructor(config: Partial<QueryConfig>) {
    super(config);
  }
}
