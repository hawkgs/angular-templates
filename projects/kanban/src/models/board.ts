import { Map, Record } from 'immutable';

import { BoardList } from './board-list';
import { Card } from './card';
import { Label } from './label';

interface BoardConfig {
  id: string;
  name: string;
  lists: Map<string, BoardList>;
  cards: Map<string, Card>;
  labels: Map<string, Label>;
}

const boardRecord = Record<BoardConfig>({
  id: '',
  name: '',
  lists: Map([]),
  cards: Map([]),
  labels: Map([]),
});

export class Board extends boardRecord {
  constructor(config: Partial<BoardConfig>) {
    super(config);
  }
}
