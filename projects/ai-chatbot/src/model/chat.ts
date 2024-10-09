import { List, Map, Record } from 'immutable';
import { Query } from './query';
import { QueryResponse } from './query-response';

interface ChatConfig {
  id: string;
  name: string;
  queries: List<Query>;
  responses: Map<string, QueryResponse>; // Message ID; Response
  createdAt: Date;
  updatedAt: Date;
}

const chatRecord = Record<ChatConfig>({
  id: '',
  name: '',
  queries: List(),
  responses: Map(),
  createdAt: new Date(0),
  updatedAt: new Date(0),
});

export class Chat extends chatRecord {
  constructor(config: Partial<ChatConfig>) {
    super(config);
  }
}
