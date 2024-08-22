import { List, Record } from 'immutable';

interface CardConfig {
  id: string;
  title: string;
  description: string;
  idx: number;
  listId: string;
  labelIds: List<string>;
}

const cardRecord = Record<CardConfig>({
  id: '',
  title: '',
  description: '',
  idx: -1,
  listId: '',
  labelIds: List([]),
});

export class Card extends cardRecord {
  constructor(config: CardConfig) {
    super(config);
  }
}
