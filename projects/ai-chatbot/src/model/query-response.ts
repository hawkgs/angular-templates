import { Record } from 'immutable';

interface QueryResponseConfig {
  messageId: string;
  id: string;
  response: string;
  createdAt: Date;
}

const queryResponseRecord = Record<QueryResponseConfig>({
  messageId: '',
  id: '',
  response: '',
  createdAt: new Date(0),
});

export class QueryResponse extends queryResponseRecord {
  constructor(config: Partial<QueryResponseConfig>) {
    super(config);
  }
}
